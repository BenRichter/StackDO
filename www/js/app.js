/**
 * Angular base module
 *
 * app - application name in <body>
 * array - required modules
 */
angular.module('app', ['ionic', 'LocalStorageModule', 'controllers', 'services-factory', 'directives'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    /**
     *  Configuration set namespace for local storage
     *  Todo: use storage: https://scotch.io/tutorials/create-your-first-mobile-app-with-angularjs-and-ionic#building-out-the-real-stuff
     */
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('stackDO');
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // AngularUI Router with states
        // https://github.com/angular-ui/ui-router
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html',
                        controller: 'SearchCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('/')

    });

