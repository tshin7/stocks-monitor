'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose schema of stock
var Stock = new Schema({
  code: String,
  name: String,
  data: [Schema.Types.Mixed]
});

module.exports = mongoose.model('Stock', Stock);