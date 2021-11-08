const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('./userSchema');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//get All users
router.get('/users',(req,res) => {
    User.find({},(err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//register User
router.post('/register',(req,res) => {
    // encrypt the password
    var haspassword = bcrypt.hashSync(req.body.password,8);
    User.create({
        name:req.body.name,
        email:req.body.email,
        password:haspassword,
        phone:req.body.phone,
        role:req.body.role?req.body.role:'User'
    },(err,data) => {
        if(err) return res.status(500).send('Error');
        res.status(200).send("Registration Successful")
    })
})

//login User
router.post('/login',(req,res) => {
    User.findOne({email:req.body.email},(err,user) => {
        if(err) return res.status(500).send({auth:false,token:'Error While Login'})
        if(!user) return res.status(200).send({auth:false,token:'No User Found'})
        else{
            const passIsValid = bcrypt.compareSync(req.body.password,user.password)
            if(!passIsValid) return res.status(200).send({auth:false,token:'Invalid Password'})
            // in case password match generate the token
            var token = jwt.sign({id:user._id}, config.secret, {expiresIn:86400});
            res.send({auth:true, token:token})
        }
    })
})

// profile
router.get('/userInfo',(req,res) => {
    var token = req.headers['x-access-token'];
    if(!token) return res.send({auth:false,token:'No Token Provided'})
    // verify token
    jwt.verify(token, config.secret, (err,user) => {
        if(err) return res.status(200).send({auth:false,token:'Invalid Token'})
        User.findById(user.id,(err,result) => {
            res.send(result)
        })
    })
})

router.delete('/delete',(req,res) => {
    User.remove({},(err,data) => {
        if(err) return res.status(500).send('Error');
        res.status(200).send("User Deleted Successful")
    })
})


module.exports = router