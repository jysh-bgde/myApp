const User = require('../models/user')
const Posts = require('../models/posts')
const photos = require('../models/photos')
const async = require('async');
const mongoose = require('mongoose');

const {body, validationResult} = require('express-validator');
const posts = require('../models/posts');
const { post } = require('../routes/posts');

exports.posts_create_get = function(req,res,next){
 res.render('create_post', {title: 'Create Post', currentuser: req.user})
};

exports.posts_create_post = [
  body('post_name','Post title must not be empty').trim().isLength({min:1}).escape(),
  body('post_detail','Post detail must not be empty').trim().isLength({min:1}).escape(),

  (req,res,next) => {
   
    
    var post = new Posts(
      {
        user_id : req.user._id,
        post_name: req.body.post_name,
        post_details: req.body.post_details,
      }
    );
     
    

  {
      post.save(function(err){
        if (err) return next(err);
        res.redirect(post.url);
      })
    }
   
    


  }
]
exports.posts_delete_get = function(req,res,next){
 res.render('posts_delete',{title: 'Delete Post', postid: req.params.postid})};


exports.posts_delete_post = function(req,res,next){
  
  Posts.findByIdAndRemove(req.params.postid, function deletePost(err){
    if(err){return next(err);}
    res.redirect('/home');
  })
};

exports.user_post = function(req,res,next)
{
  var id = mongoose.Types.ObjectId(req.params.postid);
  Posts.findById(id)
  .exec(function(err, userpost){
    if(err) {return next(err);}
    if (userpost==null) { // No results.
      var err = new Error('No posts');
      err.status = 404;
      return next(err);
    }

    else
    {
      res.render('user_post', {title: userpost.post_name , postdetail: userpost.post_details , posturl: userpost.url ,userpostid: userpost.user_id.toString(), currentuser: req.user._id.toString()})
    }
  })
}
exports.user_posts_list = function(req,res,next){
  Posts.find({user_id : req.params.userid},)
  .exec(function(err,user_posts_list)
  {
    if (err){ return next(err);}
    else
    {
      res.render('user_all_posts',{title : 'All User post', list_user_posts: user_posts_list})
    }
  })
}