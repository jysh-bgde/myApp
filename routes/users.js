var express = require('express');
const { route } = require('.');
var router = express.Router();
var userController = require('../controllers/userController')


// router.get('/',isLoggedIn, userController.posts_list )

router.get('/:userid',isLoggedIn, userController.user_profile )
router.get('/:userid/friends',isLoggedIn, userController.user_friends )



function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}


module.exports = router;
