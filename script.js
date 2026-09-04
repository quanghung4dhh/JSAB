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
  width: 20,
  height: 20,
  speed: 400, //pixel/s
  x: 0,
  y: 0,
};

// OBSTACLES
let obstacles = [];

// 2. GAME INIT

function init() {
  //Init Canvas
  gameCanvas.canvas = document.getElementById("canvas");
  gameCanvas.ctx = gameCanvas.canvas.getContext("2d");

  //Set initial postion for player
  player.x = (gameCanvas.canvas.width - player.width) / 2;
  player.y = (gameCanvas.canvas.height - player.height) / 2;

  //Init obstacles
  const enemy1 = {
    color: "#ef4565",
    x: 100,
    y: -100,
    width: 50,
    height: 100,
    ySpeed: 200, //pixel/s
  };

  const enemy2 = {
    color: "#ef4565",
    x: 400,
    y: -40,
    width: 90,
    height: 40,
    ySpeed: 300, //pixel/s
  };
  const enemy3 = {
    color: "#ef4565",
    x: 600,
    y: -200,
    width: 40,
    height: 200,
    ySpeed: 350, //pixel/s
  };

  obstacles = [enemy1, enemy2, enemy3];

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
  player.x = (gameCanvas.canvas.width - player.width) / 2;
  player.y = (gameCanvas.canvas.height - player.height) / 2;

  //Init obstacles
  const enemy1 = {
    color: "#ef4565",
    x: 100,
    y: -100,
    width: 50,
    height: 100,
    ySpeed: 200, //pixel/s
  };

  const enemy2 = {
    color: "#ef4565",
    x: 400,
    y: -40,
    width: 90,
    height: 40,
    ySpeed: 300, //pixel/s
  };
  const enemy3 = {
    color: "#ef4565",
    x: 600,
    y: -200,
    width: 40,
    height: 200,
    ySpeed: 350, //pixel/s
  };

  obstacles = [enemy1, enemy2, enemy3];

  //Reset movement
  movement.left = movement.right = movement.up = movement.down = false;
}

//4. DRAW
function drawPlayer() {
  const { ctx } = gameCanvas;

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemy() {
  const { ctx } = gameCanvas;

  obstacles.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
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
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function updateEnemy(dt) {
  const { canvas } = gameCanvas;

  obstacles.forEach((enemy) => {
    enemy.y += enemy.ySpeed * dt;
    if (enemy.y >= canvas.height) enemy.y = -enemy.height;
  });
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
  obstacles.forEach((enemy) => {
    if (checkAABBCollision(player, enemy)) gameCanvas.state = STATE.GAME_OVER;
  });
}

//Check AABB Collision condition
function checkAABBCollision(A, B) {
  const [leftA, rightA, topA, bottomA] = [
    A.x,
    A.x + A.width,
    A.y,
    A.y + A.height,
  ];
  const [leftB, rightB, topB, bottomB] = [
    B.x,
    B.x + B.width,
    B.y,
    B.y + B.height,
  ];

  if (leftA < rightB && rightA > leftB && topA < bottomB && bottomA > topB)
    return true;
  return false;
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
