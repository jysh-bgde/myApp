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
const async = require('async')

var Post = require('../models/posts');
var userController= require('../controllers/userController')
let Pusher = require('pusher');
var fs = require('fs');
var multer = require('multer');
var ProfilePhotos = require('../models/profilephotos')
var storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,'uploads')
  },
  filename: (req,file,cb) =>{
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var User = require('../models/user');

var upload = multer({storage: storage})
var path = require('path');



const pusher = new Pusher({
  appId: "1222639",
  key: "0fe554d234b992ab53fd",
  secret: "544439e54f33e09a3f63",
  cluster: "ap2",
  useTLS: true
});


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
 res.render('index.ejs');
});

router.get('/home', isLoggedIn, userController.posts_list  )

router.get('/login', function(req,res,next){
  res.render('login', {title: 'login'});
} )

router.post("/login",passport.authenticate("local"),
function (req, res){
    res.redirect('/home');
  
  
});

router.post('/users/:id/act', isLoggedIn, (req,res,next)=> {
  const action = req.body.action;

  action==='Friend'? User.updateOne({_id: req.user._id}, {$addToSet:{friends: req.params.id}}, (err) => { if(err) {return next(err);} res.send('');} ) :  User.updateOne({_id: req.user._id}, {$pull:{friends: {$in: req.params.id}}}, (err) => { if(err) {return next(err);}  res.send('');} );
})

router.post('/posts/:id/act',isLoggedIn, (req, res, next) => {
  const action = req.body.action;
  // console.log(action)
  // console.log(req.params.id)
  const counter = action === 'Like' ? 1 : -1;
  
  Post.updateOne({_id: req.params.id}, {$inc: {likes_count: counter}}, {}, (err, numberAffected) => {
    if(err){return next(err);}
    pusher.trigger('post-events', 'postAction', {action: action, postId: req.params.id}, req.body.socketId);
      res.send('');

  
  });

  action==='Like' ? User.updateOne({_id: req.user._id}, {$addToSet:{liked_posts: req.params.id}}, (err) => { if(err) {return next(err);}} ) :  User.updateOne({_id: req.user._id}, {$pull:{liked_posts: {$in: req.params.id}}}, (err) => { if(err) {return next(err);}} );

});


router.get('/register', function(req,res,next){
  res.render('registration', {title: 'registration'});
} )
router.post("/register",upload.single('image'),(req,res)=>{
    
  // User.register(new User({username: req.body.username,
  //     password: req.body.password,
  //     first_name:req.body.first_name,
  //     Last_name: req.body.Last_name,
  //     date_of_birth: req.body.date_of_birth,
  //     country: req.body.country,
  //     city: req.body.city,
  //     gender: req.body.gender
  //     }),req.body.password,function(err,user){
  //     if(err){
       
  //         console.log(err);
  //         res.render("registration");
  //       }
        
  //       console.log(user);
        
       
        
  //     })

      async.waterfall([
        function(callback) {
          // console.log(req.body.username)
        //  User.find({'username': req.body.username }).exec(function(err, user){if(err){console.log(err);}
        //  console.log(user._id);
        // callback(null,user)
        // })
        User.register(new User({username: req.body.username,
          password: req.body.password,
          first_name:req.body.first_name,
          Last_name: req.body.Last_name,
          date_of_birth: req.body.date_of_birth,
          country: req.body.country,
          city: req.body.city,
          gender: req.body.gender
          }),req.body.password,function(err,user){
          if(err){
           
              console.log(err);
              res.render("registration");
            }
            
            callback(null,user)
            
           
            
          })
         
        
        },
       function(user, callback){

          ProfilePhotos.create({
            user_id : user._id,
            img: {
              data: fs.readFileSync(path.join('C:/Users/User/Desktop/myApp/uploads/' + req.file.filename)),
              contentType: 'image/png'
            }
          }, (err,item) => {
            if(err){
              console.log(err);
            }
            else {
              // console.log(user_id)
              item.save();
           }
           callback(null,item)
         }
         
         )
         
        
        }
      ], function(err, results) {

        // console.log(results)
        


        // results is now equal to: {one: 1, two: 2}
    });

    //   async ()=>{
    //     const user = await User.find({'username': req.body.username })
    //     console.log(user._id)
       
    //      ProfilePhotos.create({
    //      user_id : user._id,
    //      img: {
    //        data: fs.readFileSync(path.join('C:/Users/User/Desktop/myApp/uploads/' + req.file.filename)),
    //        contentType: 'image/png'
    //      }
    //    }, (err,item) => {
    //      if(err){
    //        console.log(err);
    //      }
    //      else {
    //        console.log(user_id)
    //       //  item.save();
    //     }
    //   }
      
    //   )
      
      
      
    // }
    
    res.redirect('/login');

  

})

router.get("/logout",isLoggedIn,(req,res)=>{
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

router.get('/about', isLoggedIn, function(req,res,next){
  res.render('about',{title: "About", currentuser: req.user});

});

router.get('/contact',isLoggedIn, function(req,res,next){
  res.render('contactUs', {title: "ContactUs", currentuser: req.user});

});
router.get('/username',isLoggedIn, userController.username);

module.exports = router;
