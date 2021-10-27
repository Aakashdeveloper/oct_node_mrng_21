const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()
const port = process.env.PORT || 7123;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoUrl = process.env.MongoUrl;
const swaggerUi = require('swagger-ui-express');
const package = require('./package.json');
const swaggerDocument = require('./swagger.json');

swaggerDocument.info.version = package.version;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

let db;
let col_name = "octUser";


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

// health check
app.get('/',(req,res) => {
    res.status(200).send("Health Ok")
})
app.get('/health',(req,res) => {
    res.status(200).send("Health Ok")
})

//Read
app.get('/users', (req,res) => {
    var query = {}
    if(req.query.city && req.query.role){
        query = {role:req.query.role,city:req.query.city, isActive:true}
    }
    else if(req.query.role){
        query = {role:req.query.role, isActive:true}
    }
    else if(req.query.city){
        query = {city:req.query.city, isActive:true}
    }
    else if(req.query.isActive){
        let isActive = req.query.isActive
        if(isActive == "false"){
            isActive = false
        }else{
            isActive = true
        }
        query = {isActive:isActive}
    }
    else{
        query = {isActive:true}
    }
    db.collection(col_name).find(query).toArray((err,data) => {
        if(err) throw err;
        res.status(200).send(data)
    })
})

//find particular user
app.get('/user/:id',(req,res) => {
    var id = mongo.ObjectId(req.params.id);
    db.collection(col_name).find({_id:id}).toArray((err,result) => {
        if(err) throw err;
        res.status(200).send(result)
    })
})


//Post
app.post('/addUser',(req,res) => {
    console.log(req.body)
    db.collection(col_name).insert(req.body,(err,result) => {
        if(err) throw err;
        res.status(200).send('data added')
    })
})


// updateUser
app.put('/updateUser',(req,res) => {
    db.collection(col_name).updateOne(
        {_id:mongo.ObjectId(req.body._id)},
        {
            $set:{
                name: req.body.name,
                city: req.body.city,
                phone: req.body.phone,
                role: req.body.role,
                isActive: true,
            }
        },(err,result) => {
            if(err) throw err;
            res.status(200).send('data updated')
        }
    )
})

//delete user
app.delete('/deleteUser', (req,res) => {
    db.collection(col_name).remove(
        {_id:mongo.ObjectId(req.body._id)},(err,result) => {
            if(err) throw err;
            res.send("Data Deleted")
        }
    )
})

// deactivate
app.put('/deactivate', (req,res) => {
    db.collection(col_name).updateOne(
        {_id:mongo.ObjectId(req.body._id)},
        {
            $set:{
                isActive:false
            }
        },(err,result)=>{
            if(err) throw err;
            db.collection(col_name).findOne({_id:mongo.ObjectId(req.body._id)},
            (err,result) => {
                res.send(`${result.name} is deactivated now`) 
            })
        }
    )
})

// Activate
app.put('/activate', (req,res) => {
    db.collection(col_name).updateOne(
        {_id:mongo.ObjectId(req.body._id)},
        {
            $set:{
                isActive:true
            }
        },(err,result)=>{
            if(err) throw err;
            db.collection(col_name).findOne({_id:mongo.ObjectId(req.body._id)},
            (err,result) => {
                res.send(`${result.name} is Activated now`) 
            })
        }
    )
})


//DB Connection
MongoClient.connect(mongoUrl,(err,client) => {
    if(err) console.log('Error while connecting to Mongo')
    db = client.db('octmrng');
    app.listen(port, (err) => {
        console.log(`Server is running on port ${port}`)
    })
})

