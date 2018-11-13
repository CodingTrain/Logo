// Coding Challenge 121: Logo
// https://youtu.be/i-k04yzfMpw

let canvas;
let editor;
let turtle;
let recentreBtn;
let bgcolorBtn;

let dragStartMousePos = new p5.Vector();
let dragStartCanvasOffset = new p5.Vector();
let xOffset = 0;
let yOffset = 0;
let allCases;
let bgcolor = "#6040e6";

// Used for scaling drawings to fit the canvas
let canvasScrollX = 0;
let canvasScrollY = 0;
let canvasScaleX = 1;
let canvasScaleY = 1;
let drawingBounds = new BoundingBox();
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
    dragStartMousePos = new p5.Vector(mouseX, mouseY);
    dragStartCanvasOffset = new p5.Vector(canvasScrollX, canvasScrollY);
  });

  canvas.mouseMoved(function () {
    if (mouseIsPressed) {
      canvasScrollX = dragStartCanvasOffset.x + dragStartMousePos.x - mouseX;
      canvasScrollY = dragStartCanvasOffset.y + dragStartMousePos.y - mouseY;
      goTurtle();
    }
  });

  recentreBtn = document.querySelector("#recentre");
  bgcolorBtn = document.querySelector("#bgcolor");

  recentreBtn.onclick = function () {
    scaleToFitBoundingBox(drawingBounds);
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

  editor = select("#code");
  editor.input(goTurtle);
  scaleToFitBoundingBox(drawingBounds); // This also redraws (it has to in order to measure the size of the drawing)
}

function scaleToFitBoundingBox(boundingBox) {
  goTurtle();

  let scale = Math.min((width - drawingPadding) / (boundingBox.width), (height - drawingPadding) / (boundingBox.height));
  canvasScaleX = canvasScaleY = scale;
  canvasScrollX = (drawingBounds.x * scale - width * .5);
  canvasScrollY = (drawingBounds.y * scale - height * .5);
  goTurtle();
}

function afterCommandExecuted() {
  if (turtle.pen) {
    drawingBounds.includePoint(turtle.x, turtle.y);
  }
}

function goTurtle() {
  turtle = new Turtle(0, 0, 0);
  drawingBounds.reset();
  drawingBounds.move(turtle.x, turtle.y);
  background(bgcolor);

  push();
  translate(-canvasScrollX, -canvasScrollY);
  scale(canvasScaleX, canvasScaleY);

  push();
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

  selector.option("Logo Default", -1);

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
      xOffset = 0;
      yOffset = 0;
      canvasScrollX = 0;
      canvasScrollY = 0;
      canvasScaleX = 1;
      canvasScaleY = 1;

      goTurtle();
      return;
    }

    editor.value(allCases[val].code);

    turtle.strokeColor = 255;
    turtle.dir = 0;
    turtle.x = width / 2;
    turtle.y = height / 2;

    canvasScrollX = canvasScrollY = 0;
    scaleToFitBoundingBox(drawingBounds);
  });
}
