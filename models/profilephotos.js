var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProfilePhotosSchema = new Schema(
    {
      profile_id : {type: Schema.Types.ObjectId, ref:'UserProfile', required: true},
      photo_id : {type: Schema.Types.ObjectId, ref:'Photos', required: true},
        
    }
);

ProfilePhotosSchema
.virtual('url')
.get(function(){
    return '/user/' + this.profile_id + '/photo/' + this.photo_id;
});


module.exports = mongoose.model('ProfilePhotos', ProfilePhotosSchema )