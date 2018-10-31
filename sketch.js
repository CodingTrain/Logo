let editor;
let turtle;
let turtled_image;

/**
 * getRandomExample() fetches random code example.
 * Returns code string as a promise. 
 */
function getRandomExample() { 
  const user = 'fabritsius';
  const repo = 'shiffmans-code-editor';
  const base_uri = `https://api.github.com/repos/${user}/${repo}/contents`;
  // get a list of examples (returns a promise)
  return fetch(`${base_uri}/examples`).then((response) => {
    return response.json();
  }).then((files) => {
    let attempts = 0;
    let random_example;
    // try 10 times to get an index which isn't a README file
    while (!random_example && attempts < 10) {
      const random_idx = int(random(files.length));
      // pick this example if it has proper extension
      if (files[random_idx].name.endsWith('.logocode')) {
        random_example = files[random_idx];
      }
      attempts++;
    } 
    // get content of a randomly chosen example (returns a promise)
    return fetch(`${base_uri}/${random_example.path}`).then((response) => {
      return response.json();
    }).then((file) => {
      // return converted (from base64) content
      return atob(file.content);
    });
  });
}

/**
 * p5 setup() function
 */
function setup() {
  turtled_image = createCanvas(400, 400).parent('logo');
  angleMode(DEGREES);
  background(0);
  turtle = new Turtle(width/2, height/2, 0);
  editor = select('#code');
  // load a random example from ./examples
  getRandomExample().then((example) => {
    editor.value(example);
    goTurtle();
  });
  editor.input(goTurtle);
}

/**
 * goTurtle() initiates the turtle movement.
 */
function goTurtle() {
  background(0);
  push();
  
  turtle.reset();
  let code = editor.value();
  // remove new lines and convert code into an array of tokens
  let tokens = code.replace(/(?:\r\n|\r|\n)/g, ' ').split(' ');
  // recursively draw the path from tokens
  reTurtle(tokens);
  
  pop();
}

/**
 * reTurtle(tokens [, start]) gives a command to a turtle.
 * Returns an index at which this instanse of the function finished.
 */
function reTurtle(tokens, start = 0) {
  let index = start;
  while (index < tokens.length) {
    let token = tokens[index];
    // check if this token is the first item in a loop (repeat)
    if (index == start && token.charAt(0) === '[') {
      token = token.slice(1);
    }
    // handle 'save' command
    if (token === 'save') {
      const file_name = 'turtled_image';
      saveCanvas(turtled_image, file_name, 'png');
    // handle 'bckgr' which is used to change background
    } else if (token === 'bckgr') {
      const color = tokens[++index];
      background(color);
    // handle 'repeat' (loop) command
    } else if (token === 'repeat') {
      const times = parseInt(tokens[++index]);
      if (tokens[index + 1] && tokens[index + 1].charAt(0) === '[') {
        const repeat_start = ++index;
        for (let i = 0; i < times; i++) {
          // start another reTurtle for every (inner) loop
          index = reTurtle(tokens, repeat_start);
        }
      }
    } else if (index < tokens.length) {
      // check if this token is the last item in a loop (repeat)
      if (token.charAt(token.length - 1) === ']') {
        token = token.slice(0, -1);
        handleCommand(token, index, tokens);
        // return an index (used for nested loops)
        return index;
      } else {
        handleCommand(token, index, tokens);
      }
    }
    index++;
  }
}

/**
 * handleCommand(token, index, tokens)
 * 1. analyzes a token;
 * 2. gives turtle a command.
 */
function handleCommand(token, index, tokens) {
  if (token in commands) {
    if (token.charAt(0) === 'p') {
      // give command to a turtle
      commands[token]();
    } else {
      // check if aguments might be in array
      if (index + 1 < tokens.length) {
        arg = tokens[index + 1];
        if (arg.charAt(arg.length - 1) === ']') {
          arg = arg.slice(0, -1);
        }
        // give command to a turtle
        commands[token](arg);
      }
    }
  }
}