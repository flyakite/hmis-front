'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'ngRoute',
  'app.services',
  'intake.controllers'
]).
config(function(
  $stateProvider, $urlRouterProvider) {
  // $locationProvider.hashPrefix('!');

  $stateProvider
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'intake/dashboard.html',
    controller: 'DashboardController',
  })
  .state('clientprofile', {
    url: '/clientprofile?first_name&last_name',
    templateUrl: 'intake/clientprofile.html',
    controller: 'ClientProfileController',
  })
  .state('checkclientlist', {
    url: '/checkclientlist?first_name&last_name',
    templateUrl: 'intake/checkclientlist.html',
    controller: 'CheckClientListController',
  })
  .state('checkclientnotregistered', {
    url: '/checkclientnotregistered?first_name&last_name',
    templateUrl: 'intake/checkclientnotregistered.html',
    controller: 'CheckClientNotRegisteredController',
  })
  .state('newclient', {
    url: '/newclient?first_name&last_name',
    templateUrl: 'intake/newclient.html',
    controller: 'NewClientController',
  })
  $urlRouterProvider.otherwise('/checkclient');
});
