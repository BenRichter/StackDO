angular.module('controllers', []).controller('TodoCtrl', function ($scope, $timeout, $ionicModal, Categories, $ionicSideMenuDelegate) {
    "use strict";

    /**
     * Initialize
     */
    /* Minimal date for date and time picker */

    $scope.currentDate = new Date();
    $scope.today = $scope.currentDate.toISOString().split('T')[0];

    // clear fields
    $scope.resetToDefault = function () {
        $scope.task = {
            title: "",
            prio: 2,
            duration: null,
            dueDate: null,
            dueTime: null
        };
    };
    $scope.resetToDefault();

    /** Categories **/
    // Open Sidebar
    $scope.toggleCategories = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    // Load or initialize categories
    $scope.categories = Categories.all();

    // Grab the last active, or the first category
    $scope.activeCategories = $scope.categories[Categories.getLastActiveIndex()];

    // A utility function for creating a new category
    // with the given categoryTitle
    var createCategory = function (categoryTitle) {
        var newCategory = Categories.newCategory(categoryTitle);
        $scope.categories.push(newCategory);
        Categories.save($scope.categories);
        $scope.selectCategory(newCategory, $scope.categories.length - 1);
    };

    // First category on init, make sure to defer this by $timeout
    // so everything is initialized properly
    // TODO: pre-populating here
    $timeout(function () {
        if ($scope.categories.length === 0) {
            while (true) {

                var categoryTitle = prompt('Your first category title:');
                if (categoryTitle) {
                    createCategory(categoryTitle);
                    break;
                }
            }
        }
    }, 1000);

    // Called to create a new category
    $scope.newCategory = function () {
        // TODO: better Popup input  http://ionicframework.com/docs/api/service/$ionicPopup/
        var categoryTitle = prompt('Category name');
        if (categoryTitle) {
            createCategory(categoryTitle);
        }
    };

    // Called to select the given category
    $scope.selectCategory = function (category, index) {
        $scope.activeCategories = category;
        Categories.setLastActiveIndex(index);
        $ionicSideMenuDelegate.toggleLeft(false);
    };

    $scope.deleteCategory = function (category, index) {
        console.log("TODO: deleteCategory");
        // todo: Popup confirmation: all tasks in category will be deleted
    };

    /** Tasks **/
    /* return array to ng-repeat */
    $scope.getPrio = function (n) {
        if (n === undefined) {
            n = 2;
        } else {
            n = parseInt(n);
        }

        return new Array(n);
    };

    /* return card height by given duration time  */
    $scope.getCardHeight = function (duration) {
        var height = Math.round(duration);
        if (height > 6) {
            height = 7;
        }

        return height;
    };

    /* Todo: Task order --> add importance points  ....  */

    // calc remaining time
    $scope.remainingTime = function (task) {
        // todo: update Task points by time passing!

        if (task.dueDate === null || task.dueDate === undefined) {
            return 2592000000; // 30 days
        }

        // todo: var currentDate = new Date();
        //return task.dueDate.getTime() - currentDate.getTime();
        return 0;
    };

    // Test for integer and null
    $scope.isNumber = function (obj) {
        return !isNaN(obj - 0) && obj !== null;
    };

    /**
     * Calculate Stack Points
     *
     * @param task {object}
     * @returns points {number}
     */
    $scope.calculatePoints = function (task) {
        console.log("calculate points");

        if (task.done === true) {
            return 0;
        }

        // + remaining time till 'due date' * duration (work needed)      = (30 - remain)^2
        var remainingDays = $scope.remainingTime(task) / (1000 * 60 * 60 * 24); // default 30
        var dueDate = Math.pow(Number(30) - remainingDays, 2);
        console.log(" diffDate  " + remainingDays);

        // duration * 20
        var duration = $scope.isNumber(task.duration) ? task.duration * 20 : 0;
        console.log(" duration  " + duration);

        // prio * 500
        var priority = $scope.isNumber(task.prio) ? task.prio * 500 : 0;
        console.log(" priority  " + priority);

        //  (hardess) --> early morning? or second after quick task to get startet

        return dueDate + duration + priority;
    };

    /** Reorder List of tasks
     *  triggered by: saveTask(), editTask(), doneTask()
     *
     **/
    $scope.reorderTaskList = tasks => {
        let sortObj = require('sort-object');

        sortObj(tasks, { keys: ['a', 'b'] });

        //if($scope.pointsChanged === true){
        console.log("reorder tasks");

        //
        //    this.pointsChanged = false;
        //}

        //return;
    };

    // Create Task Modal
    $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
        $scope.taskModal = modal;
    }, {
        scope: $scope
    });

    $scope.newTask = function () {
        $scope.taskModal.show();
    };

    $scope.closeNewTask = function () {
        $scope.taskModal.hide();
    };

    // Saves task
    $scope.saveTask = function (task) {
        if (!$scope.activeCategories || !task) {
            return;
        }

        task.points = $scope.calculatePoints(task);

        $scope.activeCategories.tasks.push({
            title: task.title,
            prio: task.prio,
            duration: task.duration,
            dueDate: task.dueDate,
            dueTime: task.dueTime,
            points: task.points
        });
        $scope.taskModal.hide();
        $scope.reorderTaskList();

        // Inefficient, but save all the categories
        Categories.save($scope.categories);
        $scope.resetToDefault();
    };

    $scope.editTask = function (task) {
        console.log("TODO: editTask");

        task.points = $scope.calculatePoints(task);
        $scope.reorderTaskList();
    };

    $scope.doneTask = function (task) {
        task.points = $scope.calculatePoints(task);
        $scope.reorderTaskList();
        Categories.save($scope.categories);
    };
});