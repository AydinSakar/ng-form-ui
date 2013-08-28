/*! ng-form-ui v0.1.2 | https://github.com/bkuhl/ng-form-ui */
/*global angular */

angular.module('ng-form-ui', []);
angular.module('ng-form-ui').
    /**
     * <input focus-me/>
     */
    directive('focusMe', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element) {
                $timeout(function () {
                    element[0].focus();
                });
            }
        };
    }]);
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
                if (!angular.isDefined(attrs.defaultlabel)) {
                    attrs.defaultlabel = "";
                }
                if (!angular.isDefined(attrs.optexp)) {
                    console.error("A comprehension expression must be defined with the attribute optExp for selectBox", attrs);
                }
                var html = '<div class="ngSelectBox' + ((angular.isDefined(attrs.class)) ? ' ' + attrs.class : '') + '">'+
                    '<span>{{ "' + attrs.defaultlabel + '" }}</span>'+
                        '<select ng-model="' + attrs.ngModel + '" ng-options="' + attrs.optexp + '"' + ((attrs.required) ? ' required' : '') + '' + ((angular.isDefined(attrs.id)) ? ' id="'+attrs.id+'"' : '') + '' + ((attrs.name) ? ' name="' + attrs.name + '"' : '') + '></select>'+
                    '</div>';
                return html;
            },
            link: function (scope, el, attrs) {
                scope.$watch(attrs.ngModel, function () {
                    var select = el[0].children[1];
                    //when value changes, update the selectBox text)
                    if (angular.isElement(el[0].firstChild) && angular.isDefined(select.options[select.selectedIndex]) && select.selectedIndex > 0) {
                        el[0].firstChild.innerText = select.options[select.selectedIndex].outerText;
                    }
                });
            }
        };
    });
angular.module('ng-form-ui').
    /**
     * <slide-toggle ng-model="[expression]"></slide-toggle>
     * Required attribute: ng-model="[expression]"
     * Optional attribute: onlabel="xxxx" (defaults to "On")
     * Optional attribute: offlabel="xxxx" (defaults to "Off")
     */
    directive('slideToggle', ['$timeout', function ($timeout) {
        return {
            replace: true,
            restrict: 'E',
            scope: false,
            require: '^ngModel',
            template: function (el, attrs) {
                attrs = angular.extend({
                    onlabel: "On",
                    offlabel: "Off"
                }, attrs);

                var html =
                    '<div class="ngSlideToggle"' + ((angular.isDefined(attrs.class)) ? ' class="'+attrs.class+'"' : '') + '>'+
                        '<input type="checkbox" ng-model="' + attrs.ngModel + '"' + ((angular.isDefined(attrs.id)) ? ' id="'+attrs.id+'"' : '') + '' + ((angular.isDefined(attrs.name)) ? ' name="'+attrs.name+'"' : '') + '/>' +
                        '<div class="stSlide">'+
                            '<span class="stOn">' + attrs.onlabel + '</span>'+
                            '<span class="stHandle">| | |</span>'+
                            '<span class="stOff">' + attrs.offlabel + '</span>'+
                        '</div>'+
                    '</div>';
                return html;
            },
            link: function (scope, el, attrs, ctrl) {
                var
                    container = el[0],
                    slide,
                    onLabel,
                    handle,
                    offLabel,
                    labelWidth, //the width of both labels
                    on = function () {
                        el.removeClass('off').addClass('on');
                        slide.style.marginLeft = "0px";
                    },
                    off = function () {
                        el.removeClass('on').addClass('off');
                        slide.style.marginLeft = "-" + (labelWidth + 1) + "px";
                    };

                //toggle the value when clicked
                el.bind('click', function () {
                    scope.$apply(function () {
                        ctrl.$setViewValue(!ctrl.$viewValue);
                    });
                });

                //use timeout trick to be sure code isn't executed till dom is ready
                $timeout(function() {
                    slide = container.childNodes[1];
                    onLabel = slide.childNodes[0];
                    handle = slide.childNodes[1];
                    offLabel = slide.childNodes[2];

                    //get the X padding of an element so we set the width correctly
                    var getXPadding = function (label) {
                        var computedStyle = window.getComputedStyle(label),
                            left = parseInt(computedStyle.paddingLeft.replace('px', ''), 10),
                            right = parseInt(computedStyle.paddingRight.replace('px', ''), 10);
                        return left + right;
                    };

                    //update the width of the shorter label so both labels are the same
                    if (onLabel.clientWidth > offLabel.clientWidth) {
                        labelWidth = onLabel.clientWidth;
                        offLabel.style.width = (labelWidth - getXPadding(onLabel)) + 'px';
                    } else if (offLabel.clientWidth > onLabel.clientWidth) {
                        labelWidth = offLabel.clientWidth;
                        onLabel.style.width = (labelWidth - getXPadding(offLabel)) + 'px';
                    }

                    //adjust main container to be wide enough for the handle and 1 label
                    container.style.width = (handle.clientWidth + onLabel.clientWidth + 3) + 'px';

                    //be sure the slide is wider than the container
                    slide.style.width = (onLabel.clientWidth + handle.clientWidth + offLabel.clientWidth + 4) + 'px';

                    //set initial value - disable transitions initially so there's no animation
                    var transitionCache = window.getComputedStyle(slide).transition;
                    slide.style.transition = '';
                    if (ctrl.$viewValue) {
                        on();
                    } else {
                        off();
                    }
                    container.style.opacity = 1;
                    slide.style.transition = transitionCache;

                    //change button when value changes
                    scope.$watch(attrs.ngModel, function (newValue) {
                        if (newValue) {
                            on();
                        } else {
                            off();
                        }
                    });
                }, 0);
            }
        };
    }]);