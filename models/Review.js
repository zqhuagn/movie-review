'use strict';
const mongoose = require( 'mongoose' );

var reviewSchema = mongoose.Schema( {
  headline: String,
  content: String
} );

module.exports = mongoose.model( 'review', reviewSchema );
