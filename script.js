//Get the canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Square param
const xSpeed = 300; //(pixel/s)
const ySpeed = 300; //(pixel/s)
const width = 20;
const height = 20;

//Movement param
const position = { x: 10, y: 10 };
const movement = {
  arrowUp: false,
  arrowDown: false,
  arrowLeft: false,
  arrowRight: false,
};

function draw(position) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ef4565";
  ctx.fillRect(position.x, position.y, width, height);
}

//Key down then continue moving
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
    case "w":
    case "W":
      movement.arrowUp = true;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      movement.arrowDown = true;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      movement.arrowLeft = true;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      movement.arrowRight = true;
      break;
  }
});

//Stop when release the key
document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowUp":
    case "w":
    case "W":
      movement.arrowUp = false;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      movement.arrowDown = false;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      movement.arrowLeft = false;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      movement.arrowRight = false;
      break;
  }
});

//Game Loop sử dụng delta time
let lastTime = performance.now();
function gameLoop(timeStamp) {
  const dt = (timeStamp - lastTime) / 1000;
  lastTime = timeStamp;
  if (movement.arrowUp) position.y -= ySpeed * dt;
  if (movement.arrowDown) position.y += ySpeed * dt;
  if (movement.arrowLeft) position.x -= xSpeed * dt;
  if (movement.arrowRight) position.x += xSpeed * dt;
  position.x = Math.max(0, Math.min(canvas.width - width, position.x));
  position.y = Math.max(0, Math.min(canvas.height - height, position.y));
  draw(position);
  requestAnimationFrame(gameLoop);
}
draw(position);
requestAnimationFrame(gameLoop);
