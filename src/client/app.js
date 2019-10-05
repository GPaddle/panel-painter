

const props = {
  panelWidth: 32,
  panelHeight: 8,
  borderWidth: 4,
  canvasMargin: 20, // if you change this also change in style.css for centering
}
const state = {
  cellSize: 0,
  canvasWidth: 0,
  canvasHeight: 0,
  panelData: [],
  lastX: -1,
  lastY: -1
}

let colorPicker;

function setup() {

  state.cellSize = displayWidth - props.canvasMargin * 2; // remove margins
  state.cellSize -= (props.borderWidth * (props.panelWidth + 1)); // remove borders ;)
  state.cellSize /= props.panelWidth; // divide by number of cells horizontally
  state.cellSize = int(state.cellSize);

  state.canvasWidth = state.cellSize * props.panelWidth + (props.panelWidth - 1) * props.borderWidth;
  state.canvasHeight = state.cellSize * props.panelHeight + (props.panelHeight - 1) * props.borderWidth;

  createCanvas(state.canvasWidth, state.canvasHeight);
  background('grey');
  colorPicker = createColorPicker('#ff0000');
  for (let x = 0; x < props.panelWidth; x++) {
    state.panelData[x] = [];
    for (let y = 0; y < props.panelHeight; y++) {
      state.panelData[x][y] = color(0, 0, 0);
    }
  }
}

function draw() {
  strokeWeight(1);
  for (let x = 0; x < props.panelWidth; x++) {
    for (let y = 0; y < props.panelHeight; y++) {
      fill(state.panelData[x][y]);
      rect((state.cellSize + props.borderWidth) * x,
        (state.cellSize + props.borderWidth) * y,
        state.cellSize,
        state.cellSize);
    }
  }
}

function mouseDragged() {
  if (mouseX >= 0 &&
    mouseX <= (state.cellSize + props.borderWidth) * props.panelWidth &&
    mouseY >= 0 && mouseY <= (state.cellSize + props.borderWidth) * props.panelHeight) {
    let x = mouseX;
    let y = mouseY;
    let color = colorPicker.color();
    // TODO: this is where we push the change to the server
    let targetX = int(x / (state.cellSize + props.borderWidth));
    let targetY = int(y / (state.cellSize + props.borderWidth));
    let r = color.levels[0];
    let g = color.levels[1];
    let b = color.levels[2];
    if (targetX != state.lastX
      || targetY != state.lastY) { // TODO: add OR color changed condition

      if(webSocket.readyState === webSocket.OPEN){
        webSocket.send([targetX, targetY, r, g, b]);
      }
      
      state.panelData[targetX][targetY] = color;
    }
    state.lastX = targetX;
    state.lastY = targetY;
  }
}

let wsUrl = window.location.protocol === "https:" ? "wss://" : "ws://";
wsUrl += window.location.host + window.location.pathname;
wsUrl += "draw";

console.log("WebSocket to", wsUrl);
const webSocket = new WebSocket(wsUrl);
