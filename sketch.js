let editor;
let turtle;
let button;

function setup() {
	createCanvas(200, 200);
	angleMode(DEGREES);
	background(0);
	turtle = new Turtle(100, 100, 0);
	editor = select('#code');
	button = createButton("submit");
	button.mousePressed(goTurtle);
	goTurtle();
}

function lookForReapeat(val){
	let found = false;
	let repeats = [];
	let working = "";
	for (let i = 0; i < val.length; i++){
		if (val[i].includes("[")){
			found = true;
			working += val[i] + " ";
			continue;
		}
		if (val[i].includes("]")){
			working += val[i] + " ";
			repeats.push(working);
			working = "";
			found = false;
			continue;
		}
		if (found){
			working += val[i] + " ";
		}
	
	}
	return repeats;
}

function goTurtle() {
	background(0);
	push();
	turtle.reset();
	let code = editor.value();///["["\s]+/
	let tokens = code.split(" ");
	let repeats = lookForReapeat(tokens);
	let index = 0;
	let count = 0;
	while (index < tokens.length) {
		let token = tokens[index];
		if (commands[token]) {
			if (token.charAt(0) === 'p') {
				commands[token]();
			} else if (token.charAt(0) === 'r'){
					commands[token](tokens[++index], repeats[count]);
					count++;
				} else {
				commands[token](tokens[++index]);
			}
		}
		index++;
	}
	console.log(count);
	console.table(repeats);
	pop();
}
