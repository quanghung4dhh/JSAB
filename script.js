// 1. STATE GAME
const gameCanvas = {
  canvas: null,
  ctx: null,
  lastTime: 0,
  state: "PLAYING",
};

//MOVEMENT
const movement = {
  up: false,
  down: false,
  left: false,
  right: false,
};

//KEY CONTROL
const KEY = {
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
};

//PLAYER
const player = {
  x: 0,
  y: 0,
  size: 20,
  color: "#3da9fc",
  speed: 300, //(pixel/s)
};

//ENEMY
const enemy = {
  x: 200,
  y: 300,
  radius: 10,
  color: "#ef4565",
  xSpeed: 100, // pixel/s
  ySpeed: 300, // pixel/s
};

// 2. GAME INIT
function init() {
  //Khởi tạo canvas và ctx
  gameCanvas.canvas = document.getElementById("canvas");
  gameCanvas.ctx = gameCanvas.canvas.getContext("2d");

  //Set vị trí ban đầu cho player
  player.x = gameCanvas.canvas.width / 2 - player.size / 2;
  player.y = gameCanvas.canvas.height / 2 - player.size / 2;

  //Gắn sự kiện ấn phím
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  //Tạo game loop
  gameCanvas.lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

// 3. EVENT KEY HANDLER
function handleKeyDown(event) {
  //Handle moving input
  if (gameCanvas.state === "PLAYING") {
    const key = KEY[event.key];
    if (key) movement[key] = true;
  }

  //Handle state change
  handleStateKeyDown(event);
}

//Handle changing state MENU/PAUSE/GAME OVER
function handleStateKeyDown(event) {
  if (event.key === "Escape" && gameCanvas.state === "PLAYING") {
    gameCanvas.state = "PAUSE";
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (gameCanvas.state === "PAUSE") {
      gameCanvas.state = "PLAYING";
      return;
    }
    if (gameCanvas.state === "GAME OVER") {
      resetGame();
      gameCanvas.state = "PLAYING";
      return;
    }
  }
}

function handleKeyUp(event) {
  const key = KEY[event.key];
  if (key) movement[key] = false;
}

// 4. DRAW FUNCTION
function draw() {
  const { ctx } = gameCanvas;
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Draw enemy
function drawBall() {
  const { ctx } = gameCanvas;
  ctx.fillStyle = enemy.color;
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
  ctx.fill();
}

// Draw UI
function drawUI() {
  if (gameCanvas.state === "PLAYING") return;

  //Draw PAUSE
  const { ctx, canvas, state } = gameCanvas;
  if (state === "PAUSE") {
    ctx.fillStyle = "rgba(15, 14, 23, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fffffe";
    ctx.font = "30px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
    return;
  }
  if (state === "GAME OVER") {
    ctx.fillStyle = "rgba(15, 14, 23, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fffffe";
    ctx.font = "30px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    return;
  }
}

// 5. UPDATE FUNCTION
function update(dt) {
  const { canvas } = gameCanvas;

  //Update vị trí player
  if (movement.up) player.y -= player.speed * dt;
  if (movement.down) player.y += player.speed * dt;
  if (movement.left) player.x -= player.speed * dt;
  if (movement.right) player.x += player.speed * dt;

  //Giới hạn vị trí player
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

// Update Ball
function updateBall(dt) {
  const { canvas } = gameCanvas;

  //Moving the ball
  enemy.x += enemy.xSpeed * dt;
  enemy.y += enemy.ySpeed * dt;

  //Boucing
  if (enemy.x + enemy.radius >= canvas.width || enemy.x - enemy.radius < 0)
    enemy.xSpeed = -enemy.xSpeed;
  if (enemy.y + enemy.radius >= canvas.height || enemy.y - enemy.radius < 0)
    enemy.ySpeed = -enemy.ySpeed;
}

// 6. CHECK COLLISION
function checkCollision() {
  if (gameCanvas.state !== "PLAYING") return;

  //Get the coordinate
  const { x: xp, y: yp, size } = player;
  const { x: x2, y: y2, radius } = enemy;

  const x1 = xp + size / 2;
  const y1 = yp + size / 2;

  //Collision condition
  if (Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) <= size / 2 + radius)
    gameCanvas.state = "GAME OVER";
}

// 7. Reset Game
function resetGame() {
  //Reset player
  const { canvas } = gameCanvas;
  player.x = canvas.width / 2 - player.size / 2;
  player.y = canvas.height / 2 - player.size / 2;

  //Reset enemy
  enemy.x = 200;
  enemy.y = 300;

  //Reset movement
  movement.up = movement.down = movement.left = movement.right = false;
}

// 8. GAMELOOP
function gameLoop(timeStamp) {
  switch (gameCanvas.state) {
    case "PLAYING": {
      const dt = (timeStamp - gameCanvas.lastTime) / 1000;
      gameCanvas.lastTime = timeStamp;
      update(dt);
      updateBall(dt);
      checkCollision();
      gameCanvas.ctx.clearRect(
        0,
        0,
        gameCanvas.canvas.width,
        gameCanvas.canvas.height,
      );
      draw();
      drawBall();
      requestAnimationFrame(gameLoop);
      break;
    }
    case "PAUSE":
    case "GAME OVER": {
      gameCanvas.lastTime = timeStamp;
      gameCanvas.ctx.clearRect(
        0,
        0,
        gameCanvas.canvas.width,
        gameCanvas.canvas.height,
      );

      draw();
      drawBall();
      drawUI();
      requestAnimationFrame(gameLoop);
      break;
    }
  }
}

init();
