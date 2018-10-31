let editor;
let turtle;

function setup() {
	createCanvas(400, 400);
	angleMode(DEGREES);
	turtle = new Turtle(200, 200);
	editor = select('#code');
	editor.input(handleInput);
	handleInput();
}

function handleInput() {
	push();
	background(51);
	turtle.reset();
	const stack = parse(editor.value(), [parseRepeats]);
	execStack(stack);
	turtle.draw();
	pop();
}

function execCommand(command, stack) {
	if (commands[command]) {
		commands[command](stack);
	} else {
		console.warn('Unknown command: "' + command + '"');
	}
}

function execStack(stack) {
	while(stack.length > 0) {
		const command = stack.shift();
		execCommand(command, stack);
	}
}

function parse(code, funcs) {
	funcs.forEach(func => {
		code = func(code);
	});
	return code.trim().split(/\s+/);
}

function parseRepeats(code) {
	const newCode = code.replace(/repeat\s+(\d+)\s+\[([\w\d\s]*)?\](?!.*repeat\s+\d+\s+\[[\w\d\s]*?\])/, (_, times, funcs) => {
		return (' ' + funcs + ' ').repeat(parseInt(times));
	});
	return newCode === code ? newCode : this.parseRepeats(newCode);
}