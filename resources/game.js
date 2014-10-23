function Game(){
	this.players = new Array();
	console.log('creating deck');
	this.deck = loadDeck();
	console.log('done');
	this.available_cards = new Array();
	this.discard_pile = new Array();
	this.play_pile = new Array();
	for (var i = 0; i < this.deck.length; i++) {
		this.available_cards.push(i);
	}
	
};

function card (names, type, colors, card_price, prices, description, deck_index) {
	
	this.names = names;
	this.type = type;
	/* X m = money
	   X a = action card
	   X ar = action rent card
	   X p = property card
		 b = building card
	   X pwc = property wild card
		 pwcr = property wild card (rainbow) */
	this.colors = colors;
	this.card_price = card_price;
	this.prices = prices;
	this.loc = 'deck';
	this.owner = 'dealer';
	this.description = description;
	this.deck_index = deck_index;
};

function player (id) {
	this.id = id;
	this.money = 0;
	this.cards = new Array();
	var playCard
};


Game.prototype.loadPlayers = function(p_array) {
	var gameObject = this;
	txt('loading players from function: ' + p_array.length.toString());
	var pobjs = new Array();
	for (var i = 0; i < p_array.length; i++) {
		t_o = new player(p_array[i])
		txt('adding player: ' + t_o.id);
		pobjs.push(t_o);
	}
	gameObject.players = pobjs;
};

function txt(msg) {
	console.log(msg);
};

Game.prototype.getCard = function(index) {
	var gameObject = this;
	return gameObject.deck[index];
};

Game.prototype.playCard_toTable = function(player_id, deck_index) { //Remove Card from Player
	var gameObject = this;
	var pin = gameObject.p_index(player_id);
	gameObject.players[pin].cards.splice(gameObject.players[pin].cards.indexOf(deck_index), 1);
	gameObject.deck[deck_index].owner = 'dealer'
	gameObject.deck[deck_index].loc = 'played'

};

Game.prototype.playCard_toBank = function(player_id, deck_index) { //Remove Card from Player
	var gameObject = this;
	var pin = gameObject.p_index(player_id);
	if (gameObject.deck[deck_index].loc = 'hand') {
		gameObject.players[pin].cards.splice(gameObject.players[pin].cards.indexOf(deck_index), 1);
	}
	gameObject.deck[deck_index].loc = 'bank'
};

Game.prototype.playCard_toProperties = function(player_id, deck_index) { //Remove Card from Player
	var gameObject = this;
	var pin = gameObject.p_index(player_id);
	gameObject.players[pin].cards.splice(gameObject.players[pin].cards.indexOf(deck_index), 1);
	gameObject.deck[deck_index].loc = 'table'
};

Game.prototype.p_index = function(player_id) {
	var gameObject = this;
	var index = -1;
	for(var i = 0; i < gameObject.players.length; i++) {
		if (gameObject.players[i].id === player_id) {
			index = i;
		break;
		}
	}
	return index
};

Game.prototype.deal_cards = function() {
	var gameObject = this;
	for (var i = 0; i < gameObject.players.length; i++) { //For each player, deal hand
		console.log('dealing cards for: ' + gameObject.players[i].id);
		for (var j = 0; j < 10; j++) { //deal 5 cards per hand
			card_index = gameObject.available_cards[Math.floor(Math.random() * gameObject.available_cards.length)]; //pick random card in neutral deck
			gameObject.deck[card_index].owner = gameObject.players[i].id;
			gameObject.deck[card_index].loc = 'hand';
			gameObject.players[i].cards.push(card_index);
			gameObject.available_cards.splice(gameObject.available_cards.indexOf(card_index), 1);
		}
	}
};


Game.prototype.getPlayerCards = function(player_id) {
	var gameObject = this;
	var player_index = gameObject.p_index(player_id);
	var hand = new Array ();

	if (player_index != -1) {
		for (var i = 0; i < gameObject.deck.length; i++) {
			if (gameObject.deck[i].owner == player_id) { hand.push(i); }
		}
	} else {
		console.log(player_id + ' id not found in getCards()');
	}
	return hand;
};

Game.prototype.getPlayerHand_objs = function(id) {
	var gameObject = this;
	var hand_index = gameObject.getPlayerCards(id);
	var o_array = new Array();
	
	for (var i = 0; i < hand_index.length; i++) {
		o_array.push(gameObject.deck[hand_index[i]]);
	}
	return o_array;

};

Game.prototype.updateHand = function(id, io) {
	var gameObject = this;
	var hand = gameObject.getPlayerHand_objs(id);
	io.to(id).emit('update_hand', hand);
};

