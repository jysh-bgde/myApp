var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PhotosSchema = new Schema(
    {
      user_id : {type: Schema.Types.ObjectId, ref:'User', required: true},
        photo_title: {type: String, required: true, maxLength: 100},
        photo_filename: {type: String, required: true, maxLength: 100},
    }
);

PhotosSchema
.virtual('url')
.get(function(){
    return '/user/' + this.user_id + '/photos/' + this._id;
});


module.exports = mongoose.model('Photos',PhotosSchema);