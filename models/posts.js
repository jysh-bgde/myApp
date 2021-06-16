var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostsSchema = new Schema(
    {
      user_id : {type: Schema.Types.ObjectId, ref:'User', required: true},
        post_name: {type: String, required: true, maxLength: 100},
        post_details: {type: String, required: true, maxLength: 100},
    }
);

PostsSchema
.virtual('url')
.get(function(){
    return '/users/' + this.user_id + '/posts/' + this._id;
});


module.exports = mongoose.model('Posts',PostsSchema)