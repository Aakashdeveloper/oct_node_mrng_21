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

    productRouter.route('/details/:id')
    .get((req,res) => {
        var id = Number(req.params.id)
        var query;
        if(req.query.color){
            query={"category__id":id,"Color":req.query.color}
        }else{
            query={"category__id":id}
        }
        mongodb.connect(url, function(err, dc){
            if(err){
                res.status(501).send("Error While Connecting")
            }else{
                var dbobj = dc.db('octmrng');
                dbobj.collection('products').find(query).toArray(function(err,data){
                    if(err){
                        res.status(501).send("Error While Fetching")
                    }else{
                        res.render('productDetails',{title:'Products By Category',menu:menu,products:data})
                    }
                })
            }
        })
    })

    return productRouter
}


module.exports = router;