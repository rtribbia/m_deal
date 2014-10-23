var stage = new Kinetic.Stage({
	container: 'container',
	width: 1000,
	height: 700
});
var animLayer = new Kinetic.Layer();
var staticLayer = new Kinetic.Layer();
var handLayer = new Kinetic.Layer();

stage.add(handLayer).add(animLayer).add(staticLayer);


var card_width = 162;
var card_height = 250;

var current_hand = new Array(); //This is your current hand, set in client.js per server instruction
var active_select = false; //UI variable to say whether card is currently selected
var current_select = -1;
var current_select_type = "";

table_draw();

function table_draw() {

	var play_pile = new Kinetic.Rect({
		id: 'play_pile',
		x: 500,
		y: 220,
		width: 110,
		height: 155,
		cornerRadius: 10,
		stroke: '#B1D0B3',
		fill: '#6D9A70',
		strokeWidth: 10
	});	
	
	var play_btn = new Kinetic.Group({ id: 'play_btn', x: 495, y: 400, visible: false});
	var bg = new Kinetic.Rect({
		width: 120,
		height: 30,
		cornerRadius: 5,
		stroke: '#000000',
		fill: '#DDDDDD',
		strokeWidth: 2
	});	
	var text = new Kinetic.Text({
		y: 6,
		text: 'P L A Y  C A R D',
		fontSize: 16,
		fontStyle: 'bold',
		fontFamily: 'Calibri',
		fill: 'black',
		width: 120,
		align: 'center'
	}); 
	play_btn.add(bg).add(text);
	play_btn.on("mouseover", function() {
		this.scale({x: 1.2, y: 1.2});
		this.offsetX(3);
		this.offsetY(3);
		changeCursor('pointer');
		animLayer.batchDraw();	
	});
	play_btn.on("mouseout", function() {
		this.scale({x: 1, y: 1,});
		this.offsetX(0);
		this.offsetY(0);
		changeCursor('default');
		animLayer.batchDraw();	
	});
	play_btn.on("click", function() {
		if ((UIlocked()) && (current_select != -1)) {
			socket.emit('play_center',current_select);
			unlockUI();
			current_select = -1;
		}
	});
	
	var bank_btn = new Kinetic.Group({ id: 'bank_btn', x: 795, y: 600, visible: false});
	var bank_bg = new Kinetic.Rect({
		width: 120,
		height: 30,
		cornerRadius: 5,
		stroke: '#000000',
		fill: '#DDDDDD',
		strokeWidth: 2
	});	
	var bank_text = new Kinetic.Text({
		y: 6,
		text: 'B A N K  C A R D',
		fontSize: 16,
		fontStyle: 'bold',
		fontFamily: 'Calibri',
		fill: 'black',
		width: 120,
		align: 'center'
	}); 
	bank_btn.add(bank_bg).add(bank_text);
	bank_btn.on("mouseover", function() {
		this.scale({x: 1.2, y: 1.2});
		this.offsetX(3);
		this.offsetY(3);
		changeCursor('pointer');
		animLayer.batchDraw();	
	});
	bank_btn.on("mouseout", function() {
		this.scale({x: 1, y: 1,});
		this.offsetX(0);
		this.offsetY(0);
		changeCursor('default');
		animLayer.batchDraw();	
	});
	bank_btn.on("click", function() {
		if ((UIlocked()) && (current_select != -1)) {
			socket.emit('play_bank',current_select);
			unlockUI();
			current_select = -1;
		}
	});	
	
	
	
	
	animLayer.add(play_pile);
	animLayer.add(play_btn).add(bank_btn);
	animLayer.batchDraw();	
}

function changeCursor(type) {
	document.body.style.cursor = type;
}

function UIlocked() {
	return active_select;
}

function lockUI() {
	active_select = true;
}

function unlockUI() {
	active_select = false;
	current_select = -1;
	UI_hide_options();
	animLayer.batchDraw();
}

