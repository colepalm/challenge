'use strict';

/* Controllers */

function IndexCtrl($scope, $http) {
    function init() {
        $http.get('js/orders.json').success(function (data) {
            //For API Challenge

            //Part 1:
            $http.post('/api/prices', data)
                .success(function(response) {
                    console.log('Part 1 JSON Response:');
                    console.log(response);
                    console.log('\n\n');
                    feesChallenge(response);
                });

            //Part 2:
            $http.post('/api/distributions', data).
            success(function(response) {
                console.log('Part 2 JSON Response:');
                console.log(response);
                console.log('\n\n');
                distributionChallenge(response);
            });
        });
    }
    init();

    function feesChallenge(orderData) {

        console.log('Part 1: Fees \n\n');

        orderData.forEach(function(order) {

            console.log('Order ID: ' + order.id);

            order.orderItems.forEach(function(orderItem) {
                console.log('\tOrder item ' + orderItem.type + ': $' + orderItem.amount);
            });


            console.log('\tOrder total: $' + order.total + '\n\n\n');
        });

    }

    function distributionChallenge(orderData) {

        console.log('Part 2: Distributions\n\n');

        orderData.forEach(function (order) {
            console.log('Order ID: ' + order.orderNumber);

            order.distributions.forEach(function (dist) {
                console.log('\tFund - ' + dist.name + ': $' + dist.amount);
            })
        });
    }
}

function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function () {
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}
