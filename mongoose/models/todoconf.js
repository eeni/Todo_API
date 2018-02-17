var mongoose=require('mongoose')
var TodoModel= mongoose.model('Todos',{
  text:{
    type:String,
    required:true,
    minlength:1,
    trim:true

},
completed:{
  type:Boolean,
default:false,
},
completedat:{
  type:Number,
  default:null
}

});
module.exports={
  TodoModel
}
