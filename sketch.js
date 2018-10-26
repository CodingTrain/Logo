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
    code = preprocess(code);
    let tokens = code.split(/\s+/);
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

function preprocess(str) {

    // don't try and parse this if brackets mismatch
    if (bracketsMismatch(str)) {
        return str;
    }

    // loop until there are no repeat commands left
    while (/repeat/.test(str)) {

        // find first instance of repeat command
        let match = str.match(/repeat (\d+) \[/);
        if (!match) {
            break;
        }
        let indexAfterOpeningBracket = match.index + match[0].length;
        let numRepeats = match[1];

        // get the content of its brackets (accounting for nested brackets)
        brackets = 1;
        bracketsContent = '';
        for (let i = indexAfterOpeningBracket; i < str.length; i++) {
            let c = str[i];
            if (c === '[') {
                brackets++;
            }
            if (c === ']') {
                brackets--;
            }
            if (brackets === 0) {
                break;
            }
            bracketsContent += c;
        }

        // expand the brackets content
        let newCommand = (bracketsContent + ' ').repeat(numRepeats);

        // replace the repeat command with the new content
        let oldCommand = `repeat ${numRepeats} [${bracketsContent}]`;
        str = str.replace(oldCommand, newCommand);

    }
    return str;

}

function bracketsMismatch(str) {

    let brackets = 0;
    for (let c of str) {
        if (c === '[') {
            brackets++;
        }
        if (c === ']') {
            brackets--;
        }
    }
    return brackets !== 0;

}