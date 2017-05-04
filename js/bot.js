var bot_refresh = 40		// Refresh rate in ms.
var img = new Image;
img.src = 'static/bot.png'

function Bot(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = 30;
    this.height = 20;
    this.pos= {x: 0, y:0};
    this.angle = Math.PI / 2;
    this.speed_scale = 50;	// Define a divider.
    this.speed = 0;
    this.yaw = 0;
    this.border = 10;
    this.limx = {min: this.border - this.canvas.width / 2 ,
		 max: this.canvas.width /2 - this.border};
    this.limy = {min: this.border - this.canvas.width /2,
		 max: this.canvas.height /2 - this.border};
    this.loop = null;
    this.ctx.save();

    // Setup the robot and make sure it updates on its own.
    this.start = function(){
	this.loop = setInterval(function(bot){
	    bot.move();
	    bot.draw();
	}, bot_refresh, this);
    };
    
    this.move = function(){
	var vleft = (this.speed + this.yaw) / this.speed_scale;
	var vright = (this.speed - this.yaw) / this.speed_scale;
	var tangent = (vleft - vright) / this.width;
	var vec = {x: Math.cos(this.angle), y: Math.sin(this.angle)};
	var pleft = {x: -vec.y * this.width / 2 + vec.x * vleft,
		     y: vec.x * this.width / 2 + vec.y * vleft};
	var pright = {x: vec.y * this.width / 2 + vec.x * vright,
		      y: -vec.x * this.width / 2 + vec.y * vright};
	this.angle += Math.atan(tangent);
	this.pos.x -= (pleft.x + pright.x) / 2;
	this.pos.y -= (pleft.y + pright.y) / 2;
	// This is the border algorithm.
	if (this.pos.x > this.limx.max) {
	    this.pos.x = this.limx.min;
	} else if (this.pos.x < this.limx.min) {
	    this.pos.x = this.limx.max;
	}
	if (this.pos.y > this.limy.max) {
	    this.pos.y = this.limy.min;
	} else if (this.pos.y < this.limy.min) {
	    this.pos.y = this.limy.max;
	}
    };

    this.draw = function(){
	// this.ctx.clearRect(0,0, this.canvas.width,
	// this.canvas.height);
	this.ctx.clearRect(-2,-2, this.width+ 4, this.height +4);
	this.ctx.restore();
	var x = (this.canvas.width) / 2 + this.pos.x ;
	var y = (this.canvas.height) / 2 + this.pos.y ;
	this.ctx.save();
	this.ctx.translate(x, y);
	this.ctx.rotate(this.angle-Math.PI/2);
	this.ctx.translate(-this.width / 2, -this.height / 2);
	// this.ctx.fillRect(0,0, this.width, this.height);
	this.ctx.drawImage(img, 0,0, this.width, this.height);
    };

    this.update = function(msg) {
	var params = msg.split('V')[1].split('Y');
	this.speed = parseInt(params[0]);
	this.yaw = parseInt(params[1]);
    };
}

