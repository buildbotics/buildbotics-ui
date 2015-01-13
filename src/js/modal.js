'use strict';


function modal_directive() {
    function link($scope, element, attrs) {
        $scope.title = attrs.title;

        var overlay =
            $('<div>').css({
                height: '100%',
                width: '100%',
                position: 'fixed',
                left: 0,
                top: 0,
                'z-index': 1000
            });

        function open_modal() {
            overlay
                .prependTo($('body'))
                .on('click', function () {
                    $scope.$apply(function () {$scope.show = false});
                })
                .show();

            element
                .css({
                    position: 'absolute',
                    'z-index': 1001
                }).show();

            $scope.$eval(attrs.onShow);
        }

        function close_modal() {
            overlay.remove();
            element.hide();
            $scope.$eval(attrs.onClose);
        }

        if (!$scope.show) element.hide();

        $scope.$watch(
            'show',
            function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue) open_modal();
                    else close_modal();
                }
        })

        $scope.$on('$destroy', close_modal);
    }

    return {
        link: link,
        restrict: 'E',
        templateUrl: 'modal.html',
        transclude: true,
        replace: true,
        scope: {show: '='}
    }
}


angular
    .module('buildbotics.modal', [])
    .directive('bbModal', modal_directive);
