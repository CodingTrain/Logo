let editor;
let turtle;

function setup() {
	createCanvas(400, 400);
	angleMode(DEGREES);
	turtle = new Turtle(200, 200);
	editor = select('#code');
	editor.input(main);
	main();
}

function main() {
	console.clear();
	push();
	background(51);
	turtle.reset();
	const rawCode = editor.value();
	let stack = LogoParser.parse(rawCode);
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