Game.prototype.init = function(io) {
	var gameObject = this;
	for (var i = 0; i < gameObject.players.length; i++) { //send dealt cards to client
		var hand = gameObject.getPlayerHand_objs(gameObject.players[i].id);
		io.to(gameObject.players[i].id).emit('update_hand', hand);
	}
};

Game.prototype.getPlayers = function() {
	var gameObject = this;
	for (var i = 0; i < gameObject.players.length; i++) {
		console.log("Player " + (i + 1).toString() + ": " + gameObject.players[i].id);
	}
};

Game.prototype.sendRoomAlert = function (msg, io) {
	var gameObject = this;
	for (var i = 0; i < gameObject.players.length; i++) {
		io.to(gameObject.players[i].id).emit('chat message', msg, 'SYSTEM');
	}
};

function loadDeck () {
	var deck = new Array();
	//(names, type, colors, properties, prices, deck_index) 
	var i = 0;
	var fuscia = '#CB7CCE';
	var orange = '#DE8C3B';
	var green = '#65B961';
	var l_green = '#F4F7E6';
	var gray = '#DCDCDC';
	var l_blue = '#A7DBEF';
	var d_blue = '#6F90BA';
	var brown = '#99744F';
	var yellow = '#FCF49F';
	var l_yellow = '#F5F1CC';
	var red = '#DF6B6B';
	var teal = '#CCF5EC';
	var salmon = '#E6BAAE';
	var purple = '#B298C8';

	var t_card = new card(['Virginia Avenue'],'p',[fuscia],2,[1,2,4],false,i); //FUSCIA
	deck.push(t_card); i++;
	var t_card = new card(['St. Charles Place'],'p',[fuscia],2,[1,2,4],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['States Avenue'],'p',[fuscia],2,[1,2,4],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['St. James Place'],'p',[orange],2,[1,3,5],false,i);  //ORANGE
	deck.push(t_card); i++;
	var t_card = new card(['New York Avenue'],'p',[orange],2,[1,3,5],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['Tennessee Avenue'],'p',[orange],2,[1,3,5],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['North Carolina Avenue'],'p',[green],4,[2,4,7],false,i);  //GREEN
	deck.push(t_card); i++;
	var t_card = new card(['Pennsylvania Avenue'],'p',[green],4,[2,4,7],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['Pacific Avenue'],'p',[green],4,[2,4,7],false,i);
	deck.push(t_card); i++; 
	var t_card = new card(['Pennsylvania Railroad'],'p',[gray],2,[1,2,3,4],false,i);  //BLACK (railroad)
	deck.push(t_card); i++;
	var t_card = new card(['Reading Railroad'],'p',[gray],2,[1,2,3,4],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['Short Line'],'p',[gray],2,[1,2,3,4],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['B. & O. Railroad'],'p',[gray],2,[1,2,3,4],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['Oriental Avenue'],'p',[l_blue],1,[1,2,3],false,i);  //LIGHT BLUE
	deck.push(t_card); i++; 
	var t_card = new card(['Connecticut Avenue'],'p',[l_blue],1,[1,2,3],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['Vermont Avenue'],'p',[l_blue],1,[1,2,3],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['Mediterranean Avenue'],'p',[brown],1,[1,2],false,i);  //BROWN
	deck.push(t_card); i++;
	var t_card = new card(['Baltic Avenue'],'p',[brown],1,[1,2],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['Atlantic Avenue'],'p',[yellow],3,[2,4,6],false,i);  //YELLOW
	deck.push(t_card); i++;
	var t_card = new card(['Ventor Avenue'],'p',[yellow],3,[2,4,6],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['Maryvin Gardens'],'p',[yellow],3,[2,4,6],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['Kentucky Avenue'],'p',[red],3,[2,3,6],false,i);  //RED
	deck.push(t_card); i++;
	var t_card = new card(['Illinois Avenue'],'p',[red],3,[2,3,6],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['Indiana Avenue'],'p',[red],3,[2,3,6],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['Park Place'],'p',[d_blue],4,[3,8],false,i);  //DARK BLUE
	deck.push(t_card); i++;
	var t_card = new card(['Boardwalk'],'p',[d_blue],4,[3,8],false,i); 
	deck.push(t_card); i++;
	var t_card = new card(['Electric Company'],'p',[teal],2,[1,2],false,i);  //TEAL (utilities)
	deck.push(t_card); i++;
	var t_card = new card(['Water Works'],'p',[teal],2,[1,2],false,i);
	deck.push(t_card); i++;
	var t_card = new card(['Property Wild Card'],'pwc',[red,yellow],3,[[2,3,6],[2,4,6]],false,i);  //RED/YELLOW
	deck.push(t_card); i++;
	var t_card = new card(['Property Wild Card'],'pwc',[red,yellow],3,[[2,3,6],[2,4,6]],false,i);  //RED/YELLOW
	deck.push(t_card); i++;
	var t_card = new card(['Property Wild Card'],'pwc',[fuscia,orange],2,[[1,2,4],[1,3,5]],false,i);  //FUSCIA/ORANGE
	deck.push(t_card); i++;
	var t_card = new card(['Property Wild Card'],'pwc',[fuscia,orange],2,[[1,2,4],[1,3,5]],false,i);  //FUSCIA/ORANGE
	deck.push(t_card); i++;
	var t_card = new card(['Property Wild Card'],'pwc',[green,gray],4,[[1,2,3],[1,2,3,4]],false,i);  //GREEN/BLACK
	deck.push(t_card); i++;
	var t_card = new card(['Property Wild Card'],'pwc',[l_blue,gray],4,[[1,2,3],[1,2,3,4]],false,i);  //LIGHT BLUE/BLACK
	deck.push(t_card); i++;
	var t_card = new card(['Property Wild Card'],'pwc',[green,d_blue],4,[[1,2,3],[1,2]],false,i);  //GREEN/DARKBLUE
	deck.push(t_card); i++;
	var t_card = new card(['Property Wild Card'],'pwc',[brown,l_blue],1,[[1,2],[1,2,3]],false,i);  //BROWN/LIGHT BLUE
	deck.push(t_card); i++;
	var t_card = new card(['Property Wild Card'],'pwc',[gray,teal],2,[[1,2,3,4],[1,2]],false,i);  //BLACK / TEAL
	deck.push(t_card); i++;
	//prices = [1,2,3,4]       print to screen: prices[0]
	/*var t_card = new card(['Property Wild Card'],'pwcr',[brown,l_blue,fuscia,orange,red,yellow,green,d_blue,gray,teal],false,false,'This card can be used as part of any property set. This card has no monetary value.',i);  //RAINBOW
	deck.push(t_card); i++;
	var t_card = new card(['Property Wild Card'],'pwcr',[brown,l_blue,fuscia,orange,red,yellow,green,d_blue,gray,teal],false,false,'This card can be used as part of any property set. This card has no monetary value.',i);  //RAINBOW
	deck.push(t_card); i++;*/
	var t_card = new card(['Pass Go'],'a',[l_yellow],1,false,'Draw 2 extra cards.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Pass Go'],'a',[l_yellow],1,false,'Draw 2 extra cards.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Pass Go'],'a',[l_yellow],1,false,'Draw 2 extra cards.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Pass Go'],'a',[l_yellow],1,false,'Draw 2 extra cards.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Pass Go'],'a',[l_yellow],1,false,'Draw 2 extra cards.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Pass Go'],'a',[l_yellow],1,false,'Draw 2 extra cards.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Pass Go'],'a',[l_yellow],1,false,'Draw 2 extra cards.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Pass Go'],'a',[l_yellow],1,false,'Draw 2 extra cards.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Pass Go'],'a',[l_yellow],1,false,'Draw 2 extra cards.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Pass Go'],'a',[l_yellow],1,false,'Draw 2 extra cards.',i);
	deck.push(t_card); i++;
	var t_card = new card(['It\'s my Birthday'],'a',[salmon],2,false,'All players give you $2 M as a gift.',i);
	deck.push(t_card); i++;
	var t_card = new card(['It\'s my Birthday'],'a',[salmon],2,false,'All players give you $2 M as a gift.',i);
	deck.push(t_card); i++;
	var t_card = new card(['It\'s my Birthday'],'a',[salmon],2,false,'All players give you $2 M as a gift.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Double the rent!'],'a',[l_yellow],1,false,'Needs to be played with a Rent card.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Double the rent!'],'a',[l_yellow],1,false,'Needs to be played with a Rent card.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Just say no!'],'a',[l_blue],4,false,'Use any time when an Action card is played against you.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Just say no!'],'a',[l_blue],4,false,'Use any time when an Action card is played against you.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Just say no!'],'a',[l_blue],4,false,'Use any time when an Action card is played against you.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Deal Breaker'],'a',[purple],5,false,'Steal a complete set of properties from any player. (Includes any buildings).',i);
	deck.push(t_card); i++;
	var t_card = new card(['Deal Breaker'],'a',[purple],5,false,'Steal a complete set of properties from any player. (Includes any buildings).',i);
	deck.push(t_card); i++;
	var t_card = new card(['Debt Collector'],'a',[l_green],3,false,'Force any player to pay you $5 M',i);
	deck.push(t_card); i++;
	var t_card = new card(['Debt Collector'],'a',[l_green],3,false,'Force any player to pay you $5 M',i);
	deck.push(t_card); i++;
	var t_card = new card(['Debt Collector'],'a',[l_green],3,false,'Force any player to pay you $5 M',i);
	deck.push(t_card); i++;
	var t_card = new card(['Sly Deal'],'a',[l_green],3,false,'Steal a property from the player of your choice. (Cannot be part of a full set.)',i);
	deck.push(t_card); i++;
	var t_card = new card(['Sly Deal'],'a',[l_green],3,false,'Steal a property from the player of your choice. (Cannot be part of a full set.)',i);
	deck.push(t_card); i++;
	var t_card = new card(['Sly Deal'],'a',[l_green],3,false,'Steal a property from the player of your choice. (Cannot be part of a full set.)',i);
	deck.push(t_card); i++;
	var t_card = new card(['Forced Deal'],'a',[l_green],3,false,'Swap any property with another player. (Cannot be part of a full set.)',i);
	deck.push(t_card); i++;
	var t_card = new card(['Forced Deal'],'a',[l_green],3,false,'Swap any property with another player. (Cannot be part of a full set.)',i);
	deck.push(t_card); i++;
	var t_card = new card(['Forced Deal'],'a',[l_green],3,false,'Swap any property with another player. (Cannot be part of a full set.)',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[brown,l_blue,fuscia,orange,red,yellow,green,d_blue,gray,teal],3,false,'Force one player to pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[brown,l_blue,fuscia,orange,red,yellow,green,d_blue,gray,teal],3,false,'Force one player to pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[brown,l_blue,fuscia,orange,red,yellow,green,d_blue,gray,teal],3,false,'Force one player to pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[green,d_blue],1,false,'All players pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[green,d_blue],1,false,'All players pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[brown,l_blue],1,false,'All players pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[brown,l_blue],1,false,'All players pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[fuscia,orange],1,false,'All players pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[fuscia,orange],1,false,'All players pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[gray,teal],1,false,'All players pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[gray,teal],1,false,'All players pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[red,yellow],1,false,'All players pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	var t_card = new card(['Rent'],'ar',[red,yellow],1,false,'All players pay you rent for Properties you own in one of these colors.',i);
	deck.push(t_card); i++;
	/*var t_card = new card(['House'],'b',[l_green],3,false,'Add onto any full set you own to add $3 M to the Rent value. (Except Railroads and Utilities)',i);
	deck.push(t_card); i++;
	var t_card = new card(['House'],'b',[l_green],3,false,'Add onto any full set you own to add $3 M to the Rent value. (Except Railroads and Utilities)',i);
	deck.push(t_card); i++;
	var t_card = new card(['House'],'b',[l_green],3,false,'Add onto any full set you own to add $3 M to the Rent value. (Except Railroads and Utilities)',i);
	deck.push(t_card); i++;
	var t_card = new card(['Hotel'],'b',[l_blue],4,false,'Add onto any full set you own to add $4 M to the Rent value. (Except Railroads and Utilities)',i);
	deck.push(t_card); i++;
	var t_card = new card(['Hotel'],'b',[l_blue],4,false,'Add onto any full set you own to add $4 M to the Rent value. (Except Railroads and Utilities)',i);
	deck.push(t_card); i++;*/
	var t_card = new card(['$1 M'],'m',[l_yellow],1,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$1 M'],'m',[l_yellow],1,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$1 M'],'m',[l_yellow],1,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$1 M'],'m',[l_yellow],1,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$1 M'],'m',[l_yellow],1,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$1 M'],'m',[l_yellow],1,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$2 M'],'m',[salmon],2,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$2 M'],'m',[salmon],2,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$2 M'],'m',[salmon],2,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$2 M'],'m',[salmon],2,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$2 M'],'m',[salmon],2,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$3 M'],'m',[l_green],3,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$3 M'],'m',[l_green],3,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$3 M'],'m',[l_green],3,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$4 M'],'m',[l_blue],4,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$4 M'],'m',[l_blue],4,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$4 M'],'m',[l_blue],4,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$5 M'],'m',[purple],5,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$5 M'],'m',[purple],5,false,false,i);
	deck.push(t_card); i++;
	var t_card = new card(['$10 M'],'m',[orange],10,false,false,i);	
	deck.push(t_card); i++;	
	
	return deck;
};

module.exports = Game;