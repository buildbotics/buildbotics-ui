'use strict';


function text_area_editor_directive() {
    function link($scope, element, attrs, ctrl, transclude) {
        $scope.DisplayName = $scope.displayName
            .replace(/^./, function (m) {return m.toUpperCase()})
    }

    return {
        link: link,
        require: ['ngModel'],
        restrict: 'E',
        templateUrl: "text-area-editor.html",
        scope: {
            displayName: '@',
            canEdit: '=',
            field: '=ngModel',
            onSave: '&'
        }
    }
}


angular
    .module('buildbotics.text-area-editor', [])
    .directive('bbTextAreaEditor', text_area_editor_directive)
