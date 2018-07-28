const
  createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  reviewsController = require('./controllers/reviewsController'),
  usersController = require('./controllers/usersController'),
  profileController = require('./controllers/profileController');
  session = require("express-session"),
  bodyParser = require("body-parser"),
  User = require( './models/user' ),
  flash = require('connect-flash')

//var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy; //in the auth.js, so we do not need it here
 // here we set up authentication with passport
const passport = require('passport');
const configPassport = require('./config/passport');
configPassport(passport);

/*
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var reviewRouter = require('./routes/review');
var readRouter = require('./routes/read');
var signupRouter = require('./routes/signup');
*/
var app = express();



const mongoose = require('mongoose');
mongoose.connect( 'mongodb://localhost/moviereview' );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!")
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'zzbbyanana' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));

//app.use('/news', newsRouter);


// this handles all static routes ...
// so don't name your routes so they conflict with the public folders
app.use(express.static(path.join(__dirname, 'public')));

// here is where we check on their logged in status
app.use((req,res,next) => {
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    console.log("user has been Authenticated")
    res.locals.user = req.user
    res.locals.loggedIn = true
    if (req.user){
      if (req.user.googleemail=='zqhuang@brandeis.edu'){
        console.log("Owner has logged in")
        res.locals.status = 'teacher'
      } else {
        console.log('student has logged in')
        res.locals.status = 'student'
      }
    }
  }
  next()
})

// add authentication routes
// visit this route to start the google authentication
// passport will send you to google to get auth
// and then will send the browser back to /login/authorized page
app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/login', function(req,res){
  res.render('login',{})
})

// route for logging out
app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


  // GOOGLE ROUTES =======================

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        }));

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/login');
    }
}

// we require them to be logged in to see their profile
app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

//app.use('/', indexRouter);
app.get('/review', reviewsController.getAllReviews );
app.post('/saveReview', isLoggedIn, reviewsController.saveReview);
app.post('/deleteReview', isLoggedIn, reviewsController.deleteReview);

app.get('/users',usersController.getAllUsers)
app.get('/users/:id',
        usersController.attachUser,
        //reviewsController.attachReview,
        usersController.getUser)
//app.get('/reviewItem/:id',
        // reviewsController.getReviewItem );
//app.use('/users', usersRouter);
//app.use('/review', reviewRouter);
//app.use('/read', readRouter);
//app.use('/signup', signupRouter);


app.use('/', function(req, res, next) {
  console.log("in / controller")
  res.render('index', { title: 'Movie Review App' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
