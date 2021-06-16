const { DateTime } = require('luxon');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;


var UserSchema = new Schema(
  { username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    first_name: {type: String, required: true, maxLength: 100},
    Last_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date,  required: true, maxLength: 100},
    country: {type: String,  required: true, maxLength: 100},
    city: {type: String,  required: true, maxLength: 100},
    gender: {type: String,  required: true, maxLength: 100},
  }
  );
  
  

  UserSchema
.virtual('name')
.get(function () {
  return this.first_name + ' ' + this.Last_name;
});

UserSchema
.virtual('url')
.get(function () {
  return '/user/' + this._id;
});

UserSchema
.virtual('date_of_birth_formatted')
.get(function(){
  return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
});


UserSchema.pre('save', function(next) {
  var user = this;

// only hash the password if it has been modified (or is new)
if (!user.isModified('password')) return next();

// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
  if (err) return next(err);

  // hash the password using our new salt
  bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
  });
});


});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);