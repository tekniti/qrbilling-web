'use strict';

var passport = require('passport');
var User = require('../user/user.model');
var config = require('../../config/environment');
var stripe = require('stripe')('sk_test_W99pMeoNDyLgSxGXDwUfQPIg');
var _ = require('lodash');

var handleError = function(res, err) {
  console.log(err);
  return res.status(400).json(err);
};

var addCard = function (res, stripeCustomerId, cardToken) {

  // Add new card to the customer
  stripe.customers.createSource(
    stripeCustomerId,
    {source: cardToken},
    function(err, card) {
      if (err) {
        return handleError(res, err);
      } else {
        return res.status(200).json({result: true, card: _.pick(card, ['id', 'last4', 'brand'])});
      }
    }
  );

};

/**
 *
 */
exports.destroy = function (req, res) {
  var stripeCustomerId = req.user.stripeCustomerId;
  var cardId = req.params.cardId;

  // More info: https://stripe.com/docs/api#delete_card
  stripe.customers.deleteCard(
    stripeCustomerId,
    cardId,
    function(err, confirmation) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json({result: true});
    }
  );
};

/**
 *
 */
exports.index = function (req, res) {
  var stripeCustomerId = req.user.stripeCustomerId;

  // More info: https://stripe.com/docs/api#retrieve_customer
  stripe.customers.retrieve(
    stripeCustomerId,
    function(err, customer) {
      if (err) {
        return handleError(res, err);
      }

      var retval = [];
      customer.sources.data.forEach(function (el) {
        retval.push(_.pick(el, ['id', 'last4', 'brand']));
      });

      return res.status(200).json({result: true, cardList: retval});
    }
  );
};

/**
 * Add card to Stripe Customer (creates Stripe Customer if needed)
 */
exports.create = function(req, res) {
  var cardToken = req.params.cardToken;
  var stripeCustomerId = req.user.stripeCustomerId;

  // We have to create / update a stripe customer and save the user's stripeCustomerId
  if (!stripeCustomerId) {

    // Create customer in Stripe
    stripe.customers.create({
      description: 'Customer for ' + req.user.email,
      email: req.user.email
    }, function(err, customer) {
      if (err) {
        return handleError(res, err);
      }
      stripeCustomerId = customer.id;

      // Save user's customerId
      User.findById(req.user._id, function (err, user) {
        user.stripeCustomerId = stripeCustomerId;
        user.save(function(err) {
          if (err) {
            return handleError(res, err);
          }
          addCard(res, stripeCustomerId, cardToken);
        });
       });
    });

  } else {
    addCard(res, stripeCustomerId, cardToken);
  };

};
