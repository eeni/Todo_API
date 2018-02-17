var {mongoose}=require('./mongooseconfiguration/mongouser');

var {userModel}=require('./models/userconfig')

var person=new userModel({email:'  name@gmail.com '});
person.save().then((res)=>{
  console.log('User created ',res);
},(err)=>{
  console.log('Cant create this user',err);
})
