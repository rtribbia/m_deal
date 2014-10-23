
$("#container").hide();
$("#chat").hide();

socket.on('roomList', function(rooms) { //Update roomlist.	
	for (var i = 0; i < rooms.length; i++) {
		$('#roomlist').append($('<li>').text(rooms[i] + " ").append('<button id=\'' + rooms[i] + '\'>Join</button>'));
		$('#' + rooms[i]).click(function() {
			socket.emit('joinRoom', $(this).attr("id"));
			
			$("#roomlist").hide();
			$("#container").show();
			$("#chat").show();
			
		});
	}
});

socket.on('drawCard', function(color) {
	animLayer.add(new_card);
	animLayer.batchDraw();
});
socket.on('update_hand', function(hand) {
	current_hand = hand;
	drawHand();
	
});

socket.on('play_card', function(card) { 
	drawPlayedCard(card);
});

$('form').submit(function(){
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
	return false;
});
	socket.on('chat message', function(msg, uname){
	$('#messages').append($('<li>').text(uname + ": " + msg));
});