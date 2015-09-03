'use strict';

var passport = require('passport');
var User = require('../user/user.model');
var config = require('../../config/environment');
var stripe = require('stripe')('sk_test_W99pMeoNDyLgSxGXDwUfQPIg');

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.create = function(req, res) {
  var stripeToken = req.params.stripeToken;
  var stripeCustomerId = req.user.stripeCustomerId;

  // We have to create / update a stripe customer and save the user's stripeCustomerId
  if (!stripeCustomerId) {

    // Create customer in Stripe
    stripe.customers.create({
      description: 'Customer for ' + req.user.email,
      email: req.user.email,
      source: stripeToken // obtained with Stripe.js
    }, function(err, customer) {
      if (err) {
        return res.status(400).json(err);
      }

      // Save user's customerId
      User.findById(req.user._id, function (err, user) {
        user.stripeCustomerId = customer.id;
        user.save(function(err) {
          if (err) {
            return res.status(400).json(err);
          }
          res.status(200).json({result: true});
        });
      });
    });

  } else {

    // Update stripe customer with the new stripeToken
    stripe.customers.update(stripeCustomerId, {
      source: stripeToken
    }, function(err, customer) {
      if (err) {
        return res.status(400).json(err);
      }

      res.status(200).json({result: true});
    });

  }

};
