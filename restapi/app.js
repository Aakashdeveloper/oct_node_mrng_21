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
let db;
let col_name = "octUser";

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

// health check
app.get('/',(req,res) => {
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
        query = {}
    }
    db.collection(col_name).find(query).toArray((err,data) => {
        if(err) throw err;
        res.status(200).send(data)
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


//DB Connection
MongoClient.connect(mongoUrl,(err,client) => {
    if(err) console.log('Error while connecting to Mongo')
    db = client.db('octmrng');
    app.listen(port, (err) => {
        console.log(`Server is running on port ${port}`)
    })
})

