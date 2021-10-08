var express = require('express');
var app = express();
var categoryRouter = require('./src/router/categoryRouter');
var productRouter = require('./src/router/productRouter');
var dotenv  = require('dotenv')
dotenv.config()
var port = process.env.PORT || 7100;
var morgan = require('morgan');
var fs = require('fs');

// static file path
app.use(express.static(__dirname+'/public'));
// file path
app.set('views','./src/views');
// file extension
app.set('view engine', 'ejs');

app.use(morgan('combined',{stream:fs.createWriteStream('./app.log',{flags:'a'})}))
// default route
app.get('/',function(req,res){
    res.render('index',{title:'Test Node'})
})

app.use('/category', categoryRouter);
app.use('/products', productRouter);

app.listen(port, function(err){
    if(err) throw err;
    console.log("Server is running on port "+port)
})