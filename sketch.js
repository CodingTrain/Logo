let editor;
let turtle;

function setup() {
	createCanvas(200, 200);
	angleMode(DEGREES);
	background(0);
	turtle = new Turtle(100, 100, 0);
	editor = select('#code');
	editor.input(goTurtle);
	goTurtle();
}

function goTurtle() {
	background(0);

	push();
	
	turtle.reset();
	let code = editor.value();
	let tokens = code.split(' ');

	// Extract the runnin process to a function.
	// A need it later for repeat.
	runcommands(tokens);
	
	pop();
}