'use strict';


function explore_directive($buildbotics) {
    function link($scope, element, attrs, ctrl) {
        $scope.obj = {};
        $scope.query = '';

        $scope.search = function () {
            var options = {
                query: $scope.query
            };

            $buildbotics.get('/api/things', {params: options})
                .success(function (things) {
                    $scope.obj.things = things;
                });
        }

        $scope.search();
    }

    return {
        link: link,
        restrict: 'E',
        templateUrl: 'explore.html',
        scope: {}
    }
}


angular
    .module('buildbotics.explore', [])
    .directive('bbExplore', explore_directive)
