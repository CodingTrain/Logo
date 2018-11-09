// Coding Challenge 121: Logo
// https://youtu.be/i-k04yzfMpw

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
	let parser = new Parser(code);
	let commands = parser.parse();
	for (let cmd of commands) {
		cmd.execute();
	}
	pop();
}
