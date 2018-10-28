let editor;
let turtle;

function setup() {
	createCanvas(840, 760);
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

	// Create a new stream and pass it the Logo code
	const stream = new Stream(editor.value());

	let stack = []; // Store block scopes
	repeatCount = 1; // Store the repeat count of the last 'repeat' command encountered

	// Loop until we reach the end of the stream
  while (!stream.endOfStream()) {
    // Get the next token
		const token = stream.readToken();
		if (token === '[') { // Push a new scope to the stack
			stack.push({
				repeatCount,
				startPosition: stream.getPosition()
			});
		} else if (token === ']') { // Jump back to the start of the current scope, or pop it from the stack
			if (stack.length) { // Let the user type a closing brace first without breaking
				let stackTop = stack[stack.length - 1];
				if (--stackTop.repeatCount) { // Decrement the repeat count and check it's not zero
					stream.seekPosition(stackTop.startPosition);
				} else { // If repeatCount is zero
					stack.pop();
				}
			}
		} else if (token === 'repeat') {
			// How many times to repeat the next code block we find
			repeatCount = stream.readNumber();
		} else if (commands.hasOwnProperty(token)) { // If this is a valid turtle command
			let cmd = commands[token];
			if (token.charAt(0) === 'p') {
				cmd();
			} else {
				cmd(stream.readNumber());
			}
		}
	}
	pop();
}