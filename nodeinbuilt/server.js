var http = require('http');

// req >>>>> what we will pass to server > / ? form
// res >>>>> what server send us back
var server = http.createServer(function(req, res){
    res.write('<h1>Created First Node Server</h1>');
    res.end();
});

server.listen(5300);