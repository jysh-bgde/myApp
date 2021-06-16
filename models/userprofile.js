const { DateTime } = require('luxon');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserProfileSchema = new Schema(
  {
    user_id : {type: Schema.Types.ObjectId, ref:'User', required: true},

  }
)


UserProfileSchema
.virtual('url')
.get(function(){
  return '/user/' + this.user_id;
})


module.exports = mongoose.model('UserProfile', UserProfileSchema);