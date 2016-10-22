'use strict';
angular.module('intake.controllers', [])

//dashboard
.controller('DashboardController', 
  function($scope, $state, DataStore) {
    $scope.checkClientName = function() {
      DataStore.all('api/customers/search', {name:$scope.name})
      .then(function(clients) {
        console.log('clients result', clients);
        if(clients && clients.length == 1){
          $state.go('clientprofile', {name:client.name});
        }else if(clients){
          $state.go('checkclientlist', {name:client.name});
        }else{
          $state.go('checkclientnotregistered', {name:client.name});
        }
      })
    };
  })
//Profile
.controller('ClientProfileController',
  function($scope, $state, DataStore) {
    $scope.client = {
      name: $state.params.name || 'John Wayne',
    };
  })
//Client List
.controller('CheckClientListController',
  function($scope, $state, DataStore) {
    $scope.client = {
      name: $state.params.name,
    };
  })
.controller('CheckClientNotRegisteredController',
  function($scope, $state, DataStore) {
    $scope.client = {
      name: $state.params.name,
    };
  })
.controller('NewClientController',
  function($scope, $state, DataStore) {
    $scope.client = {};
    $scope.client.name = $state.params.name || '';
    $scope.client.gender = 'Male';
    
    $scope.addNewClient = function() {
      $scope.client.name = $scope.client.first_name + ' ' + $scope.client.last_name;
      console.log($scope.client);
      DataStore.create('api/customers', $scope.client)
      .then(function(result) {
        console.log('result', result);
      })
    };
  })