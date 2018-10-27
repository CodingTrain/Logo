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
	let tokens = [];
  	parseCode(code, tokens);
	let index = 0;
	while (index < tokens.length) {
		let token = tokens[index];
		if (commands[token]) {
			if (token.charAt(0) === 'p') {
				commands[token]();
			} else {
				commands[token](tokens[++index]);
			}
		}
		index++;
	}
	pop();
}
