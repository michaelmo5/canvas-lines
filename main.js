const PI = Math.PI;
const canvas = document.querySelector('#mainCanvas');
const ctx = canvas.getContext("2d");

var resolution = {x: 1920, y: 1080};

function clear(){
	ctx.fillStyle = "#F0F0F0";
	ctx.fillRect(0, 0, resolution.x, resolution.y);
}

function resizeCanvas() {
	canvas.width = resolution.x = window.innerWidth;
	canvas.height = resolution.y =  window.innerHeight;
}

window.addEventListener('resize', function(){
	resizeCanvas();
});

const GBLO_SPEED = 10;
const POINTS_COUNT = 200;
const RADIUS = 1;
const LINE_DISTANCE = 150;

class Point {
	constructor(_id) {
		this.x = Math.random() * resolution.x;
		this.y = Math.random() * resolution.y;
		this.radius = RADIUS;
		this.speed = GBLO_SPEED;
		this.direction = Math.random() * 2 * PI;
		this.color = '#333333';
		this.id = _id;
	}

	update(deltaTime) {
		this.x += this.speed * deltaTime * Math.cos(this.direction);
		this.y += this.speed * deltaTime * Math.sin(this.direction);

		if(this.x >= resolution.x) { this.x = 0; }
		if(this.x <= 0) { this.x = resolution.x; }

		if(this.y >= resolution.y) { this.y = 0; }
		if(this.y <= 0) { this.y = resolution.y; }
	}
	
	render() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2*PI);
		ctx.fillStyle = this.color;
		ctx.fill();

		POINTS.forEach((p) => {
			if(this.id != p.id){
				let distance = Math.sqrt( Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2) );

				if(distance < LINE_DISTANCE){
					ctx.beginPath();
					ctx.moveTo(this.x, this.y);
					ctx.lineTo(p.x, p.y);
					ctx.lineWidth = 0.3;
					ctx.stroke();
				}
			}
		});
	}
}

var POINTS = [];

function setup(){
	for(let i = 0; i<POINTS_COUNT; i++){
		POINTS.push(new Point(i));
	}
}

function update(deltaTime){
	POINTS.forEach((p) => {
		p.update(deltaTime);
	});
}

function render(){
	clear();
	POINTS.forEach((p) => {
		p.render();
	});
}

const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

var then = performance.now();
var mainLoop = function () {
	var now = performance.now();
	var delta = now - then;
	update(delta / 1000);
	render();
	then = now;
	requestAnimationFrame(mainLoop);	
}

document.addEventListener('DOMContentLoaded', function(){
    resizeCanvas();
    clear();
    setup();
    mainLoop();
});
