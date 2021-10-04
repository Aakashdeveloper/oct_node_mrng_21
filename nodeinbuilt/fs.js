var fs = require('fs');

// create and overwrite
/*
fs.writeFile('mycode.txt',"Testing Node Js Package",function(err){
    if(err) throw err;
    console.log("File Created")
})*/

// create or update
fs.appendFile('testCode.txt',"This is line number 1 \n",function(err){
    if(err) throw err;
    console.log("File appended")
})