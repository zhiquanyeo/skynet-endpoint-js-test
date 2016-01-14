var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/', express.static(__dirname));

app.get('/', function(req, res) {
	res.sendFile(__dirName + 'index.html');
});

io.on('connection', function(socket) {
	socket.emit('robotUpdate', {
		testField: 1,
		testField2: 2
	});
});

http.listen(3000, function() {
	console.log("Listening on *:3000");
});