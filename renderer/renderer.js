const MAX_HISTORY_SIZE = 20;
const PEN_WIDTH = 3.5;
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let painting = false;
let drawingHistory = [];
let currentStep = -1;
let currentMousePosition = { x: 0, y: 0 };

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveCanvasState();
    }
});


document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyE' || event.code === 'KeyR') {
        painting = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'KeyE' || event.code === 'KeyR') {
        drawDot(currentMousePosition.x, currentMousePosition.y);
        painting = false;
        ctx.beginPath();
        saveCanvasState();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'z') {
        undo();
    }
});


window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


canvas.addEventListener('mousemove', (event) => {
  currentMousePosition.x = event.clientX
  currentMousePosition.y = event.clientY

  draw(event);
});

function drawDot(x, y) {
    ctx.beginPath();
    ctx.arc(x - canvas.offsetLeft, y - canvas.offsetTop, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
}

function draw(event) {
    if (!painting) return;

    ctx.lineWidth = PEN_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'black';


    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}


function saveCanvasState() {
    currentStep++;
    if (currentStep < drawingHistory.length) {
        drawingHistory.length = currentStep; // Remove any forward history
    }
    drawingHistory.push(canvas.toDataURL()); // Save current canvas state
}
function undo() {
    if (currentStep <= 0) return; // No more steps to undo
    currentStep--;
    let canvasImage = new Image();
    canvasImage.src = drawingHistory[currentStep];
    canvasImage.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasImage, 0, 0);
    };
}
