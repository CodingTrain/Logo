let editor;
let turtle;

function setup() {
  createCanvas(400, 400).parent('logo');
  angleMode(DEGREES);
  background(0);
  turtle = new Turtle(width/2, height/2, 0);
  editor = select('#code');
  editor.input(goTurtle);
  goTurtle();
}

function HandleCommand(token, index, tokens) {
  if (token in commands) {
    if (token.charAt(0) === 'p') {
      // give command to a turtle
      commands[token]();
    } else {
      // check if aguments might be in array
      if (index + 1 < tokens.length) {
        arg = tokens[index + 1];
        // check if argument is the last item in a loop
        if (arg.charAt(arg.length - 1) === ']') {
          arg = arg.slice(0, -1);
        }
        // give command to a turtle
        commands[token](arg);
      }
    }
  }
}


function goTurtle() {
  background(0);
  push();
  turtle.reset();
  let code = editor.value();
  // remove new lines and convert code into an array of tokens
  let tokens = code.replace(/(?:\r\n|\r|\n)/g, ' ').split(' ');
  let index = 0;
  // handle all tokens
  while (index < tokens.length) {
    let token = tokens[index];
    // handle repeat (loop)
    if (token === 'repeat') {
      times = parseInt(tokens[++index]);
      if (tokens[index + 1].charAt(0) === '[') {
        // store start position of a loop
        start = ++index;
        for (let i = 0; i < times; i++) {
          token = tokens[start].slice(1);
          while (true) {
            // check token is the last item in a loop (repeat)
            if (index >= tokens.length || token.charAt(token.length - 1) === ']') {
              // if not the last time looping 
              if (i < times - 1) {
                // reset index to the loop's start position
                index = start;
              }
              break;
            // if not the last token in a repeat
            } else {
              HandleCommand(token, index, tokens);
              token = tokens[++index];
            }
          }         
        }
      }
    // handle every other command (not repeat)
    } else if (index < tokens.length) {
      HandleCommand(token, index, tokens);
    }
    index++;
  }
  pop();
}