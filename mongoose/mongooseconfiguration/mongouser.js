var mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/Users');
mongoose.Promise=global.Promise;

module.exports={
  mongoose,
}
