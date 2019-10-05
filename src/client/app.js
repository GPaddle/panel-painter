let panelData = [];

const borderWidth = 4;
const panelWidth = 32;
const panelHeight = 8;

let cellSize = 0;
let canvasWidth = 0;
let canvasHeight = 0;
let canvasMargin = 20;

let colorPicker;

function setup() {
  cellSize = displayWidth - canvasMargin * 2; // remove margins
  cellSize = cellSize - (borderWidth * (panelWidth + 1)); // remove borders ;)
  cellSize = cellSize / panelWidth; // divide by number of cells horizontally
  cellSize = int(cellSize);

  canvasWidth = cellSize * panelWidth + (panelWidth - 1) * borderWidth;
  canvasHeight = cellSize * panelHeight + (panelHeight - 1) * borderWidth;

  createCanvas(canvasWidth, canvasHeight);
  background('grey');
  colorPicker = createColorPicker('#ff0000');
  for (var x = 0; x < panelWidth; x++) {
    panelData[x] = [];
    for (var y = 0; y < panelHeight; y++) {
      panelData[x][y] = color(0, 0, 0);
    }
  }
}

function draw() {
  strokeWeight(1);
  for (var x = 0; x < panelWidth; x++) {
    for (var y = 0; y < panelHeight; y++) {
      fill(panelData[x][y]);
      rect((cellSize + borderWidth) * x, (cellSize + borderWidth) * y, cellSize, cellSize);
    }
  }
}

function mouseDragged() {
  if (mouseX >= 0 &&
    mouseX <= (cellSize + borderWidth) * panelWidth &&
    mouseY >= 0 && mouseY <= (cellSize + borderWidth) * panelHeight) {
    let x = mouseX;
    let y = mouseY;
    var color = colorPicker.color();
    // TODO: this is where we push the change to the server
    panelData[int(x / (cellSize + borderWidth))][int(y / (cellSize + borderWidth))] = color;
  }
}

console.log("started");