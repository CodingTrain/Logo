let editor;
let turtle;
let button;

function setup() {
	createCanvas(200, 200);
	angleMode(DEGREES);
	background(0);
	turtle = new Turtle(100, 100, 0);
    editor = select('#code');
    button = createButton('draw a train');
    button.mousePressed(drawATrain);
    editor.input(goTurtle);
	goTurtle();
}

function drawATrain() {
    document.getElementById("code").innerHTML = "pu fd 80 rt 90 fd 70 pd repeat 360 [fd 0.4 rt 1] pu rt 90 fd 40 rt 90 pd repeat 360 [fd 0.3 rt 1] pu fd 5 rt 90 fd 17 pd repeat 360 [fd 0.1 rt 1] pu fd 23 pd fd 8 lt 90 repeat 90 [fd 0.1, lt 0.1] repeat 90 [fd 0.8, rt 0.2] lt 99 fd 62 lt 90 repeat 90 [fd 0.1, lt 0.1] repeat 90 [fd 0.8, rt 0.2] lt 99 fd 8 pu bd 13 pd bd 70 lt 90 repeat 90 [fd 0.1, rt 0.1] repeat 90 [fd 0.3, lt 0.4] lt 63 bd 70 lt 90 repeat 90 [fd 0.1, rt 0.1] repeat 90 [fd 0.3, lt 0.4] pu lt 63 bd 75 pd lt 90 repeat 90 [fd 0.1, lt 0.1] repeat 90 [fd 0.3, rt 0.2] pu lt 11 bd 20 pd rt 45 bd 50 rt 50 fd 30 lt 80 fd 30 lt 20 fd 10 pu fd 15 rt 90 bd 3 pd repeat 360 [fd 0.09 rt 1] pu lt 85 fd 4 rt 90 fd 30 pd lt 90 fd 30 rt 92 fd 20 lt 92 bd 30 pu fd 30 pd rt 92 fd 7 lt 92 fd 27 lt 88 fd 34 lt 92 fd 27 lt 88 fd 7 pu fd 70 lt 92 fd 7 pu bd 80 lt 115 fd 40 pd repeat 360 [fd 0.2 rt 1] pu rt 90 fd 38 rt 90  bd 30 pd repeat 360 [fd 0.2 rt 1]";
    goTurtle();
}

function RemoveLastLineFromTextArea(text)
{
	if (text.lastIndexOf("\n") > 0) {
    		return text.substring(0, text.lastIndexOf("\n"));
	} else {
    		return text;
	}
}

function goTurtle() {
	background(0);
	push();
	turtle.reset();
	let code = editor.value();
	code = RemoveLastLineFromTextArea(code);
	let tokens = code.split(' ');
	let index = 0;
	while (index < tokens.length) {
        let token = tokens[index];
		if (commands[token]) {
            if (token.charAt(0) === 'p') {
                commands[token]();
            } else if (token.includes("train")) {

            } else if (token.includes("repeat")) {
				var cmd = "";
				var currIndex;
				for (var i = index + 2; i < tokens.length; i++)
				{
					cmd = cmd + " " + tokens[i];
					var lastChar = tokens[i].slice(-1);
					if (lastChar === "]") {
						currIndex = i;
						break;
					}
				}
				commands[token](tokens[++index], cmd.split(' ').splice(1));
				index = currIndex;
			} else {
				commands[token](tokens[++index]);
			}
		}
		index++;
	}
	pop();
}