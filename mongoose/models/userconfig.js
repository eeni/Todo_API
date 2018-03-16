var mongoose=require('mongoose');
var validator=require('validator');
var jwt=require('jsonwebtoken')
var _=require('lodash');
var bcrypt=require('bcryptjs');
var userSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,
    minlength:1,
    trim:true,
    unique:true,
    validate:{
      validator:validator.isEmail,
        // (value)=>{
        // return  validator.isEmail(value)
        // },
        message:'{VALUE} is not a valid email',

    }

  },
  password:{
    type:String,
    required:true,
    minlength:6,
  },
  tokens:[
    {
      access:{
        type:String,
        required:true
      },
      token:{
        type:String,
        required:true,
      }
    }
  ]
});
userSchema.methods.generateAuthTokens=function (){
  var user=this;
  var access='auth';
  var token=jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
  user.tokens.push({access,token});
  return user.save().then(()=>{
    return token;
  })
}

userSchema.methods.toJSON=function(){
  var user=this;
  var usero=user.toObject();
  return _.pick(usero,['_id','email']);
}


userSchema.statics.findByToken=function(token){
  var User=this;
  var decoded;
  try{
    decoded=jwt.verify(token,'abc123');
  }
  catch(e){
// return new Promise((resolve,reject)=>{
//   reject();
// });
return Promise.reject();
  }

  return User.findOne({
    '_id':decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  });
};


userSchema.pre('save',function(next){
  var user=this;
  if(user.isModified('password'))
  {
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        user.password=hash;
        next();
      })
    })

  }
  else {
    {
      next();
    }
  }
})

userSchema.statics.findByCredintial=function(email,password){
  var User=this;
  return User.findOne({email}).then((user)=>{
    if(!user){
      return Promise.reject();

    }
  return  new Promise((resolve,reject)=>{
      bcrypt.compare(password,user.password,(err,bool)=>{
        if(!bool){
          reject();
        }
        else{
          resolve(user);
        }
      })
    })
  })
}

userSchema.methods.removeToken=function(token){
  var user=this;
return  user.update({$pull:{tokens:{token}
}
});
};

var userModel=mongoose.model('Users',userSchema);
module.exports={
userModel
}
