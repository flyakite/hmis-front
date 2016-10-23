'use strict';
angular.module('intake.controllers', [])

//Dashboard
.controller('DashboardController', 
  function($scope, $state, $timeout, DataStore) {
    // $scope.clients = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    $scope.typeAhead = function(event) {
      // console.log($scope.name);
      if(event.keyCode == 13){
        $scope.checkClientName();
        return
      };
      
      DataStore.all('api/customers/search', {name:$scope.name})
        .then(function(clients) {
          console.log(clients);
          $scope.clients = [];
          for(var i=clients.length;i--;){
            $scope.clients.push(clients[i].name);
          }
          $timeout(function() {
            $scope.$apply();
          });
        });

    };

    $scope.checkClientName = function() {
      DataStore.all('api/customers/search', {name:$scope.name})
      .then(function(clients) {
        console.log('clients result', clients);
        if(clients && clients.length == 1){
          $state.go('profile', {_id:clients[0]._id});
        }
        // else{
        //   $state.go('checkclientnotregistered', {name:$scope.name});
        // }
      });
      return false;
    };

    $scope.addNewClient = function() {
      $state.go('newclient');
      return false;
    };


    //material design fix
    // $('.dropdown-button').dropdown('');
    $timeout(function() {
      componentHandler.upgradeDom();
    });

  })

//Profile
.controller('ProfileController',
  function($scope, $state, DataStore, $timeout) {
    
    $scope.client = {
      name: '',
    };

    DataStore.get('api/customers', $state.params._id)
    .then(function(client) {
      $scope.client = client;
    });
    $scope.checkinCount = 26;
    $scope.checkinSignTop = 12;
    $scope.checkIn = function() {
      $scope.checkinCount++;
      $scope.checkedin = true;
      $scope.checkinSignTop = 10;
    };

    var showSparkline = function() {
      // create an SVG element inside the #graph div that fills 100% of the div
      var graph = d3.select("#graph").append("svg:svg").attr("width", "100%").attr("height", "100%");

      // create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
      var data = [9, 9, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 9, 9, 1, 9, 9, 9, 9, 9, 9, 1, 9, 9, 9];

      // X scale will fit values from 0-10 within pixels 0-100
      var x = d3.scale.linear().domain([0, 10]).range([0, 50]);
      // Y scale will fit values from 0-10 within pixels 0-100
      var y = d3.scale.linear().domain([0, 10]).range([0, 30]);

      // create a line object that represents the SVN line we're creating
      var line = d3.svg.line()
        // assign the X function to plot our line as we wish
        .x(function(d,i) { 
          // verbose logging to show what's actually being done
          // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
          // return the X coordinate where we want to plot this datapoint
          return x(i); 
        })
        .y(function(d) { 
          // verbose logging to show what's actually being done
          // console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
          // return the Y coordinate where we want to plot this datapoint
          return y(d); 
        })
  
      // display the line by appending an svg:path element with the data line we created above
      graph.append("svg:path").attr("d", line(data));
    };
    showSparkline();

    var callD3Calendar = function() {
      var width = 260,
          height = 136,
          cellSize = 17; // cell size

      var percent = d3.format(".1%"),
          format = d3.time.format("%Y-%m-%d");

      var color = d3.scale.quantize()
          .domain([-.05, .05])
          .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

      var svg = d3.select("#calendar").selectAll("svg")
          .data(d3.range(2014, 2015))
        .enter().append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("class", "RdYlGn")
        .append("g")
          .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

      svg.append("text")
          .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
          .style("text-anchor", "middle")
          .text(function(d) { return d; });

      var rect = svg.selectAll(".day")
          .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
          .attr("class", "day")
          .attr("width", cellSize)
          .attr("height", cellSize)
          .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
          .attr("y", function(d) { return d.getDay() * cellSize; })
          .datum(format);

      rect.append("title")
          .text(function(d) { return d; });

      svg.selectAll(".month")
          .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
          .attr("class", "month")
          .attr("d", monthPath);

      d3.csv("dji.csv", function(csv) {
        console.log(csv);
        // console.dir(error);
        // if (error) throw error;

        var data = d3.nest()
          .key(function(d) { return d.Date; })
          .rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
          .map(csv);

        rect.filter(function(d) { return d in data; })
            .attr("class", function(d) { return "day " + color(data[d]); })
          .select("title")
            .text(function(d) { return d + ": " + percent(data[d]); });
      });

      function monthPath(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
            d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
            + "H" + w0 * cellSize + "V" + 7 * cellSize
            + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
            + "H" + (w1 + 1) * cellSize + "V" + 0
            + "H" + (w0 + 1) * cellSize + "Z";
      }
    };

    $timeout(function() {
      callD3Calendar();
      componentHandler.upgradeDom();
    });
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
      .then(function(client) {
        console.log('result', client);
        $state.go('profile', {_id:client._id});
      })
    };
  })