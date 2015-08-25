'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InvoiceSchema = new Schema({
  invoice_number: String,
  customer_number: String,
  due_date: Date,
  amount: Number,
  paid_date: Date,
  user_id: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
