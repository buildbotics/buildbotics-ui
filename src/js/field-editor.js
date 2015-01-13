'use strict';


function field_editor_directive($compile) {
    function controller($scope, $element, $attrs, $transclude) {
        $scope.canEdit = $scope.$parent.$eval($attrs.canEdit);
        $scope.field = $scope.$parent.$eval($attrs.ngModel);
        $scope.onSave = function (locals) {
            $scope.$parent.$eval($attrs.onSave, locals)
        }
        $scope.editing = false;

        $scope.toggleEdit = function () {
            if ($scope.editing) $scope.cancel();
            else $scope.edit();
        }

        $scope.edit = function () {
            if (!$scope.canEdit || $scope.editing) return;

            $scope.editing = true;
            $scope.old = $scope.field;
        }

        $scope.cancel = function () {
            if (!$scope.canEdit || !$scope.editing) return;

            $scope.editing = false;
            $scope.field = $scope.old;
        }

        $scope.save = function () {
            if (!$scope.canEdit) return;

            $scope.editing = false;

            if ($scope.field != $scope.old)
                $scope.onSave({value: $scope.field});
        };

        // Give the transcluded elements our scope
        $transclude($scope, function (clone, $scope) {
            $element.replaceWith(clone);
        })
    }

    return {
        controller: controller,
        require: ['ngModel'],
        restrict: 'E',
        transclude: true,
        scope: true
    }
}


angular
    .module('buildbotics.field-editor', [])
    .directive('bbFieldEditor', field_editor_directive)
