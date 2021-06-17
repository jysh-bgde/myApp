var express = require('express');
var router = express.Router();
// var createError = require('http-errors');
var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var mongoose = require('mongoose');
var passport = require('passport');
// var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');
// var passportLocalMongoose = require('passport-local-mongoose');
var User = require('../models/user');

const app = express();
app.use(require('express-session')({
  secret: "Any normal Word",
  resave: false,
  saveUninitialized: false
}));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());


/* GET home page. */
router.get('/', function(req, res,next ) {
  res.redirect('/home');
});

router.get('/home', function(req,res,next){
  res.render('home', {title: 'Home'});
} )
router.get('/users/:userid',isLoggedIn ,function(req,res,next){
  res.render('user_profile', {title: 'userprofile'});
} )
router.get('/login', function(req,res,next){
  res.render('login', {title: 'login'});
} )

router.post("/login",passport.authenticate("local",{
  successRedirect:"/users/:userid",
  failureRedirect:"/login"
}),function (req, res){
});

router.get('/register', function(req,res,next){
  res.render('registration', {title: 'registration'});
} )
router.post("/register",(req,res)=>{
    
  User.register(new User({username: req.body.username,password: req.body.password,first_name:req.body.first_name,Last_name: req.body.Last_name, date_of_birth: req.body.date_of_birth, country: req.body.country, city: req.body.city, gender: req.body.gender}),req.body.password,function(err,user){
      if(err){
          console.log(err);
          res.render("registration");
      }
  passport.authenticate("local")(req,res,function(){
      res.redirect("/login");
  })    
  })
})

router.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

router.get('/about', function(req,res,next){
  res.render('about',{title: "About"});

});

router.get('/contact', function(req,res,next){
  res.render('contactUs', {title: "ContactUs"});

});

module.exports = router;
