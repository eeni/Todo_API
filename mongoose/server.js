var {mongoose}=require('./mongooseconfiguration/mongotodo');
var {TodoModel}=require('./models/todoconf');
var {userModel}=require('./models/userconfig');

var{ObjectID}=require('mongodb');
var bodyparser=require('body-parser');
var express=require('express');
var app=express();


app.use(bodyparser.json());

app.post('/todos',(req,res)=>{
  // console.log(req.body);
  var todo=new TodoModel({text:req.body.text});
  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  })
});

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

app.listen(3000,()=>{
  console.log('Listening on port 3000');
})
