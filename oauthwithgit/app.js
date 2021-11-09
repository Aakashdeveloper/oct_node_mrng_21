const express = require('express');
const app = express();
var superagent = require('superagent');
const request = require('request');
const port = 9801;
const cors = require('cors');
app.use(cors())

app.get('/',(req,res) => {
    res.send('<a href="https://github.com/login/oauth/authorize?client_id=a4599a9128becf615e11">Login With GitHub</a>')
})

app.get('/user',(req,res) => {
    const code = req.query.code;
    if(!code){
        res.send({
            success:false,
            message:"Error While login"
        })
    }
    superagent
        .post('https://github.com/login/oauth/access_token')
        .send({
            client_id:'a4599a9128becf615e11',
            client_secret:'f305ae106e8242ea591fa43d550780ff46103a97',
            code:code
        })
        .set('Accept','application/json')
        .end((err,result) => {
            if(err) throw err;
            var acctoken = result.body.access_token
            const option = {
                url:'https://api.github.com/user',
                method:'GET',
                headers:{
                    'Accept':'application/json',
                    'Authorization': `token ${acctoken}`,
                    'User-Agent':'mycode'
                }
            }
            request(option,(err,resposne,body) =>{
                res.send(body)
            })
        })
})


app.listen(port,() => {
    console.log(`Running on port ${port}`)
})