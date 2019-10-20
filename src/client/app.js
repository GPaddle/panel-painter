const props = {
    panelWidth: 32,
    panelHeight: 8,
    borderWidth: 4,
    canvasMargin: 10, // if you change this also change in style.css for centering
};

const state = {
    cellSize: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    panelData: [],
    lastX: -1,
    lastY: -1,
    ui: {
        canvas: undefined,
        colorPicker: undefined,
        resetButton: undefined,
        fillButton: undefined,
    },
    color: "#ffff00"

};

function initialise() {


    document.getElementById("fillBucket").style.color = state.color;
    let windowWidth = parseInt(document.body.clientWidth);

    computeCellSize();

    let canvas = document.getElementById('canvas1');

    state.ui.canvas = canvas;

    state.canvasWidth = windowWidth;
    state.canvasHeight = windowWidth * (props.panelHeight / props.panelWidth);
    canvas.height = state.canvasHeight;
    canvas.width = state.canvasWidth;

    for (let x = 0; x < props.panelWidth; x++) {
        state.panelData[x] = [];
        for (let y = 0; y < props.panelHeight; y++) {
            state.panelData[x][y] = "#000000";
        }
    }
    state.ui.colorPicker = document.getElementById('colorPicker');
    document.getElementById('colorPicker').addEventListener("change", watchColorPicker, false);

    state.ui.fillButton = document.getElementById("fill");
    state.ui.fillButton.addEventListener("click", function() {
        fill(state.color);
    });
    state.ui.resetButton = document.getElementById("reset");
    state.ui.resetButton.addEventListener("click", function() {
        fill("#000000");
    });

    state.ui.canvas.addEventListener("mousedown", onMouseDown, false);

    canvas.addEventListener('touchstart', touchStart, false);
    canvas.addEventListener('touchmove', touchMove, false);

    window.addEventListener("resize", reComputeSize);

    reComputeSize();
    draw();
}

function computeCellSize() {
    let windowWidth = parseInt(document.body.clientWidth);

    state.cellSize = windowWidth - 2 * props.canvasMargin;
    state.cellSize -= (props.borderWidth * (props.panelWidth + 1));
    state.cellSize /= props.panelWidth;
    state.cellSize = parseInt(state.cellSize);
}

function reComputeSize() {

    let windowWidth = parseInt(document.body.clientWidth);
    computeCellSize();

    state.canvasWidth = windowWidth;
    state.canvasHeight = windowWidth * (props.panelHeight / props.panelWidth);

    let canvas = document.getElementById('canvas1');
    canvas.height = state.canvasHeight;
    canvas.width = state.canvasWidth;

    draw();

}

function fill(color) {
    for (let x = 0; x < props.panelWidth; x++) {
        for (let y = 0; y < props.panelHeight; y++) {
            if (state.panelData[x][y] != color) {
                state.panelData[x][y] = color;
                let r = parseInt(color.substring(1, 3), 16);
                let g = parseInt(color.substring(3, 5), 16);
                let b = parseInt(color.substring(5, 7), 16);

                sendData(x, y, r, g, b);
            }
        }
    }
    draw();
}

function watchColorPicker(event) {
    state.color = event.target.value;
    document.getElementById("fillBucket").style.color = state.color;
}



function sketchpad_touchStart() {
    getTouchPos();
    event.preventDefault();
}

function sketchpad_touchMove(e) {
    getTouchPos(e);
    event.preventDefault();
}

function getTouchPos(e) {
    if (!e)
        var e = event;

    if (e.touches) {
        if (e.touches.length == 1) {
            var touch = e.touches[0];


            var touchX = touch.pageX - props.canvasMargin;
            var touchY = touch.pageY - props.canvasMargin;

            if (touchX >= 0 && touchX <= state.canvasWidth && touchY >= 0 && touchY <= state.canvasHeight) {

                let targetX = parseInt(touchX / (state.cellSize + props.borderWidth) / 1);
                let targetY = parseInt(touchY / (state.cellSize + props.borderWidth) / 1);

                if (state.color != state.panelData[targetX][targetY]) {
                    state.panelData[targetX][targetY] = state.color;
                    //console.log(state.color);
                    let r = parseInt(state.color.substring(1, 3), 16);
                    let g = parseInt(state.color.substring(3, 5), 16);
                    let b = parseInt(state.color.substring(5, 7), 16);

                    sendData(targetX, targetY, r, g, b);


                }
                draw();
            }
        }
    }
}





function onMouseDown(event) {


    function onMouseMove(event) {
        var canvas_x = event.pageX - props.canvasMargin;
        var canvas_y = event.pageY - props.canvasMargin;



        if (canvas_x >= 0 && canvas_x <= state.canvasWidth && canvas_y >= 0 && canvas_y <= state.canvasHeight) {

            let targetX = parseInt(canvas_x / (state.cellSize + props.borderWidth) / 1);
            let targetY = parseInt(canvas_y / (state.cellSize + props.borderWidth) / 1);

            if (state.color != state.panelData[targetX][targetY]) {
                state.panelData[targetX][targetY] = state.color;
                //console.log(state.color);
                let r = parseInt(state.color.substring(1, 3), 16);
                let g = parseInt(state.color.substring(3, 5), 16);
                let b = parseInt(state.color.substring(5, 7), 16);

                sendData(targetX, targetY, r, g, b);


            }
            draw();
        }
    }

    function onMouseUp(event) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}


function sendData(x, y, r, g, b) {
    if (webSocket.readyState === webSocket.OPEN) {
        let color = state.panelData[x][y];

        let r1 = color.r;
        let g1 = color.g;
        let b1 = color.b;
        if (r != r1 || g != g1 || b != b1) {
            webSocket.send([x, y, r, g, b]);
        }
    }
}

function draw() {

    state.ui.canvas = document.getElementById("canvas1").getContext("2d");
    document.getElementById("canvas1").background = "f00000";
    state.ui.canvas.fillStyle = "#f00000";
    state.ui.canvas.fill();

    //    console.log(state.canvasHeight);


    for (let x = 0; x < props.panelWidth; x++) {
        for (let y = 0; y < props.panelHeight; y++) {
            state.ui.canvas.fillStyle = state.panelData[x][y];
            state.ui.canvas.fillRect((state.cellSize + props.borderWidth) * x,
                (state.cellSize + props.borderWidth) * y,
                state.cellSize,
                state.cellSize);
        }
    }
}


let wsUrl = window.location.protocol === "https:" ? "wss://" : "ws://";
wsUrl += window.location.host + window.location.pathname;
wsUrl += "draw";

console.log("WebSocket to", wsUrl);
const webSocket = new WebSocket(wsUrl);
