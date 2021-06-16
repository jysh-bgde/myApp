const User = require('../models/user')
const Posts = require('../models/posts')
const photos = require('../models/photos')
const async = require('async');

const {body, validationResult} = require('express-validator');
const { render } = require('ejs');
const user = require('../models/user');

exports.posts_list = function(req,res,next){
  Posts.find({}, 'user._id')
  .populate('user._id')
  .exec(function(err, list_posts){
    if(err){return next(err);}
    res.render('posts_list', {title: 'All Posts', posts_list: list_posts})
  })
  
};

exports.user_signin = function(req,res,next){

  
  User.findOne({username: req.body.username }, function(err, user){
    if(err) {return next(err)};
   
  user.comparePassword(req.body.password, function(err, isMatch){
    if(err) {return next(err)};

    if(isMatch===true)
    {
      res.redirect(user.url)
    }

    else res.redirect('/users')
  })
  })
}

exports.user_signUp = function(req, res,next){
  var user = new User(
    {
      username: req.body.username,
      password: req.body.password,
      first_name: req.body.first_name,
      Last_name: req.body.Last_name,
      date_of_birth: req.body.date_of_birth,
      country: req.body.country,
      city: req.body.city,
      gender: req.body.gender,
    }
  )

  user.save(function(err){
    if(err) throw err;
    else redirect(user.url);
  })
}

exports.user_profile = function(req,res,next){

  User.findById(req.params.userid)
  .exec(function(err, user){
    if(err) {return next(err);}
    if (user==null) { // No results.
      var err = new Error('No such user');
      err.status = 404;
      return next(err);
    }
  })

  const user_posts_list = Posts.find({user_id : req.params.userid})
  .exec(function(err,user_posts_list)
  {
    if(err)
    {
      return next(err);

    }
    
    if(user_posts_list==null)
    console.log("No posts")
  })

  res.render('user_profile',{title: user.username, user: user, list_user_posts: user_posts_list})

}
  
  

