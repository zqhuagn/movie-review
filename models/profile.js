'use strict';
const mongoose = require( 'mongoose' );

var profileSchema = mongoose.Schema( {
  headline: String,
  content: String
} );

module.exports = mongoose.model( 'profile', profileSchema );
