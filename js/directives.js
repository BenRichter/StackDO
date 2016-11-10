angular.module('directives', [])

    /* add striped-time for normal time format */
    .directive('stripedTime', function () {

        return {
            require: '?ngModel',
            link: function (scope, elem, attr, ngModel) {
                if (!ngModel)
                    return;
                if (attr.type !== 'time')
                    return;

                ngModel.$formatters.unshift(function (value) {
                    return value.replace(/:[0-9]+.[0-9]+$/, '');
                });
            }
        };

    });
