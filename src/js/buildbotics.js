'use strict';


function buildbotics_service($http, $q, $cookies) {
    function api_cb(method, url, data, config) {
        config = $.extend({
            method: method,
            url: url,
            data: data
        }, config);

        // Add authorization header
        var sid = $cookies['buildbotics.sid'];
        if (sid) {
            var auth = 'Token ' + sid;
            config.headers = $.extend({Authorization: auth}, config.headers);
        }

        var success_cb = function () {};
        var error_cb = function () {};

        var promise = $http(config)
            .success(function (data, status, headers, config) {
                // TODO check for errors
                return success_cb(data, status, headers, config);
            })

            .error(function (data, status, headers, config) {
                return error_cb(data, status, headers, config);
            })

        promise.success = function (cb) {
            success_cb = cb || success_cb;
            return promise;
        }

        promise.error = function (cb) {
            error_cb = cb || error_cb;
            return promise;
        }

        return promise;
    }

    var self = {
        user: {},
    }

    self.extend = function ($scope) {
        $.extend($scope, self);
    }

    self.logged_in = function (user) {
        console.log('Logged in as ' + user.name);
        $.extend(self.user, user);
        self.user.authenticated = true;
    }

    self.logged_out = function () {
        delete $cookies['buildbotics.sid'];
        self.user.name = undefined;
        self.user.authenticated = false;
    }

    self.isUser = function(name) {
        return self.user.name == name;
    }

    self.logout = function () {
        self.get('/api/auth/logout').success(self.logged_out);
    }

    self.get = function (url, config) {
        return api_cb('GET', url, undefined, config);
    }

    self.put = function(url, data, config) {
        return api_cb('PUT', url, data, config);
    }

    self.post = function(url, data, config) {
        return api_cb('POST', url, data, config);
    }

    self.delete = function (url, config) {
        return api_cb('DELETE', url, undefined, config);
    }

    self.licenses = []
    self.get('/api/licenses').success(function (data) {
        for (var i = 0; i < data.length; i++)
            self.licenses.push(data[i]);
    })

    return self;
}


// Filters *********************************************************************
function human_size_filter() {
    return function (bytes, precision) {
        if (!bytes || isNaN(bytes)) return '';
        if (typeof precision == 'undefined') precision = 1;

        var i;
        for (i = 0; 1024 < bytes && i < 4; i++) bytes /= 1024;

        bytes = bytes.toFixed(precision);

        return Number(bytes) + ' ' + ['Bytes', 'KB', 'MB', 'GB', 'TB'][i];
    }
}


function human_number_filter() {
    return function (bytes, precision) {
        if (!bytes || isNaN(bytes)) return '';
        if (typeof precision == 'undefined') precision = 0;

        var i;
        for (i = 0; 1024 < bytes && i < 4; i++) bytes /= 1024;

        bytes = bytes.toFixed(precision);

        return Number(bytes) + ['', ' k', 'm', 'b', 't'][i];
    }
}


function time_since_filter() {
    return function (time) {
        return moment(time).fromNow();
    }
}


// Directives ******************************************************************
function username_directive($q, $buildbotics) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.username = function (name) {
                if (ctrl.$isEmpty(name)) return $q.when(false);

                var def = $q.defer();

                $buildbotics.get('/api/profiles/' + name + '/available')
                    .success(function (result) {
                        if (result) def.resolve();
                        else def.reject();
                    }).error(function () {def.reject();});

                return def.promise;
            };
        }
    }
}


function thingname_directive($q, $buildbotics) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$validators.shortName = function (name) {
                return name.length != 1;
            };
            ctrl.$validators.longName = function (name) {
                return name.length <= 64;
            };
            ctrl.$validators.validChars = function (name) {
                return /^[\w_.]*$/.test(name);
            };

            ctrl.$asyncValidators.available = function (name) {
                if (ctrl.$isEmpty(name)) return $q.when(false);

                var def = $q.defer();

                $buildbotics.get('/api/profiles/' +
                                 $buildbotics.user.name + '/things/' +
                                 name + '/available')
                    .success(function (result) {
                        if (result === true) def.resolve();
                        else def.reject();
                    }).error(function () {def.reject();});

                return def.promise;
            };
        }
    }
}


function on_keypress_directive() {
    return function (scope, element, attrs) {
        function applyKeypress() {
            scope.$apply(attrs.onKeypress);
        };           
        
        var allowedKeys = scope.$eval(attrs.keys);

        element.bind('keyup', function(e) {
            // If no key restriction specified, always fire
            if (!allowedKeys || allowedKeys.length == 0) applyKeypress();
            else
                angular.forEach(allowedKeys, function(key) {
                    if (key == e.which) applyKeypress();
                })
        })
    }
}


function on_enter_directive() {
    return function (scope, element, attrs) {
        element.bind('keyup', function(e) {
            if (e.which == 13) scope.$apply(attrs.onEnter);
        })
    }
}


angular
    .module('buildbotics.service', [])
    .factory('$buildbotics', buildbotics_service)
    .filter('HumanSize', human_size_filter)
    .filter('HumanNumber', human_number_filter)
    .filter('TimeSince', time_since_filter)
    .directive('username', username_directive)
    .directive('thingname', thingname_directive)
    .directive('onKeypress', on_keypress_directive)
    .directive('onEnter', on_enter_directive)