function drawPlayedCard(card) { //Draws top card on playpile
	animLayer.add(drawcard(card, 515, 235, false, true));
	animLayer.batchDraw();
}

function drawHand() {
	handLayer.destroyChildren();
	var hand_size = current_hand.length;
	if (hand_size < 2) { hand_size = 2; }
	var hand_text = 'YOUR HAND (' + current_hand.length.toString() + ')';
	var xpos = (500 - ((hand_size * 100) / 2));
	var group = new Kinetic.Group({ name: 'hand_disp', x: xpos, y: 660});
	var hand_bg = new Kinetic.Rect({
		width: hand_size * 100,
		height: 200,
		fill: '#f1f1ff',
		//cornerRadius: 10,
		stroke: 'black',
		strokeWidth: 2
	});	
	var text = new Kinetic.Text({
		x: 0,
		y: 10,
		text: hand_text,
		fontSize: 22,
		fontStyle: 'bold',
		fontFamily: 'Calibri',
		fill: 'black',
		width: hand_size * 100,
		align: 'center'
	}); 
	group.add(hand_bg);
	group.add(text);
	for (var i = 0; i < current_hand.length; i++) {
		card_kobject = drawcard(current_hand[i], (i * (card_width * 1.2 * 0.5)) + 20, 50, true, false);
		group.add(card_kobject);
	}
	group.on("mouseover", function() {
		this.setY(500);
		handLayer.batchDraw()
	});
	group.on("mouseout", function() {
		this.setY(660);
		handLayer.batchDraw()
	});
	handLayer.add(group);
	handLayer.batchDraw();
}

function UI_show_play_btn() {
	animLayer.find('#play_btn')[0].setAttr('visible', true); //Make play card button invisible
}

function UI_hide_play_btn() {
	animLayer.find('#play_btn')[0].setAttr('visible', false);
}

function UI_show_bank_btn() {
	animLayer.find('#bank_btn')[0].setAttr('visible', true); //Make play card button invisible
}

function UI_hide_bank_btn() {
	animLayer.find('#bank_btn')[0].setAttr('visible', false);
}

function UI_show_options() {
	var card_type = stage.find('#' + current_select)[0].getAttr('card_type');
	UI_show_play_btn();
	UI_show_bank_btn();	

}

function UI_hide_options() {
	UI_hide_play_btn();
	UI_hide_bank_btn();
}

