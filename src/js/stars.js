function stars_directive($buildbotics) {
    return {
        require: ['ngModel'],
        restrict: 'E',
        replace: true,
        templateUrl: 'stars.html',
        scope: {
            stars: '=ngModel',
            starred: '=',
            onToggle: '&'
        }
    }
}


angular
    .module('buildbotics.stars', [])
    .directive('bbStars', stars_directive)
