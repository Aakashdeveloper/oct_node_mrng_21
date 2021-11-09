const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const port = 9800;
const GoogleStrategy = require('passort-google-oauth').OAuth2Strategy;



app.listen(port,() => {
    console.log(`listening on port ${port}`)
})