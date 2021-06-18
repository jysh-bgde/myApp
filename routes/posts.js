var express = require('express');
var router = express.Router();
var postsController = require('../controllers/postsController')

router.get('/posts/create', isLoggedIn, postsController.posts_create_get);
router.post('/posts/create', isLoggedIn, postsController.posts_create_post);
router.get('/posts/:postid/delete', isLoggedIn, postsController.posts_delete_get);
router.post('/posts/:postid/delete', isLoggedIn, postsController.posts_delete_post);
router.get('/posts/:postid', isLoggedIn, postsController.user_post);
router.get('/posts', isLoggedIn, postsController.user_posts_list);

function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

module.exports = router;
