/*global angular */

angular.module('ng-form-ui', []);
angular.module('ng-form-ui').
    directive('slideToggle', ['$timeout', function ($timeout) {
        return {
            replace: true,
            restrict: 'E',
            scope: false,
            template: function (el, attr) {
                var html =
                    '<div class="slideToggle">'+
                        '<input type="checkbox" ng-model="' + attr.ngModel + '"/>' +
                        '<div class="stSlide">'+
                            '<span class="stOn">' + attr.onlabel + '</span>'+
                            '<span class="stHandle">| | |</span>'+
                            '<span class="stOff">' + attr.offlabel + '</span>'+
                        '</div>'+
                    '</div>';
                return html;
            },
            link: function (scope, el, attrs) {
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

                //toggle the state when clicked
                el.bind('click', function () {
                    scope[attrs.ngModel] = !scope[attrs.ngModel];
                    if (el.hasClass('on')) {
                        off();
                    } else {
                        on();
                    }
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
                    if (scope.$eval(attrs.ngModel)) {
                        on();
                    } else {
                        off();
                    }
                    slide.style.transition = transitionCache;

                    //change button when value changes
                    scope.$watch(attrs.ngModel, function (oldValue, newValue) {
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