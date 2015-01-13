'use strict';


function text_field_editor_directive() {
    function controller($scope, $element, $attrs, $transclude) {
        $scope.canEdit = $scope.$parent.$eval($attrs.canEdit);
        $scope.field = $scope.$parent.$eval($attrs.ngModel);
        $scope.onSave = function (locals) {
            $scope.$parent.$eval($attrs.onSave, locals);
        }
        $scope.displayName = $attrs.displayName;
        $scope.DisplayName = $scope.displayName
            .replace(/^./, function (m) {return m.toUpperCase()});

        // Give the transcluded elements our scope
        $transclude($scope, function (clone) {
            if (clone.length) $element.find('div.transclude').html(clone);
        })
    }

    return {
        controller: controller,
        require: ['ngModel'],
        restrict: 'E',
        templateUrl: "text-field-editor.html",
        transclude: true,
        scope: true
    }
}


angular
    .module('buildbotics.text-field-editor', [])
    .directive('bbTextFieldEditor', text_field_editor_directive)
