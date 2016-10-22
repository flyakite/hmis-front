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
  .state('checkclient', {
    url: '/checkclient',
    templateUrl: 'intake/checkclient.html',
    controller: 'CheckClientController',
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
  $urlRouterProvider.otherwise('/checkclient');
});
