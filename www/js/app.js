// unused example base
angular.module('todo', ['ionic']).factory('Projects', function () {
    "use strict";

    return {
        all: function () {
            var projectString = window.localStorage.projects;
            if (projectString) {
                return angular.fromJson(projectString);
            }
            return [];
        },
        save: function (projects) {
            window.localStorage.projects = angular.toJson(projects);
        },
        newProject: function (projectTitle) {
            // Add a new project
            return {
                title: projectTitle,
                tasks: []
            };
        },
        getLastActiveIndex: function () {
            return parseInt(window.localStorage - lastActiveProject) || 0;
        },
        setLastActiveIndex: function (index) {
            window.localStorage.lastActiveProject = index;
        }
    };
}).controller('TodoCtrl', function ($scope, $timeout, $ionicModal, $ionicSideMenuDelegate, Projects) {
    "use strict";

    // A utility function for creating a new project
    // with the given projectTitle

    var createProject = function (projectTitle) {
        var newProject = Projects.newProject(projectTitle);
        $scope.projects.push(newProject);
        Projects.save($scope.projects);
        $scope.selectProject(newProject, $scope.projects.length - 1);
        $scope.projectModal.hide();
    };

    // Load or initialize projects
    $scope.projects = Projects.all();

    // Grab the last active, or the first project
    $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

    $scope.showProjectModal = function () {
        $scope.projectModal.show();
    };

    // Called to create a new project
    $scope.newProject = function (project) {
        //var projectTitle = prompt('Project name');
        var projectTitle = project.title;
        if (projectTitle) {
            createProject(projectTitle);
        }
    };

    // Called to select the given project
    $scope.selectProject = function (project, index) {
        $scope.activeProject = project;
        Projects.setLastActiveIndex(index);
        // $scope.sideMenuController.close();
        $ionicSideMenuDelegate.toggleRight();
    };

    // Create our modal
    $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
        $scope.taskModal = modal;
    }, {
        scope: $scope
    });
    $ionicModal.fromTemplateUrl('new-project.html', function (modal) {
        $scope.projectModal = modal;
    }, {
        scope: $scope
    });

    $scope.createTask = function (task) {
        if (!$scope.activeProject || !task) {
            return;
        }
        $scope.activeProject.tasks.push({
            title: task.title
        });
        $scope.taskModal.hide();

        // Inefficient, but save all the projects
        Projects.save($scope.projects);

        task.title = "";
    };

    $scope.newTask = function () {
        $scope.taskModal.show();
    };

    $scope.closeNewTask = function () {
        $scope.taskModal.hide();
    };

    $scope.closeNewProject = function () {
        $scope.projectModal.hide();
    };

    $scope.toggleProjects = function () {
        //console.log("---------------------------");
        //console.log($scope);
        //$scope.sideMenuController.toggleLeft();
        $ionicSideMenuDelegate.toggleLeft();
    };

    // Try to create the first project, make sure to defer
    // this by using $timeout so everything is initialized
    // properly
    $timeout(function () {
        if ($scope.projects.length === 0) {
            //while(true) {
            $scope.projectModal.show();
            //var projectTitle = prompt('Your first project title:');
            //if(projectTitle) {
            //createProject(projectTitle);
            //break;
            //}
            //}
        }
    });
});
/**
 * Angular base module
 *
 * app - application name in <body>
 * array - required modules
 */
angular.module('app', ['ionic', 'LocalStorageModule', 'controllers', 'services-factory', 'directives']).run(function ($ionicPlatform) {
    "use strict";

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
    "use strict";

    localStorageServiceProvider.setPrefix('stackDO');
}).config(function ($stateProvider, $urlRouterProvider) {
    "use strict";

    // AngularUI Router with states
    // https://github.com/angular-ui/ui-router
    // Each state's controller can be found in controllers.js

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    }).state('app.search', {
        url: '/search',
        views: {
            'menuContent': {
                templateUrl: 'templates/search.html',
                controller: 'SearchCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/');
});
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
        if ($scope.categories.length == 0) {
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
        return !isNaN(obj - 0) && obj != null;
    };

    /** Calculate Stack Points */
    $scope.calculatePoints = function (task) {
        console.log("calculate points");

        if (task.done == true) {
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
     *  triggered by: saveTask(), doneTask() */
    $scope.reorderTaskList = function () {

        //if($scope.pointsChanged === true){
        console.log("reorder tasks");

        //
        //    this.pointsChanged = false;
        //}
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
angular.module('directives', [])

/* add striped-time for normal time format */
.directive('stripedTime', function () {

    return {
        require: '?ngModel',
        link: function (scope, elem, attr, ngModel) {
            if (!ngModel) return;
            if (attr.type !== 'time') return;

            ngModel.$formatters.unshift(function (value) {
                return value.replace(/:[0-9]+.[0-9]+$/, '');
            });
        }
    };
});
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