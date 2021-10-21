var express = require('express');
var redis = require('redis');
var mongodb = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var app = express();
var port = 1234;

const client = redis.createClient({
    host:'localhost',
    port:6379
})

app.get('/data', function (req, res) {
    const userInput = (req.query.color).trim()
    // check data in redis
    client.get(`${userInput}`,(err,result) => {
        //return from redis in case data is saved
        if(result){
            const output = JSON.parse(result);
            res.send(output)
        }else{
            //get data from mongodb
            mongodb.connect(url, function(err, dc) {
                if(err){
                    res.status(501).send('Error While connecting');
                }else{
                    const dbobj = dc.db('octmrng');
                    dbobj.collection('products').find({Color:userInput}).toArray(function(err,data){
                        if(err){
                            res.status(501).send('Error While Fetching');
                        }else{
                            //save data in redis for next time
                            client.setex(`${userInput}`,3600,JSON.stringify({source:'Redis',data}))
                            // first time return from mongodb
                            res.send({source:'MongoDb',data})
                        }
                    })
                }
            })
        }
    })
})


app.listen(port,(err) => {
    console.log(`Server is ruuning on port ${port}`)
})