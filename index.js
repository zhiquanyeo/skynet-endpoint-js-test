var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mqtt = require('mqtt');

var client = mqtt.connect('tcp://localhost');

var INPUT_REGEX = /skynet\/control\/([a-z]+)\/([0-9]+)$/;

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

client.on('connect', function () {
	// Set up subscriptions
	client.subscribe('skynet/control/#');
	client.subscribe('skynet/clients/#');
});

client.on('message', function(topic, message) {
	if (INPUT_REGEX.test(topic)) {
		var matches = INPUT_REGEX.exec(topic);
		var packet = {};
		if (!packet[matches[1]]) packet[matches[1]] = {};
		if (matches[1] === 'digital') {
			packet[matches[1]][parseInt(matches[2], 10)] = message.toString() === '1' ? true : false;
		}
		else if (matches[1] === 'pwm') {
			packet[matches[1]][parseInt(matches[2], 10)] = parseFloat(message.toString());
		}
		io.emit('robotUpdate', packet);
	}
});