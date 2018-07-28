'use strict';
const Review = require( '../models/profile' );
console.log("loading the profile Controller")


// this displays all of the skills
exports.getAlLikes = ( req, res ) => {
  console.log('in getAlLikes')
  Review.find( {} )
    .exec()
    .then( ( theLikes ) => {
      //console.log('reviews are: ')
      //console.dir(theReviews)
      res.render( 'profile', {
        ls: theLikes
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'like promise complete' );
    } );
};

exports.saveLikes = ( req, res ) => {
  //console.log("in saveReview!")
  ///console.dir(req)
  let newLike = new Like( {
    headline: req.body.headline,
    content: req.body.content
  } )

  //console.log("review = "+newReview)

  newLike.save()
    .then( () => {
      res.redirect( '/profile' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.deleteLikes = (req, res) => {
  console.log("in deleteLikes")
  let likeName = req.body.deleteLike
  if (typeof(likeName)=='string') {
      Review.deleteOne({headline:likeName})
           .exec()
           .then(()=>{res.redirect('/profile')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(likeName)=='object'){
      Review.deleteMany({headline:{$in:likeName}})
           .exec()
           .then(()=>{res.redirect('/profile')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(likewName)=='undefined'){
      console.log("This is if they didn't select a review")
      res.redirect('/profile')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown likeName: ${likeName}`)
  }

};
