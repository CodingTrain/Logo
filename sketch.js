// Coding Challenge 121: Logo
// https://youtu.be/i-k04yzfMpw

let canvas;
let editor;
let editor_bg;
let turtle;
let recentreBtn;
let bgcolorBtn;

let dragStartMousePos = new p5.Vector();
let dragStartCanvasOffset = new p5.Vector();
let allCases;
let bgcolor = "#6040e6";

let resizingEditor = false;

// Used for scaling drawings to fit the canvas
let canvasScrollX = 0;
let canvasScrollY = 0;
let canvasScaleX = 1;
let canvasScaleY = 1;
let drawingBounds = new BoundingBox();
function showError(start,end)
{
  let text = editor.value();
  let beforeErr= text.substring(0,start);
  let afterErr = text.substring(end);
  let err = text.substring(start,end);
  let bg_text = `${beforeErr}<mark>${err}</mark>${afterErr}`;
  editor_bg.html(bg_text);
}

function preload() {
  loadJSON("./assets/tests.json", createTestDataView);
}

function getCanvasSize() {
  const bounds = select("#logo-canvas").elt.getBoundingClientRect();
  return { width: bounds.width, height: bounds.height };
}

function updateEditorOverlayMargin() {
  const editorBounds = select('#editor-container').elt.getBoundingClientRect();
  editor_bg.elt.style.right = `${editorBounds.width - editor.elt.scrollWidth - 3}px`;
}

function windowResized() {
  const canvasSize = getCanvasSize();
  resizeCanvas(canvasSize.width, canvasSize.height);
  updateResizeHandlePosition();
  scaleToFitBoundingBox(drawingBounds);
  updateEditorOverlayMargin();
}

function setup() {
  const canvasSize = getCanvasSize();
  canvas = createCanvas(canvasSize.width, canvasSize.height);
  div = document.querySelector("#logo-canvas");

  div.appendChild(canvas.elt);

  // Use a setTimeout with length 0 to call windowResized immediately after the DOM has updated (since we are dynamically injecting a canvas element)
  setTimeout(windowResized, 0);

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

    let hexR = `${r <= 15 ? '0' : ''}${r.toString(16)}`;
    let hexG = `${g <= 15 ? '0' : ''}${g.toString(16)}`;
    let hexB = `${b <= 15 ? '0' : ''}${b.toString(16)}`;

    let col = `#${hexR}${hexG}${hexB}`;
    bgcolor = col;
    goTurtle();
  }

  editor = select("#code");
  setDefaultDrawing();
  editor.input(goTurtle);
  editor_bg = select("#code_bg");
  scaleToFitBoundingBox(drawingBounds); // This also redraws (it has to in order to measure the size of the drawing)

  editor.elt.addEventListener('scroll', ev => {
    select('#code_bg').elt.scrollTop = editor.elt.scrollTop;
  }, { passive: true }); // The 'passive: true' parameter increases performance when scrolling by making it impossible to cancel the scroll events
}

function scaleToFitBoundingBox(boundingBox) {
  // Run this once first so we can measure the size of the drawing
  goTurtle();

  // 15% padding around the drawing in the canvas
  let drawingPadding = Math.min(width, height) * 0.15;
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
  editor_bg.html( editor.value());
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
  try {
    let commands = parser.parse();
    for (let cmd of commands) {
      cmd.execute();
    }
  } catch (err) {
    showError(err.startIndex,err.endIndex);
  }

  pop();

  pop();
}

/**
 * Writes the Logo code for the default drawing to the textarea
 * Called on page load
 * Also called when selecting the default item from the #testdata dropdown
 */
function setDefaultDrawing() {
  editor.value("pu lt 90 fd 100 lt 90 fd 250 rt 90 rt 90 pd fd 500 rt 90 fd 150 rt 90 fd 500 rt 90 fd 150");
}

function createTestDataView(cases) {
  let selector = select("#testdata");

  selector.option("Logo Default", -1);

  for (i = 0; i < cases.length; i++) {
    selector.option(cases[i].name, i);
  }

  // because why not do it here
  selector.changed(function () {
    let val = parseInt(selector.value());
    if (val < 0) {
      // Use the default drawing
      setDefaultDrawing();
    } else {
      // Use a drawing from tests.json
      editor.value(cases[val].code);
    }

    // Reset default parameters for turtle
    turtle.strokeColor = 255;
    turtle.dir = 0;
    turtle.x = 0;
    turtle.y = 0;

    // Reset default parameters for camera
    canvasScrollX = 0;
    canvasScrollY = 0;
    canvasScaleX = 1;
    canvasScaleY = 1;

    // Move and scale the drawing to fit on-screen
    scaleToFitBoundingBox(drawingBounds);

    updateEditorOverlayMargin()
  });
}

function updateResizeHandlePosition() {
  const resizeHandle = select('#resize-handle').elt;
  const editorBounds = select('#editor-container').elt.getBoundingClientRect();
  resizeHandle.style.top = `${editorBounds.top - 8}px`;
  resizeHandle.style.width = `${editorBounds.width}px`;
}

function updateEditorSize(mouseY) {
  const resizeHandleBounds = select('#resize-handle').elt.getBoundingClientRect();
  const editorBounds = select('#editor-container').elt.getBoundingClientRect();
  select('#editor-container').elt.style.height = `${editorBounds.bottom - mouseY - 8}px`;
  windowResized();
  updateResizeHandlePosition();
}

function resizeHandleMouseDown(ev) {
  resizingEditor = true;
  ev.preventDefault();
  return false;
}

function windowMouseMove(ev) {
  if (resizingEditor)
    updateEditorSize(ev.clientY);
}

function windowMouseUp() {
  resizingEditor = false;
  updateResizeHandlePosition();
}

document.getElementById('resize-handle').addEventListener('mousedown', resizeHandleMouseDown);
document.addEventListener('mousemove', windowMouseMove);
document.addEventListener('mouseup', windowMouseUp);