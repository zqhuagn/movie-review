var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('review', { title: 'Write Reviews' });
});

router.get('/',function(req, res, next){
  res.render('review',{headline:"headline",content:"content"})
})

router.post('/',function(req, res, next){
  console.log(req.body.headline)
  console.log(req.body.content)
  const headline = req.body.headline
  const content = req.body.content
  res.render('review',{headline:headline, content:content}) //:x,square:square,squares:squares})
})

module.exports = router;
