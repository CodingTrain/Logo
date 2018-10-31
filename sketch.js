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
    while (!random_example & attempts < 10) {
      const random_idx = int(random(files.length));
      // pick this example if it has proper extension
      if (files[random_idx].name.endsWith('.shffman')) {
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
 * p5 setup()
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
 * handleCommand()
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

/**
 * goTurtle() gives a command to a turtle.
 */
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
    // handle save command (use it carefully or don't use it)
    if (token === 'save') {
    	const file_name = 'turtled_image';
    	saveCanvas(turtled_image, file_name, 'png');
	// handle background selection
	} else if (token == 'bckgr') {
		const color = tokens[++index];
		background(color);
    // handle repeat (loop)
    } else if (token === 'repeat') {
      times = parseInt(tokens[++index]);
      if (tokens[index + 1].charAt(0) === '[') {
        // store start position of a loop
        let start = ++index;
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
              handleCommand(token, index, tokens);
              token = tokens[++index];
            }
          }         
        }
      }
    // handle every other command (not repeat)
    } else if (index < tokens.length) {
      handleCommand(token, index, tokens);
    }
    index++;
  }
  pop();
}