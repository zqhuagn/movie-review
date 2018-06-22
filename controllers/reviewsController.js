'use strict';
const Review = require( '../models/Review' );
console.log("loading the reviews Controller")


// this displays all of the skills
exports.getAllReviews = ( req, res ) => {
  console.log('in getAllReviews')
  Review.find( {} )
    .exec()
    .then( ( theReviews ) => {
      console.log('reviews are: ')
      console.dir(theReviews)
      res.render( 'review', {
        rs: theReviews
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'review promise complete' );
    } );
};




exports.saveReview = ( req, res ) => {
  console.log("in saveReview!")
  console.dir(req)
  let newReview = new Review( {
    headline: req.body.headline,
    content: req.body.content
  } )

  console.log("review = "+newReview)

  newReview.save()
    .then( () => {
      res.redirect( '/review' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.deleteReview = (req, res) => {
  console.log("in deleteReview")
  let reviewName = req.body.deleteReview
  if (typeof(reviewName)=='string') {
      Review.deleteOne({headline:reviewName})
           .exec()
           .then(()=>{res.redirect('/review')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(reviewName)=='object'){
      Review.deleteMany({headline:{$in:reviewName}})
           .exec()
           .then(()=>{res.redirect('/review')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(reviewName)=='undefined'){
      console.log("This is if they didn't select a review")
      res.redirect('/review')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown reviewName: ${reviewName}`)
  }
``
};
