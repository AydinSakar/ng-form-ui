angular.module('ng-form-ui').
    /**
     * <select-box ng-model="model.property" options="models" optExp="t.name for t in options"></select-box>
     * Required attribute: ng-model="[expression]"
     * Required attribute: optExp="[comprehension_expression]"
     * Optional attribute: name="xxxx"
     * Optional attribute: defaultLabel="xxxx" (used if ng-model is undefined or null)
     */
    directive('selectBox', function () {
        return {
            replace: true,
            restrict: 'E',
            scope: false,
            template: function (el, attrs) {
                if (!angular.isDefined(attrs.defaultLabel)) {
                    attrs.defaultLabel = "";
                }
                var html = '<div class="ngSelectBox">'+
                    '<span>{{ "' + attrs.defaultLabel + '" }}</span>'+
                    '<select' + ((attrs.name) ? ' name="' + attrs.name + '"' : '') + ' ng-model="' + attrs.ngModel + '" ng-options="' + attrs.optexp + '"' + ((attrs.required) ? ' required' : '') + '></select>'+
                    '</div>';
                return html;
            },
            link: function (scope, el, attrs) {
                scope.$watch(attrs.ngModel, function () {
                    var model = scope.$eval(attrs.ngModel);
                    //when value changes, update the selectBox text
                    if (angular.isElement(el[0].firstChild) && angular.isDefined(model) && model != null && angular.isDefined(model.name)) {
                        el[0].firstChild.innerText = model.name;
                    }
                });
            }
        }
    });