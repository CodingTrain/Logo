// Coding Challenge 121: Logo
// https://youtu.be/i-k04yzfMpw

let editor;
let turtle;
let xOffset = 0;
let yOffset = 0;
let startX = 100;
let startY = 100;
let allCases;

function preload() {
  loadJSON("./assets/tests.json", createTestDataView);
}

function setup() {
  createCanvas(200, 200);
  angleMode(DEGREES);
  background(0);

  startX = width/2;
  startY = height/2;
  editor = select("#code");
  editor.input(goTurtle);
  goTurtle();
}

function execute(commands, repcount) {
  for (let command of commands) {
    let name = command.name;
    let arg = command.arg;
    if (name === "repeat") {
      for (let i = 0; i < arg; i++) {
        execute(command.commands, i);
      }
    } else {
      if (arg == "repcount" && repcount) {
        commandLookUp[name](repcount);
      } else {
        if (arg instanceof Array) {
          commandLookUp[name](...arg);
        } else {
          commandLookUp[name](arg);
        }
      }
    }
  }
}

function goTurtle() {
  console.log({startX:startX,startY:startY});
  turtle = new Turtle(startX, startY, 0);
  background(0);
  push();
  turtle.reset();
  let code = editor.value();
  let parser = new Parser(code);
  let commands = parser.parse();
  console.log(commands);
  execute(commands);
  pop();
}

function createTestDataView(cases) {
  let selector = select("#testdata");
  allCases = cases;

  selector.option("Select Test Data", -1);

  for (i = 0; i < cases.length; i++) {
    selector.option(cases[i].name, i);
  }

  // because why not do it here
  selector.changed(function() {
    let val = parseInt(selector.value());
    if (val < 0) {
      resizeCanvas(200, 200);
      turtle.strokeColor = 255;
      turtle.dir = 0;
      turtle.x = width / 2;
      turtle.y = height / 2;

      return;
    }

    editor.value(allCases[val].code);
    if(allCases[val].width && allCases[val].height) {
      resizeCanvas(allCases[val].width, allCases[val].height);
    } else {
      resizeCanvas(200, 200);
    }

    turtle.strokeColor = 255;
    turtle.dir = 0;
    turtle.x = width / 2;
    turtle.y = height / 2;

    goTurtle();
  });
}

function mousePressed() {
  xOffset = mouseX-startX; 
  yOffset = mouseY-startX; 
}

function mouseDragged() {
    startX = mouseX-xOffset; 
    startY = mouseY-yOffset; 
    goTurtle();
}
