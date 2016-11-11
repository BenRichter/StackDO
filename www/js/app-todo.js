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