angular.module('ng-form-ui').
    directive('focusMe', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element) {
                $timeout(function () {
                    element[0].focus();
                });
            }
        }
    }]);