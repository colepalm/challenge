'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    });

  }).
  controller('MyCtrl1', function ($scope, $http) {

    function init() {
        var feeData, orderData;

        $http.get('js/fees.json').success(function (data) {
            feeData = data;
        });

        $http.get('js/orders.json').success(function (data) {
            orderData = data;
            feesChallenge(feeData, orderData);
        });
    }
    init();

    function feesChallenge(feeData, orderData) {
        console.log('Part 1: Fees \n\n');

        var totalArray = [];

        orderData.forEach(function(order) {

            var total = 0;
            console.log('Order ID: ' + order.order_number);

            order.order_items.forEach(function(orderItem) {

                feeData.forEach(function(feeData) {

                    if (feeData.order_item_type === orderItem.type) {
                        var partial = processPayment(feeData.fees, orderItem);
                        total += partial;
                        totalArray.push({
                            type: orderItem.type,
                            amount: partial,
                            id: order.order_number,
                            distributions: feeData.distributions
                        });
                    }
                })
            });

            console.log('\tOrder total: $' + total + '\n\n\n');
        });

        distributionChallenge(totalArray);
    }

    function distributionChallenge(totalArray) {
        console.log('Part 2: Distributions\n\n');
        for (var i=0; i<totalArray.length; i++) {
            console.log('Order ID: '+ totalArray[i].id);

            $scope.compare = 0;
            var subTotal = 0;

            var cont = true;
            var distNums = [];
            var distributions = totalArray[i].distributions;

            while(cont) {
                distNums = addDistributions(distNums, distributions);

                subTotal += parseFloat(totalArray[i].amount);

                if (totalArray[i+1] && totalArray[i].id === totalArray[i+1].id) {
                    i += 1;
                }
                else {
                    cont = false;
                }
            }

            distNums.forEach(function(toConsole, index) {
                console.log('\tFund - ' + distributions[index].name + ': $' + toConsole);
            });

            if ($scope.compare !== subTotal) {
                var otherFund = subTotal - $scope.compare;
                console.log('\tFund - Other: $' + otherFund);
            }

            console.log('\n\n');
        }
    }

    function addDistributions(distNums, distributions) {
        distributions.forEach(function(distribution, index) {
            if (distNums[index] === undefined)
                distNums[index] = 0;
            distNums[index] += parseFloat(distribution.amount);
            $scope.compare += parseFloat(distribution.amount)

        });
        return distNums;
    }

    function processPayment(feeData, orderItem) {
        var per, total = 0;
        var pages = orderItem.pages - 1;

        feeData.forEach(function(fee) {
            fee.type === 'flat' ? total += parseFloat(fee.amount) : per = parseFloat(fee.amount);
        });

        if (pages > 0) {
            total += pages * per;
        }

        console.log('\tOrder item ' + orderItem.type + ': $' + total);
        return total;
    }

  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here

  });
