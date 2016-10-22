'use strict';
angular.module('intake.controllers', [])

//Dashboard
.controller('DashboardController', 
  function($scope, $state, DataStore) {
    $scope.checkClientName = function() {

      DataStore.all('api/customers/search', {name:$scope.name})
      .then(function(clients) {
        console.log('clients result', clients);
        if(clients && clients._id){
          $state.go('profile', {_id:clients._id});
        }else{
          $state.go('checkclientnotregistered', {name:$scope.name});
        }
      })
    };
  })

//Profile
.controller('ProfileController',
  function($scope, $state, DataStore, $timeout) {
    
    //dirty default value, just in case the id is wrong
    $scope.client = {
      name: 'John Wayne',
    };

    DataStore.get('api/customers', $state.params._id)
    .then(function(client) {
      $scope.client = client;
    })
  })
//Client List Deprecated
// .controller('CheckClientListController',
//   function($scope, $state, DataStore) {
//     $scope.client = {
//       name: $state.params.name,
//     };
//   })
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
      console.log($scope.client);
      DataStore.create('api/customers', $scope.client)
      .then(function(result) {
        console.log('result', result);
      })
    };
  })