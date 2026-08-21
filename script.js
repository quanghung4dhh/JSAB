//Get the canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let xCenter = 50;
let yCenter = 50;
let radius = 10;
let movement = false;
const position = {};

function draw(position) {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ef4565";
  ctx.beginPath();
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

canvas.addEventListener("mousedown", (event) => {
  movement = true;
  position.x = event.offsetX;
  position.y = event.offsetY;
  draw(position); // Vẽ ngay điểm đầu tiên
});

canvas.addEventListener("mousemove", (event) => {
  if (!movement) return;

  position.x = event.offsetX;
  position.y = event.offsetY;
});

canvas.addEventListener("mouseup", () => {
  movement = false;
});

function gameLoop() {
  if (movement) draw(position);
  requestAnimationFrame(gameLoop);
}
gameLoop()