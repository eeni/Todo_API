var mongoose=require('mongoose');

var userModel=mongoose.model('Users',{
  email:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  }
});
module.exports={
userModel
}
