// Coding Challenge 121: Logo
// https://youtu.be/i-k04yzfMpw

let editor;
let turtle;
let xOffset = 0;
let yOffset = 0;
let startX = 100;
let startY = 100;

function setup() {
  createCanvas(200, 200);
  angleMode(DEGREES);
  background(0);
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

function createTextArea() {
  editor = createElement("textarea");
  editor.elt.placeholder = "hint text";
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