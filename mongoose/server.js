var {mongoose}=require('./mongooseconfiguration/mongotodo');
var {TodoModel}=require('./models/todoconf');
var {userModel}=require('./models/userconfig');
const _=require('lodash');

var{ObjectID}=require('mongodb');
var bodyparser=require('body-parser');
var express=require('express');
var app=express();

const port=process.env.PORT||3000;

app.use(bodyparser.json());

//create one todo
app.post('/todos',(req,res)=>{
  // console.log(req.body);
  var todo=new TodoModel({text:req.body.text});
  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  })
});

//all todos
app.get('/todos',(req,res)=>{
  TodoModel.find().then((todos)=>{
    res.send({
      todos
    })
  },(e)=>{
    res.send(e);
  })
})


//get one todo
app.get('/todos/:id',(req,res)=>{
var id=req.params.id;

if(!ObjectID.isValid(id)){
  res.status(404).send();
}
else{
  TodoModel.findById(id).then((todo)=>{
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
app.delete('/todos/:id',(req,res)=>{
var id=req.params.id;
if(!ObjectID.isValid(id)){
  return res.status(404).send();
}

TodoModel.findByIdAndRemove(id).then((todo)=>{
  if(!todo){
    return res.status(404).send();
  }

  res.send(todo);
}).catch((e)=>{
  res.status(400).send();
})

})

//updateTodo
app.patch('/todos/:id',(req,res)=>{
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

TodoModel.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
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


app.listen(port,()=>{
  console.log(`Listening on port ${port}`);
})
