'use strict';


function create_controller($scope, $buildbotics, $location, $notify) {
    $buildbotics.extend($scope);
    $scope.thing = {name: '', title: ''};
    $scope.ok = function () {
        var url = '/api/profiles/' + $buildbotics.user.name + '/things/' +
            $scope.thing.name;

        var thing = '/' + $buildbotics.user.name + '/' + $scope.thing.name;

        $buildbotics.put(url, {type: 'thing', title: $scope.thing.title})
            .success(function (data) {
                if (data != 'ok')
                    $notify.error('Failed to create thing',
                                  'Failed to create ' + thing + '\n' +
                                  JSON.stringify(data));
                else $location.path(thing);

            }).error(function (data, status) {
                $notify.error('Failed to create thing',
                              'Failed to create ' + thing + '\n' + status);
            });
    };
}


angular
    .module('buildbotics.create', [])
    .controller('CreateCtrl', create_controller)
