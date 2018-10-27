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

function unrollRepeats(oldCode) {
	function regexRepeater(_, p1, p2) {
		return (p2 + ' ').repeat(p1);
	};
	// this regex finds "repeat (number) [(string)]" where string doesn't contain [ or ]
	// only the innermost nesting gets unrolled on each pass through
	const newCode = oldCode.replace(/repeat\s(\d+)\s\[([^\]\[]+)\]/gmi, regexRepeater);
	// if it hasn't changed any text return it, but if some text has been replaced
	// call the function again to make sure there isn't another outer level to unroll
	return oldCode === newCode ? oldCode : unrollRepeats(newCode);
}

function goTurtle() {
	background(0);
	push();
	turtle.reset();
	let code = editor.value();
	code = unrollRepeats(code);
	let tokens = code.split(/\s/);
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
