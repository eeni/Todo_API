var {mongoose}=require('./mongooseconfiguration/mongotodo');
var {TodoModel}=require('./models/todoconf');
var {userModel}=require('./models/userconfig');
const _=require('lodash');

var{ObjectID}=require('mongodb');
var bodyparser=require('body-parser');
var express=require('express');
var app=express();
var {authenticate}=require('./authentication/auth');
var bcrypt=require('bcryptjs');
const port=process.env.PORT||3000;

app.use(bodyparser.json());

//create one todo
app.post('/todos',authenticate,(req,res)=>{
  // console.log(req.body);
  var todo=new TodoModel({text:req.body.text,
  _creator:req.user._id});

  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  })
});

//all todos
app.get('/todos',authenticate,(req,res)=>{
  TodoModel.find({_creator:req.user._id}).then((todos)=>{
    res.send({
      todos
    })
  },(e)=>{
    res.send(e);
  })
})


//get one todo
app.get('/todos/:id',authenticate,(req,res)=>{
var id=req.params.id;

if(!ObjectID.isValid(id)){
  res.status(404).send();
}
else{
  TodoModel.findOne({_id:id,_creator:req.user._creator}).then((todo)=>{
    if(!todo){
     res.status(404).send();
    }
    else{
    res.send({todo});}
  }).catch((e)=>{
    res.status(400).send();
  })
}

});


//deleteTodo
app.delete('/todos/:id',authenticate,(req,res)=>{
var id=req.params.id;
if(!ObjectID.isValid(id)){
  return res.status(404).send();
}

TodoModel.findOneAndRemove({_id:id,
_creator:req.user._creator}).then((todo)=>{
  if(!todo){
    return res.status(404).send();
  }

  res.send(todo);
}).catch((e)=>{
  res.status(400).send();
})

})

//updateTodo
app.patch('/todos/:id',authenticate,(req,res)=>{
  var id=req.params.id;
  var body=_.pick(req.body,['text','completed']);
if(!ObjectID.isValid(id)){
  return res.status(404).send();
}

if(_.isBoolean(body.completed)&&body.completed){
  body.completedat=new Date().getTime();
}
else{
  body.completedat=null;
}

TodoModel.findOneAndUpdate({_id:id,_creator:req.user._creator},{$set:body},{new:true}).then((todo)=>{
  if(!todo){
    res.status(404).send();
  }
  else{
    res.send({todo});
  }
}).catch((e)=>{
  res.status(400).send();
})

})

//create a new user

app.post('/users',(req,res)=>{
  var body=_.pick(req.body,['email','password']);
  var user=new userModel(body);
  user.save().then(()=>{
    return user.generateAuthTokens();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  })
})



app.get('/users/me',authenticate,(req,res)=>{
res.send(req.user);
})

//login
// app.post('/users/login',(req,res)=>{
//   var email=req.body.email;
//   var passwordd=req.body.password;
//   userModel.findOne({email}).then((user)=>{
//     if(user){
//     bcrypt.compare(req.body.password,user.password,(err,bool)=>{
//       if(bool){
//         res.send(passwordd).send(email);
//
//       }
//       else {
//         return Promise.reject();
//       }
//     })
//     }
//     else{
//       return Promise.reject();
//     }
//   }).catch((e)=>{
//     res.status(404).send();
//   })
// })


//login v2
app.post('/users/login',(req,res)=>{
  var body=_.pick(req.body,['email','password']);
  userModel.findByCredintial(body.email,body.password).then((user)=>{
    return user.generateAuthTokens().then((token)=>{
      res.header('x-auth',token).send(user);
    });
  }).catch((e)=>{
    res.status(400).send();
  })
});

app.delete('/users/me/tokens',authenticate,(req,res)=>{
 req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.listen(port,()=>{
  console.log(`Listening on port ${port}`);
})
