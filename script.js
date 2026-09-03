// 1. STATE GAME
const STATE = {
  MENU: "MENU",
  PAUSE: "PAUSE",
  PLAYING: "PLAYING",
  GAME_OVER: "GAME OVER",
};

// GAME STATE
const gameCanvas = {
  canvas: null,
  ctx: null,
  lastTime: 0,
  state: STATE.MENU,
};

// MOVEMENT
const movement = {
  up: false,
  down: false,
  right: false,
  left: false,
};

// KEY CONTROL
const KEY = {
  W: "up",
  w: "up",
  ArrowUp: "up",
  S: "down",
  s: "down",
  ArrowDown: "down",
  A: "left",
  a: "left",
  ArrowLeft: "left",
  D: "right",
  d: "right",
  ArrowRight: "right",
};

// PLAYER
const player = {
  color: "#3da9fc",
  size: 20,
  speed: 400, //pixel/s
  x: 0,
  y: 0,
};

// ENEMY
const enemy = {
  color: "#ef4565",
  radius: 10,
  xSpeed: 300, //pixel/s
  ySpeed: 500, //pixel/s
  x: 0,
  y: 0,
};

// 2. GAME INIT

function init() {
  //Init Canvas
  gameCanvas.canvas = document.getElementById("canvas");
  gameCanvas.ctx = gameCanvas.canvas.getContext("2d");

  //Set initial postion for player and enemy
  player.x = (gameCanvas.canvas.width - player.size) / 2;
  player.y = (gameCanvas.canvas.height - player.size) / 2;
  enemy.x = 500;
  enemy.y = 600;

  //Set key control
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  //Set lastTime
  gameCanvas.lastTime = performance.now();

  //Set game loop
  requestAnimationFrame(gameLoop);
}

// 3. HANDLE KEY FUNCTION
function handleKeyDown(event) {
  //Handle Movement
  if (gameCanvas.state === STATE.PLAYING) {
    const key = KEY[event.key];
    if (key) movement[key] = true;
  }

  //Handle changing state game
  handleStateKey(event);
}

function handleStateKey(event) {
  let { state } = gameCanvas;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (state === STATE.PAUSE) gameCanvas.state = STATE.PLAYING;
    else if (state === STATE.GAME_OVER || state === STATE.MENU) {
      resetGame();
      gameCanvas.state = STATE.PLAYING;
    }
  } else if (event.key === "Escape" && state === STATE.PLAYING)
    gameCanvas.state = STATE.PAUSE;
}

function handleKeyUp(event) {
  //Handle Movement
  const key = KEY[event.key];
  if (key) movement[key] = false;
}

//3. RESET GAME
function resetGame() {
  //Set initial postion for player and enemy
  player.x = (gameCanvas.canvas.width - player.size) / 2;
  player.y = (gameCanvas.canvas.height - player.size) / 2;
  enemy.x = 500;
  enemy.y = 600;
  enemy.xSpeed = 300; //pixel/s
  enemy.ySpeed = 500; //pixel/s

  //Reset movement
  movement.left = movement.right = movement.up = movement.down = false;
}

//4. DRAW
function drawPlayer() {
  const { ctx } = gameCanvas;

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawEnemy() {
  const { ctx } = gameCanvas;

  ctx.fillStyle = enemy.color;
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawUI() {
  if (gameCanvas.state === STATE.PLAYING) return;
  const { canvas, ctx, state } = gameCanvas;
  ctx.fillStyle = "rgba(15, 14, 23, .9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fffffe";
  ctx.font = "30px sans-serif";
  ctx.textAlign = "center";

  switch (state) {
    case STATE.MENU: {
      ctx.fillText("Press ENTER to play", canvas.width / 2, canvas.height / 2);
      break;
    }
    case STATE.PAUSE: {
      ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
      break;
    }
    case STATE.GAME_OVER: {
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
      break;
    }
  }
}

function draw() {
  const { ctx } = gameCanvas;

  //Cleat canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Draw based on game state
  switch (gameCanvas.state) {
    case STATE.PLAYING: {
      drawPlayer();
      drawEnemy();
      break;
    }
    case STATE.PAUSE: {
      drawPlayer();
      drawEnemy();
      drawUI();
      break;
    }
    case STATE.MENU: {
      drawUI();
      break;
    }
    case STATE.GAME_OVER: {
      drawPlayer();
      drawEnemy();
      drawUI();
      break;
    }
  }
}

// 5. UPDATE
function updatePlayer(dt) {
  const { canvas } = gameCanvas;

  if (movement.down) player.y += player.speed * dt;

  if (movement.up) player.y -= player.speed * dt;

  if (movement.right) player.x += player.speed * dt;

  if (movement.left) player.x -= player.speed * dt;

  //Limit the player position
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

function updateEnemy(dt) {
  const { canvas } = gameCanvas;

  enemy.x += enemy.xSpeed * dt;
  enemy.y += enemy.ySpeed * dt;

  //Make the ball bouncing
  if (enemy.x + enemy.radius >= canvas.width || enemy.x - enemy.radius < 0)
    enemy.xSpeed = -enemy.xSpeed;
  if (enemy.y + enemy.radius >= canvas.height || enemy.y - enemy.radius < 0)
    enemy.ySpeed = -enemy.ySpeed;
}

function update(dt) {
  if (gameCanvas.state !== STATE.PLAYING) return;
  updatePlayer(dt);
  updateEnemy(dt);

  //Check Collision
  checkCollision();
}

// 6. Check collision

function checkCollision() {
  const { x: xp, y: yp } = player;
  const { x: x2, y: y2 } = enemy;

  //Get the center coordinate of player
  const x1 = xp + player.size / 2;
  const y1 = yp + player.size / 2;

  //Calculate distance
  const d = Math.sqrt((y1 - y2) ** 2 + (x1 - x2) ** 2);

  //Collision condition
  if (d <= player.size / 2 + enemy.radius) gameCanvas.state = STATE.GAME_OVER;
}

// 7. GameLoop
function gameLoop(timeStamp) {
  const { lastTime } = gameCanvas;

  //Calculate dt
  let dt = (timeStamp - lastTime) / 1000;
  dt = Math.min(dt, 0.1);
  gameCanvas.lastTime = timeStamp;

  //Update
  update(dt);

  //Draw
  draw();

  //Loop
  requestAnimationFrame(gameLoop);
}
init();
