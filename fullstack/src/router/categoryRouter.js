var express = require('express');
var categoryRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var url = process.env.MongoUrl;

function router(menu){
    categoryRouter.route('/')
        .get((req,res) => {
            mongodb.connect(url, function(err, dc){
                if(err){
                    res.status(501).send("Error While Connecting")
                }else{
                    var dbobj = dc.db('octmrng');
                    dbobj.collection('category').find().toArray(function(err,data){
                        if(err){
                            res.status(501).send("Error While Fetching")
                        }else{
                            res.render('category',{title:'Category Page',menu:menu, category:data})
                        }
                    })
                }
            })
            
        })

    categoryRouter.route('/details')
        .get((req,res) => {
            res.send('category details')
        })
    
    return categoryRouter
}

module.exports = router