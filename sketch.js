let editor;
let turtle;

function setup() {
	createCanvas(600, 600);
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
	let tokens = code.split(/\b/) // Split on word boundary
		.map(str => str.trim()) // Trim whitespace
		.filter(str => str !== ''); // Remove empty strings

	// Default stack item, the entire expression is always at the bottom of the stack
	let stack = [{
		iter: 1,
		tokens: []
	}];

	while (tokens.length) {
		token = tokens.shift(); // Consume a token from the stream
		stack[stack.length - 1].tokens.push(token); // Every token must be recorded to the sequence at the top of the stack

		if (token === ']') { // The end of a sequence (unless it needs repeating)
			if (--stack[stack.length - 1].iter) { // If we still have repetitions remaining for this sequence
				tokens = stack[stack.length - 1].tokens.concat(tokens); // Prepend the commands we are repeating to the token stream
				stack[stack.length - 1].tokens = []; // Clear the sequence at the top of the stack (necessary because repeated tokens are added to the stack as normal and don't want duplicates)
			} else {
				// Prepend the finished sequence to it's parent sequence
				stack[stack.length - 2].tokens = stack[stack.length - 2].tokens.concat(stack.pop().tokens);
			}
		} else if (token === '[') { // The beginning of a sequence
			const stackTop = stack[stack.length - 1]; // The sequence at the stop of the stack

			const sequence = {
				iter: 1, // By default a sequence of tokens is executed exactly once
				tokens: []
			};

			// If this sequence should be repeated
			if (stackTop.tokens[stackTop.tokens.length - 3] === 'repeat') {
				sequence.iter = Number(stackTop.tokens[stackTop.tokens.length - 2]);
			}
			stack.push(sequence);
		} else if (commands.hasOwnProperty(token)) { // If this is a valid command to a turtle
			let cmd = commands[token];
			if (token.charAt(0) === 'p') {
				cmd();
			} else {
				token = tokens.shift(); // Consume the token that is the argument to the command
				stack[stack.length - 1].tokens.push(token); // Every token must be recorded to the sequence at the top of the stack
				cmd(Number(token));
			}
		}
	}
	pop();
}