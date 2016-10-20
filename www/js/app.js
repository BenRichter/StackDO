// 'app' is the name of this angular module set in a <body> attribute in index.html
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('app', ['ionic', 'LocalStorageModule']) // , 'app.controllers', 'app.routes', 'app.services', 'app.directives'

    //.run(function ($ionicPlatform) {
    //    $ionicPlatform.ready(function () {
    //        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    //        // for form inputs)
    //        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
    //            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    //            cordova.plugins.Keyboard.disableScroll(true);
    //        }
    //        if (window.StatusBar) {
    //            // org.apache.cordova.statusbar required
    //            StatusBar.styleDefault();
    //        }
    //    });
    //})

    /**
     *  Configuration set namespace for local storage
     *  Todo: use storage: https://scotch.io/tutorials/create-your-first-mobile-app-with-angularjs-and-ionic#building-out-the-real-stuff
     */
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('stackDO');
    })

    /**
     * The Categories factory handles saving and loading categories
     * from local storage, and also lets us save and load the
     * last active category index.
     */
    .factory('Categories', function() {
        return {
            all: function() {
                var categoryString = window.localStorage['categories'];
                if(categoryString) {
                    return angular.fromJson(categoryString);
                }
                return [];
            },
            save: function(categories) {
                window.localStorage['categories'] = angular.toJson(categories);
            },
            newCategory: function(categoryTitle) {
                // Add a new category
                return {
                    title: categoryTitle,
                    tasks: []
                };
            },
            getLastActiveIndex: function() {
                return parseInt(window.localStorage['lastActiveCategory']) || 0;
            },
            setLastActiveIndex: function(index) {
                window.localStorage['lastActiveCategory'] = index;
            }
        }
    })

    /**
     * The controller
     */
    .controller('TodoCtrl', function($scope, $timeout, $ionicModal, Categories, $ionicSideMenuDelegate) {

        /**
         * Initialize
         */
        /* Minimal date for date and time picker */
        $scope.currentDate = new Date();
        $scope.today =  $scope.currentDate.toISOString().split('T')[0];

        // clear fields
        $scope.resetToDefault = function() {
            $scope.task = {
                title : "",
                prio : 2,
                duration : null,
                dueDate : null,
                dueTime : null
            };
        };
        $scope.resetToDefault();


        /** Categories **/
        // Open Sidebar
        $scope.toggleCategories = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        // Load or initialize categories
        $scope.categories = Categories.all();

        // Grab the last active, or the first category
        $scope.activeCategories = $scope.categories[Categories.getLastActiveIndex()];

        // A utility function for creating a new category
        // with the given categoryTitle
        var createCategory = function(categoryTitle) {
            var newCategory = Categories.newCategory(categoryTitle);
            $scope.categories.push(newCategory);
            Categories.save($scope.categories);
            $scope.selectCategory(newCategory, $scope.categories.length-1);
        };

        // First category on init, make sure to defer this by $timeout
        // so everything is initialized properly
        // TODO: pre-populating here
        $timeout(function() {
            if($scope.categories.length == 0) {
                while(true) {

                    var categoryTitle = prompt('Your first category title:');
                    if(categoryTitle) {
                        createCategory(categoryTitle);
                        break;
                    }
                }
            }
        }, 1000);

        // Called to create a new category
        $scope.newCategory = function() {
            // TODO: better Popup input  http://ionicframework.com/docs/api/service/$ionicPopup/
            var categoryTitle = prompt('Category name');
            if(categoryTitle) {
                createCategory(categoryTitle);
            }
        };

        // Called to select the given category
        $scope.selectCategory = function(category, index) {
            $scope.activeCategories = category;
            Categories.setLastActiveIndex(index);
            $ionicSideMenuDelegate.toggleLeft(false);
        };

        $scope.deleteCategory = function(category, index) {
            console.log("TODO: deleteCategory");
            // todo: Popup confirmation: all tasks in category will be deleted
        };

        /** Tasks **/
        /* return array to ng-repeat */
        $scope.getPrio = function(n){
            if(n === undefined){
                n = 2;
            }else {
                n = parseInt(n);
            }

            return new Array(n);
        };

        /* return card height by given duration time  */
        $scope.getCardHeight = function(duration){
            var height = Math.round(duration);
            if(height > 6){ height = 7; }

            return height;
        };





        /* Todo: Task order --> add importance points  ....  */

        // calc remaining time
        $scope.remainingTime = function (task){
            // todo: update Task points by time passing!

            if (task.dueDate === undefined){
                return 2592000000; // 30 days
            }

            //var currentDate = new Date();
            //return task.dueDate.getTime() - currentDate.getTime();
            return 0;
        };


        // prio * 100


        // + remaining time till 'due date' * duration (work needed)      = (30 - remain)^2
        // duration * 10

        //  (hardness) --> early morning? or second after quick task to get startet


        // func: order by points

        // on done: seperate array, no reorder

        /** Calculate Stack Points */
        $scope.calculatePoints = function(task) {
            console.log("calculate points");

            console.log("DiffDate " + $scope.remainingTime(task));

            // Todo: task.points = ...;
            task.points = (task.prio * 1000);

            if(task.done == true){
                task.points = 0;
            }
        };

        /** Reorder List of tasks
         *  triggered by: saveTask(), doneTask() */
        $scope.reorderTaskList = function() {

            //if($scope.pointsChanged === true){
                console.log("reorder tasks");

            //
            //    this.pointsChanged = false;
            //}
        };



        // Create Task Modal
        $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope
        });

        $scope.newTask = function() {
            $scope.taskModal.show();
        };

        $scope.closeNewTask = function() {
            $scope.taskModal.hide();
        };


        // Saves task
        $scope.saveTask = function(task) {
            if(!$scope.activeCategories || !task) {
                return;
            }

            $scope.calculatePoints(task);

            $scope.activeCategories.tasks.push({
                title:      task.title,
                prio:       task.prio,
                duration:   task.duration,
                dueDate:    task.dueDate,
                dueTime:    task.dueTime,
                points:     task.points
            });
            $scope.taskModal.hide();
            $scope.reorderTaskList();
            

            // Inefficient, but save all the categories
            Categories.save($scope.categories);
            $scope.resetToDefault();
        };
        
        $scope.editTask = function (task){
            console.log("TODO: editTask");

            $scope.calculatePoints(task);
            $scope.reorderTaskList();

        };

        $scope.doneTask = function (task){
            $scope.calculatePoints(task);
            $scope.reorderTaskList();
            Categories.save($scope.categories);
        };

    })

    /* add striped-time for normal time format */
    .directive('stripedTime', function () {

        return {
            require: '?ngModel',
            link: function(scope, elem, attr, ngModel) {
                if( !ngModel )
                    return;
                if( attr.type !== 'time' )
                    return;

                ngModel.$formatters.unshift(function(value) {
                    return value.replace(/:[0-9]+.[0-9]+$/, '');
                });
            }
        };

    });
