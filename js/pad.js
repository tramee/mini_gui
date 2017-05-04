// Define some global variables.

var mousePressed = false;
var msgs = [' ', 'Messages to mini.'];
var max_msgs = 10;
var pan = 0;
var tilt = 0;
var inc = 0.5
var pan_tilt_limit = 100;
var speed = 0;
var yaw = 0;
var loop = null;
var refresh = false;
var refresh_rate = 150;		// Every 66ms.
var event_list = {};

// Constrain a variable to a certain limit
function constrain(x, a, b){
    if (x < a) {
	return a;
    } else if (x > b) {
	return b;
    } else {
	return x;
    }
}

// Write the messages in the message canvas and 
function writeMessage(elt, txt = null){
    if (refresh) {
	tilt = Math.round(constrain(tilt, -pan_tilt_limit, pan_tilt_limit));
	pan = Math.round(constrain(pan, -pan_tilt_limit, pan_tilt_limit));
	if (txt === null) {
	    txt = 'P' + pan + 'T' + tilt + 'V' + speed + 'Y' + yaw;
	    robot.update(txt);
	}
	msgs.push(txt);
	while (msgs.length > max_msgs) {
	    msgs.shift();
	}
	elt.innerHTML = ''
	for (var i = 0; i < msgs.length; i++) {
	    elt.innerHTML += msgs[i] + '<br>'
	}
	refresh = false;
    }
}

function mouseTracker(cnvs, evt) {
    // console.log(cnvs)
    if (mousePressed) {
	var pos = evt;
	if (mobile) {
	    pos = evt.touches[0];
	}
	var bound = cnvs.getBoundingClientRect();
	var x = Math.round(pos.clientX - (bound.left + bound.right) / 2);
	var y = Math.round((bound.top + bound.bottom) / 2 - pos.clientY);
	return {
	    x: x, y: y
	};
    }
    else return false;
}

function keyMapper(evt) {
    if (evt.keyCode === 87) {	// W key
	tilt+=inc;
	return true;
    }
    if (evt.keyCode === 88) {	// X key
	tilt-=inc;
	return true;
    }
    if (evt.keyCode === 83) {	// S key
	pan = 0;
	tilt= -50;
	return true;
    }
    if (evt.keyCode === 65) {	// A key
	pan +=inc;
	return true;
    }
    if (evt.keyCode === 68) {	// D key
	pan -=inc;
	return true;
    }
    return false;
}

var tgt = document.getElementById('target');
var output = document.getElementById('messages');
var board = document.getElementById('board');
var robot = new Bot(board);

function setup(){
    loop = setInterval(function(){
	refresh = true;
    }, refresh_rate)
    robot.start();
}

// First test is the site is mobile
var mobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
if (mobile) {
    event_list.move = 'touchmove';
    event_list.down = 'touchstart';
    event_list.up = 'touchend';
    max_msgs = 9;
} else {
    event_list.move = 'mousemove';
    event_list.down = 'mousedown';
    event_list.up = 'mouseup'
}

tgt.addEventListener(event_list.move, function(evt){
    var pos = mouseTracker(tgt, evt);
    if (mobile) {
	yaw = pos.x;
	speed = pos.y;
	writeMessage(output); //, 'Event y:' + pos.y);
    } else {
	if (pos){
	    yaw = pos.x;
	    speed = pos.y;
	    writeMessage(output);
	    // console.log(pos);
	}
    }
    evt.preventDefault();
}, false);

tgt.addEventListener('keydown', function(evt){
    var status = keyMapper(evt);
    if (status) {
	writeMessage(output)
    }
}, false);

tgt.addEventListener(event_list.down, function(evt){
    mousePressed = true;
    tgt.style.cursor='crosshair';
    var pos = mouseTracker(tgt, evt);
    if (mobile) {
	yaw = pos.x;
	speed = pos.y;
	writeMessage(output); //, 'Event y:' + pos.y);
    } else {
	if (pos){
	    yaw = pos.x;
	    speed = pos.y;
	    writeMessage(output);
	    // console.log(pos);
	}
    }
}, false);

tgt.addEventListener(event_list.up, function(){
    mousePressed = false;
    speed = 0;
    yaw = 0;
    refresh = true;
    writeMessage(output);
    tgt.style.cursor='default';
}, false);
