'use strict';


function marked_service() {
    var opts = {};

    return {
        config: function (newOpts) {opts = newOpts;},
        $get: function () {
            var m = marked;
            m.setOptions(opts);
            return m;
        }
    }
}


function markdown_directive($sanitize, $marked) {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        template: '<div class="markdown" ng-transclude></div>',
        transclude: true,

        link: function (scope, element, attrs, model) {
            function render() {
                var value = (model ? model.$modelValue : element.text()) || '';
                element.html($sanitize($marked(value)));
            }

            if (model) scope.$watch(attrs.ngModel, render);
            render();
        }
    }
}


function markdown_editor_postlink(scope, element, attrs, ngModel) {
    var options, opts, codeMirror, initialTextValue;

    initialTextValue = element.text();

    options = {};
    opts = angular.extend({value: initialTextValue}, options,
                          scope.$eval(attrs.options));

    var editor = new Editor(opts);

    // Change the info toolbar action
    var items = editor.options.toolbar;
    for (var i = 0; i < items.length; i++)
        if (items[i].name == 'info') items[i].action = '/markdown.html';

    editor.render(element.find('textarea')[0]);
    codeMirror = editor.codemirror;

    if (attrs.options) {
        var defaultsKeys = Object.keys(window.CodeMirror.defaults);

        scope.$watch
        (attrs.options,
         function updateOptions(newValues, oldValue) {
             if (!angular.isObject(newValues)) return;

             defaultsKeys.forEach(function (key) {
                 if (newValues.hasOwnProperty(key)) {
                     if (oldValue && newValues[key] === oldValue[key]) return;
                     codeMirror.setOption(key, newValues[key]);
                 }
             });
         }, true);
    }

    if (ngModel) {
        // CodeMirror expects a string, so make sure it gets one.
        // This does not change the model.
        ngModel.$formatters.push(function (value) {
            if (angular.isUndefined(value) || value === null) return '';

            else if (angular.isObject(value) || angular.isArray(value))
                throw new Error('Cannot use an object or an array as a model');

            return value;
        });

        // Override the ngModelController $render method, which is what gets
        // called when the model is updated. This takes care of the
        // synchronizing the codeMirror element with the underlying model, in
        // the case that it is changed by something else.
        ngModel.$render = function () {
            codeMirror.setValue(ngModel.$viewValue || '');
        };

        // Keep the model in sync
        codeMirror.on('change', function (instance) {
            var newValue = instance.getValue();

            if (newValue !== ngModel.$viewValue)
                // Changes to the model from a callback need to be wrapped in
                // $apply or angular will not notice them
                scope.$apply(function() {ngModel.$setViewValue(newValue);});
        });
    }

    // Watch ui-refresh and refresh the directive
    if (attrs.uiRefresh) {
        scope.$watch(attrs.uiRefresh, function (newVal, oldVal) {
            // Skip the initial watch firing
            if (newVal !== oldVal) codeMirror.refresh();
        });
    }
}


function markdown_editor_directive() {
    return {
        restrict: 'AE',
        require: '?ngModel',
        template: '<div class="markdowneditor"><textarea></textarea></div>',
        replace: true,

        compile: function () {
            if (angular.isUndefined(window.Editor))
                throw new Error('markdown editor needs Editor');

            return markdown_editor_postlink;
        }
    }
}


angular
    .module('buildbotics.markdown', ['ngSanitize'])
    .provider('$marked', marked_service)
    .directive('markdown', markdown_directive)
    .directive('markdowneditor', markdown_editor_directive);
