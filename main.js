let editor;
let turtle;
let turtle_icon;
let _body;

function preload() {
	turtle_icon = loadImage("turtle.png");
}

function setup() {
	createCanvas(windowWidth, 400);
	angleMode(DEGREES);
	_body = select("#body");
	console.log(_body);
	turtle = new Turtle(0, 0, -90, turtle_icon);
	editor = select('#code');
	editor.input(goTurtle);
	goTurtle();
}

function goTurtle() {
	style();
	push();
	translate(width/2, height/2);
	turtle.reset();
	let code = editor.value().toLowerCase(); // LOGO is not case sensitive
	let tokens = parse(code);
	console.log(code);
	console.table(tokens);
	execute(tokens);
	turtle.display();
	pop();
}

function style() {
	background(instance_variables.background);
	_body.style("background", instance_variables.background);
	editor.style("background", instance_variables.background);
	editor.style("color", instance_variables.pencolor);
}