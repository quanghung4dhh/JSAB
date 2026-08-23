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
  x: 10,
  y: 10,
  size: 20,
  color: "#3da9fc",
  speed: 300, //(pixel/s)
};

//ENEMY
const enemy = {
  x: 20,
  y: 30,
  radius: 10,
  color: "#ef4565",
  Xspeed: 200, // pixel/s
  Yspeed: 300, // pixel/s
};

// 2. GAME INIT
function init() {
  //Khởi tạo canvas và ctx
  gameCanvas.canvas = document.getElementById("canvas");
  gameCanvas.ctx = gameCanvas.canvas.getContext("2d");

  //Gắn sự kiện ấn phím
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  //Tạo game loop
  gameCanvas.lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

// 3. EVENT KEY HANDLER
function handleKeyDown(event) {
  //Handle change state Pause/Playing
  if (event.key === "Escape") {
    gameCanvas.state = "PAUSE";
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    gameCanvas.state = "PLAYING";
    return;
  }

  //Handle moving input
  const key = KEY[event.key];
  if (key) movement[key] = true;
}

function handleKeyUp(event) {
  const key = KEY[event.key];
  if (key) movement[key] = false;
}

// 4. DRAW FUNCTION
function draw() {
  const { ctx } = gameCanvas;
  ctx.clearRect(0, 0, gameCanvas.canvas.width, gameCanvas.canvas.height);
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
  enemy.x += enemy.Xspeed * dt;
  enemy.y += enemy.Yspeed * dt;

  //Boucing
  if (enemy.x + enemy.radius >= canvas.width || enemy.x - enemy.radius < 0)
    enemy.Xspeed = -enemy.Xspeed;
  if (enemy.y + enemy.radius >= canvas.height || enemy.y - enemy.radius < 0)
    enemy.Yspeed = -enemy.Yspeed;
}

// 6. GAMELOOP
function gameLoop(timeStamp) {
  switch (gameCanvas.state) {
    case "PLAYING": {
      const dt = (timeStamp - gameCanvas.lastTime) / 1000;
      gameCanvas.lastTime = timeStamp;
      update(dt);
      updateBall(dt);
      draw();
      drawBall();
      requestAnimationFrame(gameLoop);
      break;
    }
    case "PAUSE": {
      gameCanvas.lastTime = timeStamp;
      draw();
      requestAnimationFrame(gameLoop);
      break;
    }
  }
}

init();
