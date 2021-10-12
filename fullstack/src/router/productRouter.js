var express = require('express');
var productRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var url = process.env.MongoUrl;


function router(menu){
    productRouter.route('/')
    .get((req,res) => {
        mongodb.connect(url, function(err, dc){
            if(err){
                res.status(501).send("Error While Connecting")
            }else{
                var dbobj = dc.db('octmrng');
                dbobj.collection('products').find().toArray(function(err,data){
                    if(err){
                        res.status(501).send("Error While Fetching")
                    }else{
                        res.render('products',{title:'Products Page',menu:menu,products:data})
                    }
                })
            }
        })
       
    })

    productRouter.route('/details')
    .get((req,res) => {
        res.send('products details')
    })

    return productRouter
}


module.exports = router;