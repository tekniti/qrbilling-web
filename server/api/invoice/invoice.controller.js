'use strict';

var _ = require('lodash');
var Invoice = require('./invoice.model');
var stripe = require('stripe')('sk_test_W99pMeoNDyLgSxGXDwUfQPIg');

// Get list of invoices
exports.index = function(req, res) {
  Invoice.find(function (err, invoices) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(invoices);
  });
};

// Pay an invoice
exports.pay = function(req, res) {
  var cardId = req.body.cardId;
  var stripeCustomerId = req.user.stripeCustomerId;

  Invoice.findById(req.params.id, function (err, invoice) {
    if(err) {
      return handleError(res, err);
    }
    if(!invoice) {
      return res.status(404).send('Not Found');
    }

    // TODO: check if it's already payed

    stripe.charges.create({
      amount: parseInt(invoice.amount),
      currency: "usd",
      customer: stripeCustomerId,
      source: cardId,
      description: "Charge for " + req.user.email,
      receipt_email: req.user.email
    }, function(err, charge) {
      if (err) {
        return handleError(res, err);
      }

      invoice.paid_date = (new Date()).getTime();
      invoice.save();
      return res.json(invoice);
    });

  });

};

// Get a single invoice
exports.show = function(req, res) {
  // If not authenticated - Redirect to download the app
  if (!req.user) {
    return res.redirect('http://play.google.com');
  }

  Invoice.findById(req.params.id, function (err, invoice) {
    if(err) { return handleError(res, err); }
    if(!invoice) { return res.status(404).send('Not Found'); }
    return res.json(invoice);
  });
};

// Creates a new invoice in the DB.
exports.create = function(req, res) {
  Invoice.create(req.body, function(err, invoice) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(invoice);
  });
};

// Updates an existing invoice in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Invoice.findById(req.params.id, function (err, invoice) {
    if (err) { return handleError(res, err); }
    if(!invoice) { return res.status(404).send('Not Found'); }
    var updated = _.merge(invoice, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(invoice);
    });
  });
};

// Deletes a invoice from the DB.
exports.destroy = function(req, res) {
  Invoice.findById(req.params.id, function (err, invoice) {
    if(err) { return handleError(res, err); }
    if(!invoice) { return res.status(404).send('Not Found'); }
    invoice.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
