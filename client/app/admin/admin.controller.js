'use strict';

angular.module('qrBillingWebApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    $scope.invoices = [];
    $scope.newInvoice = {};

    $http.get('/api/invoices').success(function(invoices) {
      $scope.invoices = invoices;
    });

    $scope.addInvoice = function() {
      var promise = $http.post('/api/invoices', $scope.newInvoice);

      promise.then(function(response){
        if (response.status && response.status === 201) {
          $scope.invoices.push(response.data);
        } else {
          alert('sorry, something went wrong..');
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
