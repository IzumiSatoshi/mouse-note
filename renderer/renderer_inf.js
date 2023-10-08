const { spawn } = require('child_process');

const PEN_WIDTH = 3.5;
const ERASER_WIDTH = 100;
const OFFSCREEN_WIDTH = 5000
const OFFSCREEN_HEIGHT = 5000

const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = OFFSCREEN_WIDTH;
offscreenCanvas.height = OFFSCREEN_HEIGHT;
const offscreenCtx = offscreenCanvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let painting = false;
let currentMousePosition = { x: 0, y: 0 };

// start position is center
let offsetX = (offscreenCanvas.width - canvas.width) / 2
let offsetY = (offscreenCanvas.height - canvas.height) / 2
redrawCanvas();

let isPanning = false;
let currentTool = 'pen'; // Default tool is pen


canvas.addEventListener('mouseenter', () => {
  spawn('python', ['setMouseSpeed.py']);
});
canvas.addEventListener('mouseleave', () => {
  spawn('python', ['resetMouseSpeed.py']);
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyE' || event.code === 'KeyR') {
        painting = true;
        currentTool = 'pen';
    } else if (event.code === 'KeyW') {
        painting = true;
        currentTool = 'eraser';
    } else if (event.ctrlKey && event.key === 's') {
        saveDrawing();
    } else if (event.ctrlKey && event.key === 'o') {
        openDrawing();
    }
  }
);

document.addEventListener('keyup', (event) => {
    if (event.code === 'KeyE' || event.code === 'KeyR' || event.code === 'KeyW') {
        drawDot();
        painting = false;
        ctx.beginPath();
        offscreenCtx.beginPath();
    }
});


window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

canvas.addEventListener('mousemove', (event) => {
    currentMousePosition.x = event.clientX - canvas.offsetLeft;
    currentMousePosition.y = event.clientY - canvas.offsetTop;

    if (isPanning) {
        offsetX -= event.movementX;
        offsetY -= event.movementY;
        redrawCanvas();
    } else {
        draw(event);
    }
});
canvas.addEventListener('mousedown', (event) => {
    if (event.button === 2) {
        isPanning = true;
        canvas.style.cursor = 'grabbing';
    } 
});

canvas.addEventListener('mouseup', (event) => {
    if (event.button === 2) {
        isPanning = false;
        canvas.style.cursor = 'default';
        // Do NOT reset offsetX and offsetY here
    }
});


canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});
function drawDot() {
    let x = currentMousePosition.x + offsetX;
    let y = currentMousePosition.y + offsetY;
    offscreenCtx.beginPath();
    offscreenCtx.arc(x, y, offscreenCtx.lineWidth / 2, 0, Math.PI * 2);
    offscreenCtx.fill();
    redrawCanvas();  // Update the visible canvas after drawing
}

function draw(event) {
    if (!painting) return;

    let x = currentMousePosition.x + offsetX;
    let y = currentMousePosition.y + offsetY;

    offscreenCtx.lineWidth = PEN_WIDTH;
    offscreenCtx.lineCap = 'round';
    offscreenCtx.lineJoin = 'round';

    if (currentTool === 'pen') {
        offscreenCtx.strokeStyle = 'black';
        offscreenCtx.lineTo(x, y);
        offscreenCtx.stroke();
    } else if (currentTool === 'eraser') {
        offscreenCtx.clearRect(x - ERASER_WIDTH / 2, y - ERASER_WIDTH / 2, ERASER_WIDTH, ERASER_WIDTH);
    }

    redrawCanvas();  // Update the visible canvas after drawing
}


function redrawCanvas() {
  // draw border
  offscreenCtx.strokeRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(offscreenCanvas, offsetX, offsetY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'black';  // Color of the border
  ctx.lineWidth = 5;        // Width of the border
}

function saveDrawing() {
    const dataURL = offscreenCanvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = dataURL;
    downloadLink.download = "drawing.png";
    downloadLink.click();
}
function openDrawing() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
                    offscreenCtx.drawImage(img, 0, 0);
                    redrawCanvas();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    fileInput.click();
}