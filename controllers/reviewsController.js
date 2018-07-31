'use strict';
const Review = require( '../models/Review' );
console.log("loading the reviews Controller")


// this displays all of the skills
exports.getAllReviews = ( req, res ) => {
  console.log('in getAllReviews')
  Review.find( {} )
    .exec()
    .then( ( theReviews ) => {
      //console.log('reviews are: ')
      //console.dir(theReviews)
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
/*
exports.attachReview = ( req, res, next ) => {
  console.log('in attachReviewss')
  Skill.find( {student:res.locals.user.googleemail} )
    .exec()
    .then( ( reviews ) => {
      res.locals.reviews = reviews
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'review promise complete' );
    } );
};

exports.getReviewItem = ( req, res, next ) => {
  console.log('in getReviewItem')
  const objId = new mongo.ObjectId(req.params.id)
  Review.findOne(objId) //{"_id": objId})
    .exec()
    .then( ( review ) => {
      res.render('reviewItem',{r:reviews})
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'attachOneReview promise complete' );
    } );
};

*/

exports.saveReview = ( req, res ) => {
  //console.log("in saveReview!")
  ///console.dir(req)
  let newReview = new Review( {
    headline: req.body.headline,
    content: req.body.content
  } )

  //console.log("review = "+newReview)

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
  let reviewName = req.body.dReview
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

};
