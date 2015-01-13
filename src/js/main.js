// App Config ******************************************************************
function route_get_profile($buildbotics, $route) {
  var profile = $route.current.params.profile;

  return $buildbotics.get('/api/profiles/' + profile)
    .success(function (data) {return data;});
}


function route_get_thing($buildbotics, $route) {
  var profile = $route.current.params.profile;
  var thing = $route.current.params.thing;

  return $buildbotics.get('/api/profiles/' + profile + '/things/' + thing)
    .success(function (data) {return data;});
}


function module_config($routeProvider, $locationProvider) {
  $routeProvider
    .when('/_=_', {redirectTo: '/'}) // Fix facebook URL hash cruft
    .when('/', {page: 'home'})
    .when('/explore', {page: 'explore'})
    .when('/create', {page: 'create'})
    .when('/build', {page: 'build'})
    .when('/settings', {page: 'settings'})
    .when('/:profile', {
      page: 'profile',
      resolve: {profile: route_get_profile}
    })
    .when('/:profile/:thing', {
      page: 'thing',
      resolve: {thing: route_get_thing}
    })
    .otherwise({page: '404'});

  $locationProvider.html5Mode(true);
}


// Body Controller *************************************************************
function body_controller($scope, $buildbotics, $modal) {
  $buildbotics.extend($scope);

  $scope.register = function (suggestions) {
    $modal.open({
      templateUrl: 'register.html',
      controller: 'RegisterDialogCtrl',
      resolve: {
        name: function () {return name;},
        suggestions: function () {return suggestions;}
      }

    }).result.then(function (name) {
      $buildbotics.put('/api/profiles/' + name + '/register')
        .success(function (data) {
          if (data == 'ok') {
            load_user();
            // TODO Go to profile view

          } else $buildbotics.logged_out();
        }).error($buildbotics.logged_out);
    }, $buildbotics.logged_out);
  };


  function load_user() {
    $buildbotics.get('/api/auth/user').success(function (data) {
      if (typeof data.profile != 'undefined') {
        if (typeof data.profile.lastseen != 'undefined') {
          $buildbotics.logged_in(data.profile);
          return;

        } else if (typeof data.profile.name != 'undefined') {
          // Authenticated but we need to register
          $buildbotics.get('/api/suggest')
            .success(function (suggestions) {
              // TODO check for errors
              $scope.register(suggestions);

            }).error($buildbotics.logged_out);

          return;
        }
      }

      $buildbotics.logged_out();
    });
  }

  load_user();
}


// Content Controller **********************************************************
function content_controller($scope, $route, $routeParams, $location, $cookies) {
  $scope.$on(
    '$routeChangeSuccess',
    function (event, current, previous, rejection) {
      if ($location.path().indexOf('/api/auth') == 0) {
        // Do real redirect for login
        window.location.href = $location.path();

      } else {
        console.log('page: ' + $route.current.page);
        $scope.page = $route.current.page;

        if ($route.current.locals.profile)
          $scope.profile_data = $route.current.locals.profile.data;

        if ($route.current.locals.thing) {
          $scope.thing_data = $route.current.locals.thing.data;

          // Separate files from images
          var both = $scope.thing_data.files;
          var files = [];
          var images = [];
          for (var i = 0; i < both.length; i++) {
            both[i].name = both[i].file;

            if (both[i].display) images.push(both[i]);
            else files.push(both[i]);
          }

          $scope.thing_data.files = files;
          $scope.thing_data.images = images;
        }
      }
    });
}


// Register Dialog Controller **************************************************
function register_dialog_controller($scope, $modalInstance, suggestions) {
  $scope.user = {};
  $scope.user.name = suggestions.length ? suggestions[0] : '';
  $scope.user.suggestions = suggestions;
  $scope.ok = function () {$modalInstance.close($scope.user.name);};
  $scope.cancel = function () {$modalInstance.dismiss('cancel');};

  $scope.hitEnter = function(e) {
    if (angular.equals(e.keyCode,13) &&
        !(angular.equals($scope.user.name, null) ||
          angular.equals($scope.user.name, '')))
      $scope.ok();
  };
}


