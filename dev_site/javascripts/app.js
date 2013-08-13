
 // create a skeleton module to gather all the controllers. 
 // The list indicates all the angularJS modules that need to be loaded before the 'controllers' 
 // module can be initialised. (It's primitive dependency management.)
angular.module('controllers', ['frontpage', 'diagram1']);

var app = angular.module('githubPage', ['controllers']);

app.config(['$routeProvider', function($routeProvider) {
    // Associate URLs with templates and controllers.

    $routeProvider.when('/frontpage', { // each URL has an implicit '#' at the beginning.
        templateUrl: 'partials/frontpage.html',
        controller: 'frontpageController',
    });
    
    $routeProvider.when('/diagram/1', {
        templateUrl: 'partials/diagram/1.html',
        controller: 'diagram1Controller',
    });

    $routeProvider.otherwise({
        templateUrl: 'partials/standard.html',
        controller: 'frontpageController',
    });

}]);

app.run(function($rootScope, $location) {
    // This function is run immediately, so we can use it to initialise stuffs.
});
