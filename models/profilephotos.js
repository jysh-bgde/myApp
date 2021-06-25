var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProfilePhotosSchema = new Schema(
    {
      user_id: {type: Schema.Types.ObjectId, ref:'User', required: true},
      img: {data: Buffer, contentType: String},
        
    },{timestamps:true}
);

ProfilePhotosSchema
.virtual('url')
.get(function(){
    return '/user/' + this.user_id + '/photo/' + this._id;
});
//image/png
//Binary('/9j/4AAQSkZJRgABAQEASABIAAD/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABh...', 0)
// 60cafd2d8ccb1219e84fff8a

module.exports = mongoose.model('ProfilePhotos', ProfilePhotosSchema )