// Coding Challenge 121: Logo
// https://youtu.be/i-k04yzfMpw

let canvas;
let editor;
let editor_bg;
let turtle;
let recentreBtn;
let bgcolorBtn;

let draggingCanvas = false;
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
let drawingBoundsFirstPoint = true;
let centerAnimation = null;

let primary_keywords = ['fd', 'bd', 'rt', 'lt'];
let secondary_keywords = ['color', 'colorrgb', 'pensize', 'repeat', 'pu', 'pd'];

function syntaxHighlight(code) {
  let tokens = code.split(/(\[\s*\d+\s+\d+\s+\d+\s*\])|(\[)|(\])|(\s+)/).filter(x => (x !== undefined && x != ''));
  let newHTML = '';

  for (i of tokens) {
    if (primary_keywords.includes(i)) {  // #f48771
      newHTML += `<strong><span style="color: #be5046">${i}</span></strong>`;
    }

    else if (secondary_keywords.includes(i)) {
      newHTML += `<span style="color: #15c1c1">${i}</span>`;
    }

    else if (['[', ']'].includes(i)) {
      newHTML += `<span style="color: #ffffff">${i}</span>`;
    }

    else if (/#[a-zA-z0-9]/.test(i) || /\[\s*\d+\s+\d+\s+\d+\s*\]/.test(i)) {
      newHTML += `<em><span style="color: #c678dd">${i}</span></em>`;
    }

    else if (parseInt(i) !== NaN) {
      newHTML += `<span style="color: #f5be4a">${i}</span>`;
    }

    else {
      newHTML += `<span style="color: #cccccc">${i}</span>`;
    }
  }

  return newHTML;
}

function showError(start,end)
{
  let text = editor.value();
  start = (start > 0) ? start + 1 : start;
  end = (start < text.length) ? end - 1 : end;

  let beforeErr= text.substring(0,start);
  let afterErr = text.substring(end);
  let err = text.substring(start,end);
  let bg_text = `${syntaxHighlight(beforeErr)}<mark>${err}</mark>${syntaxHighlight(afterErr)}`;
  editor_bg.html(bg_text);
}

/*
 * Returns a function that waits for `delay` milliseconds and if it had not been called again, invokes `func`
 * If it _is_ called again within `delay` milliseconds, `func` is *not* invoked (yet) and the timer is reset.
 */
function debounce(func, delay) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func();
      timeout = null;
    }, delay);
  }
}

function canvasResized() {
  scaleToFitBoundingBox(drawingBounds, true);
}

const debouncedCanvasResized = debounce(canvasResized, 300);

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
  debouncedCanvasResized();
  goTurtle();
  updateEditorOverlayMargin();
}

