var express = require('express');
const { route } = require('.');
var router = express.Router();
var userController = require('../controllers/userController')


router.get('/', userController.posts_list )
router.get('/:userid', userController.user_profile )


module.exports = router;
