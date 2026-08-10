//Get the canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Animation
// let x = 50;
// const y = 50;
// let xSpeed = 3;

// function animation() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = "#ef4565";
//   ctx.fillRect(x, y, 100, 100);
//   x += xSpeed;
//   if (x + 100 >= canvas.width || x <= 0) xSpeed = -xSpeed;

//   console.log(xSpeed)
//   requestAnimationFrame(animation);
// }

// animation();

//Ball bouncing

let radius = 30;

let ball1 = { x: 60, y: 60, dx: 3, dy: 4 };
let ball2 = { x: 90, y: 30, dx: 4, dy: 3 };

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ballBouncing(ball1);
  ballBouncing(ball2);
  requestAnimationFrame(gameLoop);
}

gameLoop();

function ballBouncing(ball) {
  //Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#ef4565";
  ctx.fill();

  //Movement logic
  ball.x += ball.dx;
  ball.y += ball.dy;
  if (ball.x + radius >= canvas.width || ball.x - radius <= 0)
    ball.dx = -ball.dx;
  if (ball.y + radius >= canvas.height || ball.y - radius <= 0)
    ball.dy = -ball.dy;
}
