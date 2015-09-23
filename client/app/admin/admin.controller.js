'use strict';

angular.module('qrBillingWebApp')
  .controller('AdminCtrl', function ($scope, $http, $log, $location) {

    var baseUrl = 'http://' + $location.host() + ':' + $location.port();
    $scope.apiUrl = encodeURI(baseUrl);

    $scope.invoices = [];
    $scope.newInvoice = {};
    $scope.adminModel = {};

    $http.get('/api/invoices').success(function(invoices) {
      $scope.invoices = invoices;
    });

    $scope.addInvoice = function() {
      var promise = $http.post('/api/invoices', $scope.newInvoice);

      promise.then(function(response){
        if (response.status && response.status === 201) {
          $scope.invoices.push(response.data);
        } else {
          $log.info('sorry, something went wrong..');
        }
      });

      $scope.newInvoice = {};
    };

    $scope.deleteInvoice = function(invoice) {
      $http.delete('/api/invoices/' + invoice._id);
      var index = $scope.invoices.indexOf(invoice);
      if (index > -1) {
        $scope.invoices.splice(index, 1);
      }
    };

  });
