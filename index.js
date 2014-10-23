var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Game = require('./resources/game.js');

var rooms = new Array();
var players = new Array();

rooms.push('Any');

function send_status(m) {
	io.emit('status', m);
}

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get("/resources/graphics.js", function (req, res) {
    res.sendfile(__dirname + "/resources/graphics.js");
});

app.get("/resources/client.js", function (req, res) {
    res.sendfile(__dirname + "/resources/client.js");
});

var c_game;

io.on('connection', function(socket){
	io.to(socket.id).emit('roomList', rooms); //Send current room list
	socket.on('joinRoom', function(room) {
		console.log(socket.id + ' joined ' + room);
		players.push(socket.id);
		if (players.length == 2) {
			c_game = new Game();
			c_game.loadPlayers(players);
			c_game.deal_cards();
			c_game.init(io);
			c_game.sendRoomAlert("GAME STARTED", io);
		}
	});
	
	socket.on('play_center', function(deck_index) {
		console.log(socket.id + ' attempted to play ' + deck_index);
		c_game.playCard_toTable(socket.id, deck_index);
		io.emit('play_card', c_game.getCard(deck_index));
		c_game.updateHand(socket.id, io);
		
	});
	
	socket.on('play_bank', function(deck_index) {
		console.log(socket.id + ' attempted to bank ' + deck_index);
		c_game.playCard_toBank(socket.id, deck_index); //game logic
		io.emit('play_bank', c_game.getCard(deck_index));
		c_game.updateHand(socket.id, io);
		
	});	
	
	socket.on('chat message', function(msg){//CHAT
		io.emit('chat message', msg, socket.id);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});