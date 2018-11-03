let editor;
let turtle;

function setup() {
    createCanvas(200, 200);
    angleMode(DEGREES);

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
    let index = 0;

    while (index < tokens.length) {
        let token = tokens[index++];

        if (commandsOneArg[token]) {
            commandsOneArg[token](tokens[index++]);
        } else if (commandsNoArgs[token]) {
            commandsNoArgs[token]();
        }
    }

    pop();
}
