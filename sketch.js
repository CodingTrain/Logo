// Coding Challenge 121: Logo
// https://youtu.be/i-k04yzfMpw

let canvas;
let editor;
let turtle;
let recentreBtn;
let bgcolorBtn;

let xOffset = 0;
let yOffset = 0;
let startX = 100;
let startY = 100;
let allCases;
let bgcolor = "#6040e6";

// Used for scaling drawings to fit the canvas
let canvasScrollX = 0;
let canvasScrollY = 0;
let canvasScaleX = 1;
let canvasScaleY = 1;
let drawing_bounds = new BoundingBox();
let drawingPadding = 50; // Padding round the edge of the drawing when autofit

function preload() {
  loadJSON("./assets/tests.json", createTestDataView);
}

function setup() {
  canvas = createCanvas(windowWidth - 10, windowHeight - 220);
  div = document.querySelector("#logo-canvas");

	div.appendChild(canvas.elt);

  angleMode(DEGREES);
  background(bgcolor);
  
  canvas.mousePressed(function () {
    xOffset = mouseX-startX;
    yOffset = mouseY-startY;
  });

  recentreBtn = document.querySelector("#recentre");
  bgcolorBtn = document.querySelector("#bgcolor");

  recentreBtn.onclick = function () {
    startX = width/2;
    startY = height/2;
    goTurtle();
  }

  bgcolorBtn.onclick = function () {
    let r = floor(random(0, 255));
    let g = floor(random(0, 255));
    let b = floor(random(0, 255));

    let col = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    bgcolor = col;
    goTurtle();

    console.log(bgcolor);
  }

  startX = width/2;
  startY = height/2;
  editor = select("#code");
  editor.input(goTurtle);
  goTurtle();
}

function mouseDragged() {
  startX = mouseX-xOffset;
  startY = mouseY-yOffset;
  goTurtle();
}
  
function scaleToFitBoundingBox(boundingBox) {
  startX = 0;
  startY = 0;
  goTurtle();

  let scale = Math.min((width - drawingPadding) / (boundingBox.width), (height - drawingPadding) / (boundingBox.height));
  canvasScaleX = canvasScaleY = scale;
  canvasScrollX = (drawing_bounds.x * scale - width * .5);
  canvasScrollY = (drawing_bounds.y * scale - height * .5);
  goTurtle();
}

function afterCommandExecuted() {
  if (turtle.pen) {
    drawing_bounds.includePoint(turtle.x, turtle.y);
  }
}

function goTurtle() {
  console.log({startX:startX,startY:startY});
  turtle = new Turtle(startX / canvasScaleX, startY / canvasScaleY, 0);
  drawing_bounds.reset();
  drawing_bounds.move(turtle.x, turtle.y);
  background(bgcolor);

  push();
  translate(-canvasScrollX, -canvasScrollY);

  push();
  scale(canvasScaleX, canvasScaleY);
  turtle.reset();
  let code = editor.value();
  let parser = new Parser(code, afterCommandExecuted);
  let commands = parser.parse();
  for (let cmd of commands) {
    cmd.execute();
  }
  pop();

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
      turtle.strokeColor = 255;
      turtle.dir = 0;
      turtle.x = width / 2;
      turtle.y = height / 2;

      return;
    }

    editor.value(allCases[val].code);

    turtle.strokeColor = 255;
    turtle.dir = 0;
    turtle.x = width / 2;
    turtle.y = height / 2;

    canvasScrollX = canvasScrollY = 0;
    scaleToFitBoundingBox(drawing_bounds);
  });
}
