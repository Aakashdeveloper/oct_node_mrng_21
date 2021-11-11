const express = require('express');
const app = express();
const port = 9870;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const Pool = require('pg').Pool;
const pool = new Pool({
    user:'',
    host:'127.0.0.1',
    database:'userlist',
    port:5432
})

app.get('/',(req,res) => {
    pool.query('SELECT * From employee',(err, result) => {
        if(err) throw err;
        res.send(result.rows);
    })
})

app.post('/',(req,res) => {
    var name = req.body.name
    var lname = req.body.lname
    pool.query('insert into employee(name,lname) VALUES ($1,$2)',([name,lname]),(err,result) => {
        if(err) throw err;
        res.send(result.rows);
    })
})


app.listen(port,() => {
    console.log(`Server is listening on ${port}`)
})