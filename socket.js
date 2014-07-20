var app    = require('express')();
var server = require('http').Server(app);
var io     = require('socket.io')(server);

server.listen(31337);

var stdin = process.openStdin();

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

/*==========  Connection  ==========*/
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world from server:' + new Date().getTime()});
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

/*==========  Sending commands  ==========*/
stdin.addListener("data", function(d) {
  var cmd = d.toString().substring(0, d.length-1);
  io.emit('command', { title : cmd });
});
