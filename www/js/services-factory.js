/**
 * The Categories factory handles saving and loading categories
 * from local storage, and also lets us save and load the
 * last active category index.
 */
angular.module('services-factory', []).factory('Categories', function () {
    "use strict";

    return {
        all: function () {
            var categoryString = window.localStorage.categories;
            if (categoryString) {
                return angular.fromJson(categoryString);
            }
            return [];
        },
        save: function (categories) {
            window.localStorage.categories = angular.toJson(categories);
        },
        newCategory: function (categoryTitle) {
            // Add a new category
            return {
                title: categoryTitle,
                tasks: []
            };
        },
        getLastActiveIndex: function () {
            return parseInt(window.localStorage.lastActiveCategory) || 0;
        },
        setLastActiveIndex: function (index) {
            window.localStorage.lastActiveCategory = index;
        }
    };
});

//.service('BlankService', [function () {
//
//}]);