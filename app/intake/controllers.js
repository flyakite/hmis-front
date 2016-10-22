'use strict';
angular.module('intake.controllers', [])

.controller('CheckClientController', 
  function($scope, $state, DataStore) {
    $scope.checkClientName = function() {
      console.log($scope.first_name, $scope.last_name);
      var client = {
        first_name: $scope.first_name,
        last_name: $scope.last_name
      };
      DataStore.all('client', client)
      .then(function(clients) {
        console.log(clients);
        if(clients && clients.length == 1){
          $state.go('clientprofile', {first_name:client.first_name, last_name:client.last_name});
        }else if(clients){
          $state.go('checkclientlist', {first_name:client.first_name, last_name:client.last_name});
        }else{
          $state.go('checkclientnotregistered', {first_name:client.first_name, last_name:client.last_name});
        }
      })
    };
  })
.controller('ClientProfileController',
  function($scope, $state, DataStore) {
    $scope.client = {
      first_name: $state.params.first_name,
      last_name: $state.params.last_name
    };

  })
.controller('CheckClientListController',
  function($scope, $state, DataStore) {
    $scope.client = {
      first_name: $state.params.first_name,
      last_name: $state.params.last_name
    };
  })
.controller('CheckClientNotRegisteredController',
  function($scope, $state, DataStore) {
    $scope.client = {
      first_name: $state.params.first_name,
      last_name: $state.params.last_name
    };
  })
// .controller('CheckClientNotRegisteredController',
//   function($scope, $state, DataStore) {
    
//   })