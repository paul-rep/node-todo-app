var express= require('express');
var bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

// create todo
app.post('/todos',(req,res)=>{

    // console.log(req.body);
    var newTodo = new Todo({
        'text': req.body.text
    });

newTodo.save().then((doc)=>{
    // console.log(doc);
    res.send(doc);
},(e)=>{
    res.status(400).send(e);
});

});

app.get('/',(req,res)=>{
        console.log('hi');
        res.send({hi:'there'});
});
// get all todos
app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    },(e)=>{
       res.status(404).send(e);
    });
});
// get todo by id
app.get('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send({error:'Invalid id specified'});

    Todo.findById(id).then((todo)=>{
        if (!todo) return res.status(404).send({error: 'Not found'});
        res.send({todo});
    },(e)=>{
        res.status(400).send(e);
    });
});
// delete todo
app.delete('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send({error:'Invalid id specified'});

    Todo.findByIdAndRemove(id).then((todo)=>{
        if (!todo) return res.status(404).send({error: 'Not found'});
        res.send({todo,message:'todo deleted'});
    },(e)=>{
        res.status(400).send(e);
    });
});

app.listen(port,()=>{
    console.log(`server up on ${port}`)
});

module.exports = {app};