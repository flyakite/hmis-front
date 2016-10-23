angular.module('app.services', [])
.factory('DataStore', function($q, $http) {

  var API_URL = 'https://d57a8a22.ngrok.io/';


  function parseParams (params) {
    //use angular.merge when available
    var headers = {
      'Content-Type':'application/json'
    };
    params = params || {};
    params.headers = params.headers || {};
    params.headers = angular.extend(headers, params.headers);
    return params;
  }

  var service = {
    all: function(classname, params) {
      var d = $q.defer();
      $http.get(API_URL + classname, parseParams({params:params})).then(function(result) {
        // console.dir(result.data.results);
        d.resolve(result.data);
      },function(err) {
        d.reject(err);
      });
      return d.promise;
    },
    first: function(classname, params) {
      params = params || {};
      params.limit = 1;
      var d = $q.defer();
      service.all(classname, params).then(function(results) {
        d.resolve(results[0]);
      },function(err) {
        d.reject(err);
      });
      return d.promise;
    },
    get: function(classname, id, params) {
      var d = $q.defer();
      $http.get(API_URL + classname + '/' + id, parseParams({params:params}))
      .then(function(result) {
        d.resolve(result.data);
      }, function(err) {
        d.reject(err);
      });
      return d.promise;
    },
    create: function(classname, data) {
      var d = $q.defer();
      // use copy to prevent callback update the data
      var dataCopied = angular.copy(data);
      console.log(dataCopied);
      $http.post(API_URL + classname, dataCopied, parseParams())
      .then(function(result) {
        d.resolve(result.data);
      }, function(err) {
        d.reject(err);
      });
      return d.promise;
    },
    update: function(classname, id, data) {
      var dataCopied = angular.copy(data);
      dataCopied = useParseDate(dataCopied);
      var d = $q.defer();
      $http.put(API_URL + classname + '/' + id, dataCopied, parseParams())
      .then(function(result) {
        d.resolve(toJSDate(result.data));
      }, function(err) {
        d.reject(err);
      });
      return d.promise;
    }
  };
  // var service = {
  //   all: function(classname, params) {
  //     var d = $q.defer();
  //     if(classname == 'client'){
  //       d.resolve([
  //         {
  //           'first_name': 'John',
  //           'last_name': 'Wayne',
  //         }
  //       ]);
  //     }
  //     return d.promise;
  //   },
  //   first: function(classname, params) {
  //     var d = $q.defer();
  //     d.resolve();
  //     return d.promise;
  //   },
  //   get: function(classname, id, params) {
  //     var d = $q.defer();
  //     d.resolve();
  //     return d.promise;
  //   },
  //   create: function(classname, data) {
  //     var d = $q.defer();
  //     d.resolve();
  //     return d.promise;
  //   },
  //   update: function(classname, id, data) {
  //     var d = $q.defer();
  //     d.resolve();
  //     return d.promise;
  //   }
  // }
  return service;

})