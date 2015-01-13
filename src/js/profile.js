function profile_directive($buildbotics, $notify) {
    function link($scope, element, attrs, ctrl) {
        $.extend($scope, $scope.profile_data);

        $scope.api_url = '/api/profiles/' + $scope.profile.name;

        $scope.is_owner = function () {
            return $buildbotics.isUser($scope.profile.name);
        }

        $scope.save = function (field, value) {
            var data = {};
            data[field] = value;

            $buildbotics.put($scope.api_url, data)
                .success(function () {
                    $scope.profile[field] = value;

                }).error(function (data, status) {
                    $notify.error('Save failed', 'Failed to save ' + field +
                                  '\n' + status)
                });
        }
    }

    return {
        link: link,
        require: ['ngModel'],
        restrict: 'E',
        templateUrl: 'profile.html',
        scope: {
            profile_data: '=ngModel'
        }
    }
}


angular
    .module('buildbotics.profiles', [])
    .directive('bbProfile', profile_directive)
