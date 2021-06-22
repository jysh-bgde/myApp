const User = require('../models/user')
const Posts = require('../models/posts')
const photos = require('../models/photos')
const async = require('async');
const mongoose = require('mongoose');

const {body, validationResult} = require('express-validator');
const { render } = require('ejs');



exports.posts_list = function(req,res,next){
  Posts.find()
  .exec(function(err, list_posts){
    if(err){return next(err);}

    list_posts.sort(function(a, b) {
      var c = new Date(a.posted_at);
      var d = new Date(b.posted_at);
      return c-d;
  });
    res.render('home', {title: 'All Posts', posts_list: list_posts, currentuser: req.user})
  })
  
};

exports.user_login = function(req,res,next){

  
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
  async.parallel({
    user: function(callback){
      User.findById(req.params.userid).exec(callback)
    },
    user_posts_list: function(callback){
      Posts.find({'user_id': req.user._id}).exec(callback)
    },
  }, function(err, results){
    if(err){return next(err);}

    if(results.user==null){
      var err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
    // console.log(results.user_posts_list)
    res.render('user_profile',{title: results.user.username,
      user: results.user, user_posts_list: results.user_posts_list.sort(function(a, b) {
        var c = new Date(a.posted_at);
        var d = new Date(b.posted_at);
        return c-d;
    }), currentuser: req.user})


  });
  
     
   
  };
  
  // const user_posts_list = Posts.find({user_id : req.params.userid})
  // .exec(function(err,user_posts_list)
  // {
  //     if(err)
  //     {
  //         return next(err);
      
  //       }
      
  //       if(user_posts_list==null)
  //       console.log("No posts")
  //     })

  
  exports.username = function(req,res,next){
    // const origin = req.protocol + '://' + req.get('host')
    // const url = new URL(
    //   req.originalUrl, origin
    // );
    
    // const user_name= url.searchParams.get('username')
    var posts =[];
    async.parallel({
      user: function(callback){
        User.find({'username': req.query.username }).exec(callback)
      },
      user_posts_list: async function(callback){
        const user_id = await User.find({'username': req.query.username }).populate('_id')
        // console.log(user_id[0]._id._id)
        posts = await Posts.find({user_id: mongoose.Types.ObjectId(user_id[0]._id._id)})
        // console.log(posts)
        posts.sort(function(a, b) {
          var c = new Date(a.posted_at);
          var d = new Date(b.posted_at);
          return c-d;
      });
      },
    }, function(err, results){
      if(err){return next(err);}
  
      if(results.user[0]==null){
        var err = new Error('User not found');
        err.status = 404;
        return next(err);
      }
      // console.log(posts)
      res.render('user_profile',{title: results.user[0].username,
        user: results.user[0], user_posts_list: posts, currentuser: req.user})
  
  
    });
    
       
     
    };
  
    exports.user_friends = function(req,res,next){
      User.findById(req.params.userid).populate('friends').exec(function(err, user){
        if(err){return next(err);}
        if(user==null){
          var err = new Error('User not found');
          err.status = 404;
          return next(err);
        }
        
        res.render('friends', {friends: user.friends, currentuser : req.user, title: user.username + 'friends'})

       
      })
    }


  
  