function setup() {
  const canvasSize = getCanvasSize();
  canvas = createCanvas(canvasSize.width, canvasSize.height);
  div = document.querySelector("#logo-canvas");

  div.appendChild(canvas.elt);

  // Use a setTimeout with length 0 to call windowResized immediately after the DOM has updated (since we are dynamically injecting a canvas element)
  setTimeout(() => {
    windowResized();
    scaleToFitBoundingBox(drawingBounds);
  }, 0);

  angleMode(DEGREES);
  background(bgcolor);

  canvas.mousePressed(function () {
    if (mouseIsPressed) {
      draggingCanvas = true;
      dragStartMousePos = new p5.Vector(mouseX, mouseY);
      dragStartCanvasOffset = new p5.Vector(canvasScrollX, canvasScrollY);
    }
  });

  canvas.mouseMoved(function () {
    if (mouseIsPressed && draggingCanvas) {
      canvasScrollX = dragStartCanvasOffset.x + dragStartMousePos.x - mouseX;
      canvasScrollY = dragStartCanvasOffset.y + dragStartMousePos.y - mouseY;
      goTurtle();
    }
  });

  canvas.mouseReleased(function () {
    draggingCanvas = false;
  });

  recentreBtn = document.querySelector("#recentre");
  bgcolorBtn = document.querySelector("#bgcolor");

  recentreBtn.onclick = function () {
    scaleToFitBoundingBox(drawingBounds, true);
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
  editor.input(() => {
    updateEditorContent();
    goTurtle();
  });
  editor_bg = select("#code_bg");
  scaleToFitBoundingBox(drawingBounds); // This also redraws (it has to in order to measure the size of the drawing)
  updateEditorContent();

  editor.elt.addEventListener('scroll', ev => {
    select('#code_bg').elt.scrollTop = editor.elt.scrollTop;
  }, { passive: true }); // The 'passive: true' parameter increases performance when scrolling by making it impossible to cancel the scroll events
}

function scaleToFitBoundingBox(boundingBox, animate = false) {
  // If it's already animating, wait for it to finish
  if (centerAnimation !== null) return;

  // Run this once first so we can measure the size of the drawing
  goTurtle();

  // 15% padding around the drawing in the canvas
  let drawingPadding = Math.min(width, height) * 0.15;
  let scale = Math.min((width - drawingPadding) / (boundingBox.width), (height - drawingPadding) / (boundingBox.height));

  centerAnimation = new Animation(
    { // Starting values
      scaleX: canvasScaleX,
      scaleY: canvasScaleY,
      scrollX: canvasScrollX,
      scrollY: canvasScrollY
    },
    { // Ending values
      scaleX: scale,
      scaleY: scale,
      scrollX: (drawingBounds.x * scale - width * .5),
      scrollY: (drawingBounds.y * scale - height * .5)
    },
    500, // Duration
    values => { // Update callback
      canvasScaleX = values.scaleX;
      canvasScaleY = values.scaleY;
      canvasScrollX = values.scrollX;
      canvasScrollY = values.scrollY;
      goTurtle();
    },
    () => { // Finished callback
      centerAnimation = null;
    },
    'EASE_IN_OUT_QUART' // Easing function
  );

  if (!animate)
    centerAnimation.skip();
}

function afterCommandExecuted() {
  if (turtle.pen) {
    if (drawingBoundsFirstPoint) {
      drawingBounds.reset();
      drawingBounds.move(turtle.x, turtle.y);
      drawingBoundsFirstPoint = false;
    } else {
      drawingBounds.includePoint(turtle.x, turtle.y);
      drawingBounds.includePoint(turtle.prevX, turtle.prevY);
    }
  }
}

function goTurtle() {
  turtle = new Turtle(0, 0, 0);
  drawingBoundsFirstPoint = true;
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
  editor.value("pu lt 137.65529298653294 fd 976.8561818405 pd rt 226.68824339815836 fd 152.4372715813438 lt 85.8531202917612 fd 36.39479127393992 lt 92.68803293191851 fd 52.26692653029919 rt 92.5209903162377 fd 25.607110688164614 rt 88.27165601761733 fd 50.03444007007564 lt 94.77376842759715 fd 36.8557075241262 lt 87.7077261380923 fd 150.3227238372405 lt 88.42847206938853 fd 34.32066940629492 rt 268.79820473846263 fd 62.14126477571626 lt 267.1608100422197 fd 26.050649610355503 rt 87.98812841703429 fd 62 rt 269.8384880759387 fd 37.894852464272574 pu lt 127.57846501769401 fd 192.03433479249722 pd lt 125.99981834993274 fd 157.01931669846104 rt 74.47905464709598 fd 34.77145722805244 rt 75.24489439172172 fd 152.82075787548723 lt 253.89646352962166 fd 27.33950788221134 rt 66.87479875707015 fd 49.48927428329972 rt 290.1134656726491 fd 20.02929703770395 lt 67.61599391674153 fd 50.32551281072409 rt 64.4818274480553 fd 32.07647699283572 pu lt 236.7657091105625 fd 123.31602517069938 pd rt 172.36489685055994 fd 27.491881682168792 lt 112.21501281652321 fd 19.067950757786974 lt 109.3890357681035 fd 27.462582392760684 pu rt 83.81810631279193 fd 89.78418676338659 pd rt 115.80826917314843 fd 147.1538052780979 lt 87.82759823092368 fd 22.21721136726055 lt 92.12414460040847 fd 66.17394707364868 rt 86.39752691305017 fd 19.33783692754873 lt 30.02843689139671 fd 21.65059235396762 lt 38.55078719250547 fd 20.21932848552208 lt 16.72254344912382 fd 18.17076267241017 lt 21.649969918532463 fd 19.45457320305321 lt 35.0114120934099 fd 20.03307494467124 lt 31.00115891240793 fd 21.11525892786955 lt 1.8512890202116807 fd 21.53875040563145 pu rt 230.7100644957429 fd 35.62911717657565 pd rt 38.096446080274944 fd 30.28229679184608 lt 103.81502534126142 fd 14.090732930323798 lt 54.38356517238702 fd 12.079641404640906 lt 40.894901486837085 fd 12.343348146005642 lt 54.961112098591684 fd 14.69722988962973 pu rt 138.92839084360298 fd 63.92142210023353 pd rt 114.35776154788056 fd 150.52776914194018 lt 89.23154829240633 fd 21.982704337784583 lt 91.69576131718081 fd 68.22112340934673 rt 83.84244801520241 fd 19.700021891746427 lt 23.218344758868028 fd 20.42729570521346 lt 44.280966666790576 fd 20.402648862616626 lt 15.411273733292873 fd 16.8249935732988 lt 23.131262954140567 fd 19.382019933571414 lt 27.346752932344458 fd 20.42360057496433 lt 32.487008203083946 fd 20.535390387889485 rt 353.72892255049885 fd 19.739571242092268 pu lt 128.601043372631 fd 34.15607502723075 pd rt 39.39676692537027 fd 32.30423189037233 lt 112.93121543083966 fd 14.287542884206843 lt 49.80403618570027 fd 10.85314861455506 lt 39.097982961621284 fd 12.49729148568176 lt 48.529660295179056 fd 12.208085723708184 pu rt 132.30311392075163 fd 53.941900562168186 pd rt 90.90399919249631 fd 80.75085335467087 rt 50.52278431867306 fd 84.721067282618 lt 110.07710933134513 fd 22.038711318588895 lt 68.49002403992937 fd 166.9616977134021 lt 115.21206405744365 fd 24.12768012541202 rt 294.8390622824954 fd 54.8076217681135 lt 230.4415138580622 fd 55.34153234968843 rt 294.455024432035 fd 24.227990745550198 pu lt 41.77899202728432 fd 483.95957105718907 pd lt 227.9632428082819 fd 105.80523919615582 rt 90.50613329649622 fd 24.67446405261535 rt 59.826479970355685 fd 65.08361759962534 lt 150.96465697784382 fd 56.46332319859036 rt 91.52530476163915 fd 27.665939685693278 rt 88.18840397228712 fd 105.27286075776739 lt 267.00617692168913 fd 27.30169335980043 rt 58.076704140288385 fd 63.25371283359331 rt 209.59739827247625 fd 55.925115758128086 rt 90.42225503944114 fd 27.095697906110473 pu lt 219.32478655507867 fd 167.99629330039548 pd rt 129.12857298145008 fd 104.17113187731951 lt 88.6846740803343 fd 70.41555651405851 lt 91.79696126345942 fd 18.103923331646683 lt 86.96309825797138 fd 37.03481880591461 rt 87.46820585752407 fd 21.123663748882674 rt 89.43620460612789 fd 20.004763774916793 lt 90.11036445853968 fd 18.13584629454962 rt 269.4628309116711 fd 18.70118565475241 lt 270.2231283892589 fd 22.070144870761638 rt 91.33839519653378 fd 35.518241621235646 lt 87.1244590728365 fd 23.571434630452448 lt 91.96849619420512 fd 70.47275640854967 pu rt 178.86805751483485 fd 113.16309633415223 pd rt 77.23059818632095 fd 110.46505842954346 lt 75.50743552952248 fd 24.810285576753607 lt 67.94623642928774 fd 46.723093395132636 rt 131.70488677713 fd 48.894630253350655 lt 64.6538240580535 fd 21.70635034039526 lt 77.12499844038737 fd 111.33077361517095 rt 256.34017383739564 fd 28.298432884057704 lt 77.04371718842064 fd 60.66861720897799 lt 217.81246403289276 fd 42.99539492912757 lt 63.11362990892637 fd 17.834429042497842 rt 292.60510964130856 fd 40.261446848747 lt 218.43939264095155 fd 58.47697655063618 lt 73.79754233424421 fd 27.531467846606212 pu rt 330.71825389827876 fd 351.4547783016325 pd lt 150.04225092357555 fd 28.278502822927933 rt 55.66803818650883 fd 52.96792211746251 lt 112.00830177127688 fd 52.26995388687327 rt 52.99588848331378 fd 27.09386154498638 rt 129.44137271155515 fd 157.912830378637 rt 48.14523122339776 fd 26.57258753667789 lt 228.9975761838207 fd 85.79814226475035 lt 72.1336425324412 fd 73.38114174772235 pu rt 125.85919088191099 fd 138.92926191563552 pd rt 88.0307737872235 fd 130.3592610589298 lt 88.99365002663087 fd 62.341991806355814 lt 88.97995426153145 fd 28.109395986086323 lt 90.23598821913258 fd 34.24527758062879 rt 89.70390041633121 fd 23.582027403381467 rt 92.71870704179265 fd 15.857183667229098 lt 92.72931147985648 fd 23.905008675943474 lt 88.528477599033 fd 16.486231692955684 rt 87.75425743410494 fd 23.2568039361378 rt 90.97102193107916 fd 38.120791934392635 lt 91.5741131254597 fd 30.687760760747494 lt 88.31086297961306 fd 68.16760174823438 pu rt 232.8526126413872 fd 160.2294926209735 pd lt 126.08153732599001 fd 131.67172898644907 rt 71.13779285334225 fd 36.828939325462756 rt 81.34892318499043 fd 127.48183918482313 rt 99.65616282026375 fd 29.73894032921811 lt 276.4462488538422 fd 40.657794587785204 lt 81.82270436222345 fd 19.556885638410247 rt 286.91941781157846 fd 43.919531359568666 rt 70.71993679607692 fd 29.39579081900025 pu lt 237.67325199844788 fd 108.19716936830042 pd rt 166.063088644699 fd 28.154908058292733 lt 106.48799458331212 fd 14.40596991261253 lt 102.84743227192503 fd 27.366500296555174 pu rt 148.38169246876754 fd 123.17064213121144 pd lt 137.70872481290144 fd 123.08251358607176 rt 85.02309611071138 fd 28.631033862558862 rt 14.625287313373972 fd 31.71524507611377 rt 43.09661115007573 fd 28.620906981039184 rt 31.81703484145919 fd 29.113249543908882 rt 46.44074711763551 fd 24.026585006150963 rt 31.6557309180468 fd 26.01939222099378 lt 113.92217527346591 fd 57.47270814276221 rt 130.80196145209055 fd 33.767283207304494 lt 305.7442169743264 fd 30.21003699245854 rt 216.31242095318993 fd 23.259046961068137 rt 89.38130034133727 fd 26.1718787972607 pu lt 252.9569982174641 fd 104.31310404998156 pd rt 164.55684469753467 fd 33.93459642738649 lt 102.57296281887388 fd 16.647960741162326 lt 61.86128678634138 fd 13.088928989972379 lt 39.136394720667084 fd 13.020996370471329 lt 43.724227286537655 fd 15.77802917791051");
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

    updateEditorOverlayMargin();
    updateEditorContent();
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

function updateEditorContent() {
  editor_bg.html(syntaxHighlight(editor.value()));
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