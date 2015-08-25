/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Invoice = require('../api/invoice/invoice.model');
var User = require('../api/user/user.model');

Invoice.find({}).remove(function(){
  Invoice.create({
    invoice_number: 'invoice_number1',
    customer_number: 'customer_number1',
    due_date: '2016-01-01',
    amount: 100
  }, {
    invoice_number: 'invoice_number2',
    customer_number: 'customer_number2',
    due_date: '2016-01-01',
    amount: 100
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});