function createPieChart(colors_array) {
	var group = new Kinetic.Group({ id: 'pie_chart', x: 0, y: 0 });
	var len = colors_array.length;
	for (var i = 0; i < len; i++) {
			wedgeAngle = Math.round(360 / len);
			wedgeFill = colors_array[i];

			if (i === 0) {
				wedgeRotation = 0;
			}else if (i > 0) {
				wedgeRotation = wedgeRotation + (360 / len);
			}
			wedge = new Kinetic.Wedge({
				x: 81,
				y: 125,
				radius: 49,
				angle: wedgeAngle,
				fill: wedgeFill,
				rotation: wedgeRotation,
				name: 'wedge'
			});
		group.add(wedge);
	}
	return group;
}
function drawcard(card, x_pos, y_pos, actionable, draggable) {
	var type = card.type;
	var group = new Kinetic.Group({ id: card.deck_index, card_type: card.type, x: x_pos, y: y_pos, z: 1, draggable: false});
	if (draggable) { group.setAttr('draggable','true'); }
	group.setAttr('selected', false);
	var card_select_graphic = new Kinetic.Rect({
		id: 'select_graphic',
		width: card_width,
		height: card_height,
		cornerRadius: 10,
		stroke: 'red',
		strokeWidth: 10,
		visible: false
	});	
	var card_body = new Kinetic.Rect({
		width: card_width,
		height: card_height,
		fill: 'white',
		cornerRadius: 10,
		shadowColor: 'black',
        shadowOffset: {x:3,y:3},
        shadowOpacity: 1,
	});	
	//Graphics for top property of card
	group.add(card_select_graphic);
	group.add(card_body);
	if (type == 'p') {
		var card_bg = new Kinetic.Rect({
			x: 7, //card_width * 0.06,
			y: 7, //card_height * 0.04,
			width: 148, //card_width * 0.88,
			height: 236, //card_height * 0.92, 
			stroke: 'black',
			strokeWidth: 1
		});
		var card_head = new Kinetic.Rect({
			x: 16, //card_width * 0.10,
			y: 17, //card_height * 0.07,
			width: 129,//card_width * 0.80,
			height: 46, // card_width * 0.18,
			fill: card.colors[0],
			stroke: 'black',
			strokeWidth: 1
		  });  
		var text = new Kinetic.Text({
			x: 16, //card_width * 0.09,
			y: 22, //card_height * 0.1,
			text: card.names[0],
			fontSize: 19,
			fontStyle: 'bold',
			fontFamily: 'Calibri',
			fill: 'black',
			width: 129,
			height: 46,
			align: 'center'
		}); 
		

		group.add(card_bg);
		group.add(card_head);
		group.add(text);


		for (var i = 0; i < card.prices.length; i++) {
			var price_text = new Kinetic.Text({
				x: 107, //card_width * 0.09,
				y: 85 + (i * 35), //card_height * 0.1,
				text: '$' + card.prices[i] + 'M',
				fontSize: 19,
				fontStyle: 'bold',
				fontFamily: 'Calibri',
				fill: 'black',
				width: 40,
				align: 'center'
			});
			group.add(price_text);
			var prop_img = new Kinetic.Rect({
				x: 18, //card_width * 0.10,
				y: 80 + (i * 35), //card_height * 0.07,
				width: 20 + (i * 7),//card_width * 0.80,
				height: 28, // card_width * 0.18,
				fill: 'white',
				stroke: 'black',
				strokeWidth: 1
			});  
			group.add(prop_img);
			var prop_img_head = new Kinetic.Rect({
				x: 18, //card_width * 0.10,
				y: 80 + (i * 35), //card_height * 0.07,
				width: 20 + (i * 7),//card_width * 0.80,
				height: 7, // card_width * 0.18,
				fill: card.colors[0]
			});  
			group.add(prop_img_head);
			for (var j = 0; j <= i; j++) {
				var line = new Kinetic.Line({
					points: [(18 + (j * 7)), (80 + (i * 35)), (18 + (j * 7)), (80 + (i * 35) + 28)],
					stroke: 'black',
					strokeWidth: 1
				});
				group.add(line);
			}
			var card_count = new Kinetic.Text({
				x: 13 + (i * 7), //card_width * 0.09,
				y: 87 + (i * 35), //card_height * 0.1,
				text: (i + 1),
				fontSize: 19,
				fontStyle: 'bold',
				fontFamily: 'Calibri',
				fill: 'black',
				width: 30,
				align: 'center'
			});
			group.add(card_count);
			if ((i+1) == card.prices.length) {
				var set_txt = new Kinetic.Text({ 
					x: 37 + (i * 7), //42 + (i * 7)), 95 + (i * 35)
					y: 89 + (i * 35), //card_height * 0.1,
					text: 'FULL SET',
					fontSize: 10,
					fontStyle: 'bold',
					fontFamily: 'Tahoma',
					fill: 'black',
					width: 60,
					align: 'center',
					stoke: 'white',
					strokeWidth: 2
				});
				group.add(set_txt);
			} else {
				var price_line = new Kinetic.Line({
					points: [(42 + (i * 7)), 95 + (i * 35), 105, 95 + (i * 35)],
					stroke: 'black',
					strokeWidth: 1,
					dash: [2, 2]
				});
				group.add(price_line);
			}
		}//end of properties loop
	}//end (if type == p)
	if (type == 'pwc') {
	
		var a_prices = card.prices[0];
		var b_prices = card.prices[1];

		var card_bg = new Kinetic.Rect({
			x: 7, //card_width * 0.06,
			y: 7, //card_height * 0.04,
			width: 148, //card_width * 0.88,
			height: 236, //card_height * 0.92, 
			stroke: 'black',
			strokeWidth: 1
		});
		var card_head_a = new Kinetic.Rect({
			x: 16, //card_width * 0.10,
			y: 17, //card_height * 0.07,
			width: 129,//card_width * 0.80,
			height: 46, // card_width * 0.18,
			fill: card.colors[0],
			stroke: 'black',
			strokeWidth: 1
		  });  
		var text_a = new Kinetic.Text({
			x: 16, //card_width * 0.09,
			y: 22, //card_height * 0.1,
			text: card.names[0],
			fontSize: 19,
			fontStyle: 'bold',
			fontFamily: 'Calibri',
			fill: 'black',
			width: 129,
			align: 'center'
		}); 	
		var card_head_b = new Kinetic.Rect({
			x: 16, //card_width * 0.10,
			y: 187, //card_height * 0.07,
			width: 129,//card_width * 0.80,
			height: 46, // card_width * 0.18,
			fill: card.colors[1],
			stroke: 'black',
			strokeWidth: 1
		  });  
		var text_b = new Kinetic.Text({
			x: 142, //card_width * 0.09,
			y: 227, //card_height * 0.1,
			text: card.names[0],
			fontSize: 19,
			fontStyle: 'bold',
			fontFamily: 'Calibri',
			fill: 'black',
			width: 129,
			align: 'center',
			rotation: 180
		}); 			
		group.add(card_bg);
		group.add(card_head_a);
		group.add(text_a);
		group.add(card_head_b);
		group.add(text_b);
		
		for (var i = 0; i < a_prices.length; i++) {
			var price_text = new Kinetic.Text({
				x: 107, //card_width * 0.09,
				y: 81 + (i * 25), //card_height * 0.1,
				text: '$' + a_prices[i] + 'M',
				fontSize: 16,
				fontStyle: 'bold',
				fontFamily: 'Calibri',
				fill: 'black',
				width: 40,
				align: 'center'
			});
			group.add(price_text);
			var prop_img = new Kinetic.Rect({
				x: 84, //card_width * 0.10,
				y: 80 + (i * 25), //card_height * 0.07,
				width: 14 + (i * 4),//card_width * 0.80,
				height: 20, // card_width * 0.18,
				fill: 'white',
				stroke: 'black',
				strokeWidth: 1
			});  
			group.add(prop_img);
			var prop_img_head = new Kinetic.Rect({
				x: 84, //card_width * 0.10,
				y: 80 + (i * 25), //card_height * 0.07,
				width: 14 + (i * 4),//card_width * 0.80,
				height: 4, // card_width * 0.18,
				fill: card.colors[0]
			});  
			group.add(prop_img_head);
			for (var j = 0; j <= i; j++) {
				var line = new Kinetic.Line({
					points: [(84 + (j * 4)), (80 + (i * 25)), (84 + (j * 4)), (80 + (i * 25) + 20)],
					stroke: 'black',
					strokeWidth: 1
				});
				group.add(line);
			}
			var card_count = new Kinetic.Text({
				x: 76 + (i * 4), //card_width * 0.09,
				y: 85 + (i * 25), //card_height * 0.1,
				text: (i + 1),
				fontSize: 14,
				fontStyle: 'bold',
				fontFamily: 'Calibri',
				fill: 'black',
				width: 30,
				align: 'center'
			});
			group.add(card_count);
		}//end of properties loop for A properties
		for (var i = 0; i < b_prices.length; i++) {// B properties loop
			var price_text = new Kinetic.Text({
				x: 15, //card_width * 0.09,
				y: 81 + (i * 25), //card_height * 0.1,
				text: '$' + b_prices[i] + 'M',
				fontSize: 16,
				fontStyle: 'bold',
				fontFamily: 'Calibri',
				fill: 'black',
				width: 40,
				align: 'center'
			});
			group.add(price_text);
			var prop_img = new Kinetic.Rect({
				x: 65 - (i * 4), //card_width * 0.10,
				y: 80 + (i * 25), //card_height * 0.07,
				width: 14 + (i * 4),//card_width * 0.80,
				height: 20, // card_width * 0.18,
				fill: 'white',
				stroke: 'black',
				strokeWidth: 1
			});  
			group.add(prop_img);
			var prop_img_head = new Kinetic.Rect({
				x: 65 - (i * 4), //card_width * 0.10,
				y: 80 + (i * 25), //card_height * 0.07,
				width: 14 + (i * 4),//card_width * 0.80,
				height: 4, // card_width * 0.18,
				fill: card.colors[1]
			});  
			group.add(prop_img_head);
			for (var j = 0; j <= i; j++) {
				var line = new Kinetic.Line({
					points: [((79 - (i * 4)) + (j * 4)), (80 + (i * 25)), ((79 - (i * 4)) + (j * 4)), (80 + (i * 25) + 20)],
					stroke: 'black',
					strokeWidth: 1
				});
				group.add(line);
			}
			var card_count = new Kinetic.Text({
				x: 57 - (i * 4), //card_width * 0.09,
				y: 85 + (i * 25), //card_height * 0.1,
				text: (i + 1),
				fontSize: 14,
				fontStyle: 'bold',
				fontFamily: 'Calibri',
				fill: 'black',
				width: 30,
				align: 'center'
			});
			group.add(card_count);
		}//end of properties loop for A properties
		
	}////end (if type == pwc)
	if (type == 'm') {
		var card_bg = new Kinetic.Rect({
			x: 7, //card_width * 0.06,
			y: 7, //card_height * 0.04,
			width: 148, //card_width * 0.88,
			height: 236, //card_height * 0.92, 
			stroke: 'black',
			fill: card.colors[0],
			strokeWidth: 1
		});
		var inner_border = new Kinetic.Rect({
			x: 17, //card_width * 0.06,
			y: 17, //card_height * 0.04,
			width: 128, //card_width * 0.88,
			height: 216, //card_height * 0.92, 
			stroke: 'black',
			strokeWidth: 4
		});
		var circle = new Kinetic.Circle({
			x: 81,
			y: 125,
			radius: 50,
			stroke: 'black',
			strokeWidth: 4
        });

		var text = new Kinetic.Text({
			x: 30,
			y: 107,
			text: card.names[0],
			fontSize: 32,
			fontStyle: 'bold',
			fontFamily: 'Calibri',
			fill: 'black',
			width: 100,
			align: 'center'
		}); 
		group.add(card_bg);
		group.add(inner_border);
		group.add(circle);	
		group.add(text);
	}//end-of type == 'm'
	if (type == 'a') {
		var card_bg = new Kinetic.Rect({
			x: 7, //card_width * 0.06,
			y: 7, //card_height * 0.04,
			width: 148, //card_width * 0.88,
			height: 236, //card_height * 0.92, 
			stroke: 'black',
			fill: card.colors[0],
			strokeWidth: 1
		});
		var inner_border = new Kinetic.Rect({
			x: 17, //card_width * 0.06,
			y: 17, //card_height * 0.04,
			width: 128, //card_width * 0.88,
			height: 216, //card_height * 0.92, 
			stroke: 'black',
			strokeWidth: 4
		});
		var circle = new Kinetic.Circle({
			x: 81,
			y: 125,
			radius: 50,
			stroke: 'black',
			fill: 'white',
			strokeWidth: 4
        });

		var text = new Kinetic.Text({
			x: 35,
			y: 100,
			text: card.names[0].toUpperCase(),
			fontSize: 20,
			fontStyle: 'bold',
			fontFamily: 'Calibri',
			fill: 'black',
			width: 90,
			align: 'center'
		}); 
		var title = new Kinetic.Text({
			x: 17,
			y: 40,
			text: 'ACTION CARD',
			fontSize: 16,
			fontStyle: 'bold',
			fontFamily: 'Calibri',
			fill: 'black',
			width: 128,
			align: 'center'
		}); 
		var desc = new Kinetic.Text({
			x: 20,
			y: 180,
			text: card.description,
			fontSize: 12,
			fontStyle: 'bold',
			fontFamily: 'Calibri',
			fill: 'black',
			width: 122,
			align: 'center'
		}); 
		group.add(card_bg);
		group.add(inner_border);
		group.add(circle);	
		group.add(text).add(title).add(desc);
	}//end-of type == 'a'
	if (type == 'ar') {
		var card_bg = new Kinetic.Rect({
			x: 7, //card_width * 0.06,
			y: 7, //card_height * 0.04,
			width: 148, //card_width * 0.88,
			height: 236, //card_height * 0.92, 
			stroke: 'black',
			fill: '#F5F1CC',
			strokeWidth: 1
		});
		var inner_border = new Kinetic.Rect({
			x: 17, //card_width * 0.06,
			y: 17, //card_height * 0.04,
			width: 128, //card_width * 0.88,
			height: 216, //card_height * 0.92, 
			stroke: 'black',
			strokeWidth: 4
		});
		var circle = new Kinetic.Circle({
			x: 81,
			y: 125,
			radius: 50,
			stroke: 'black',
			strokeWidth: 4
        });
		var circle_bg = new Kinetic.Circle({
			x: 81,
			y: 125,
			radius: 35,
			fill: 'white'
        });

		var text = new Kinetic.Text({
			x: 35,
			y: 112,
			text: card.names[0].toUpperCase(),
			fontSize: 24,
			fontStyle: 'bold',
			fontFamily: 'Calibri',
			fill: 'black',
			width: 90,
			align: 'center'
		}); 
		var title = new Kinetic.Text({
			x: 17,
			y: 40,
			text: 'ACTION CARD',
			fontSize: 16,
			fontStyle: 'bold',
			fontFamily: 'Calibri',
			fill: 'black',
			width: 128,
			align: 'center'
		}); 
		var desc = new Kinetic.Text({
			x: 20,
			y: 180,
			text: card.description,
			fontSize: 12,
			fontStyle: 'bold',
			fontFamily: 'Calibri',
			fill: 'black',
			width: 122,
			align: 'center'
		}); 
		group.add(card_bg);
		group.add(inner_border);
		group.add(circle).add(createPieChart(card.colors)).add(circle_bg);	
		group.add(text).add(title).add(desc);
	}//end-of type == 'ar'

	
	group.scale({x: 0.5, y: 0.5});
	group.on("mouseover", function() {
		if ((this.getAttr('selected') != true) && (UIlocked() == false)){		
			this.offsetX(40);
			this.offsetY(40);
			this.scale({x: 1, y: 1});
			this.z = this.getZIndex();
			this.moveToTop();
			this.getLayer().batchDraw();
		}
	});
	group.on("mouseout", function() {
		if ((this.getAttr('selected') != true) && (UIlocked() == false)){		
			this.offsetX(0);
			this.offsetY(0);
			this.scale({x: 0.5, y: 0.5});
			this.setZIndex(this.z);
			this.getLayer().batchDraw();
		}
	});
	if (actionable) {
		group.on("click", function() {
			if ((this.getAttr('selected') == false) && (UIlocked() == false)){
				lockUI();
				this.setAttr('selected', true);
				this.getChildren()[0].setAttr('visible', true);				
				current_select = this.getAttr('id');
				UI_show_options();
			} else if ((UIlocked() == true) && (this.getAttr('selected') == true)) {
				unlockUI();
				this.setAttr('selected', false);
				this.getChildren()[0].setAttr('visible', false);	
				UI_hide_options();
			}
			animLayer.batchDraw(); //Redraw this layer to expose Play Card button
			this.getLayer().batchDraw();	
			
			//socket.emit('attemptAction', this.id());
		});
	} 

	return group;
}	