function buildbotics_run($rootScope, $cookies, $window, $document, $location) {
  // Recover path after login
  $rootScope.$on(
    '$locationChangeStart',
    function (event, newUrl) {
      // Parse URL
      var a = document.createElement('a');
      a.href = newUrl;
      var path = a.pathname;

      if (path == '/' && $cookies['buildbotics.pre-login-path']) {
        // Restore location after login
        $location.path($cookies['buildbotics.pre-login-path']);
        delete $cookies['buildbotics.pre-login-path'];
        event.preventDefault();

      } else if (path.indexOf('/api/auth/') == 0)
        // Save location before login
        $cookies['buildbotics.pre-login-path'] =
        $window.location.pathname;
    }
  )
}


function exception_handler($log, $window, $injector) {
  var getSourceMappedStackTrace = function(exception) {
    var $q = $injector.get('$q'),
    $http = $injector.get('$http'),
    SMConsumer = window.sourceMap.SourceMapConsumer,
    cache = {};

    // Retrieve a SourceMap object for a minified script URL
    var getMapForScript = function(url) {
      if (cache[url]) return cache[url];
      else {
        var promise = $http.get(url).then(function(response) {
          var m =
            response.data.match(/\/\/# sourceMappingURL=(.+\.map)/);

          if (m) {
            var path = url.match(/^(.+)\/[^\/]+$/);

            path = path && path[1];
            return $http.get(path + '/' + m[1])
              .then(function(response) {
                return new SMConsumer(response.data);
              })

          } else return $q.reject();
        });
        cache[url] = promise;
        return promise;
      }
    }

    if (exception.stack) { // not all browsers support stack traces
      return $q.all
      ($.map(exception.stack.split(/\n/), function(stackLine) {
        var match = stackLine.match(/^(.+)(http.+):(\d+):(\d+)/);
        if (match) {
          var prefix = match[1],
          url = match[2],
          line = match[3],
          col = match[4];

          return getMapForScript(url).then(function(map) {
            var pos = map.originalPositionFor({
              line: parseInt(line, 10),
              column: parseInt(col, 10)
            });

            var mangledName =
              prefix.match(/\s*(at)?\s*(.*?)\s*(\(|@)/);
            mangledName = (mangledName && mangledName[2]) || '';
            return '    at ' + (pos.name ? pos.name : mangledName) +
              ' ' + $window.location.origin + pos.source + ':' +
              pos.line + ':' + pos.column;

          }, function() {return stackLine});

        } else return $q.when(stackLine);
      })).then(function (lines) {return lines.join('\n');});

    } else return $q.when('');
  }

  return function(exception) {
    getSourceMappedStackTrace(exception).then($log.error);
  }
}

// Main ************************************************************************
$(function() {
  // Tooltips
  $('a[title]').each(function () {
    $(this).attr({
      tooltip: $(this).attr('title'),
      'tooltip-placement': 'bottom',
      'tooltip-append-to-body': true,
      title: ''
    });
  });

  // Angular setup
  var deps = (
    'ngRoute ngCookies ngTouch ui.bootstrap ui.bootstrap.modal');

  var bb_deps = (
    'service notify things modal markdown upload file-manager comments ' +
      'profiles stars create explore field-editor text-field-editor ' +
      'text-area-editor');

  // Compose deps
  deps = deps.split(' ');
  deps = deps.concat(bb_deps
                     .split(' ')
                     .map(function (x) {return 'buildbotics.' + x;}));

  angular
    .module('buildbotics', deps)
    .config(module_config)
    .controller('BodyCtrl', body_controller)
    .controller('ContentCtrl', content_controller)
    .controller('RegisterDialogCtrl', register_dialog_controller)
    .controller('CreateCtrl', create_controller)
    .run(buildbotics_run)
    .factory('$exceptionHandler', exception_handler)

  angular.bootstrap(document.documentElement, ['buildbotics']);
})
