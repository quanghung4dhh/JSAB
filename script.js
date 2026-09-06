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

let obstacles = []; //Obstacle array

// 1.1 OBSTACLE CLASS

class Obstacle {
  constructor(x, y, width, height, speed, color, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
    this.type = type;
  }
  update(dt) {
    if (this.type === "falling") {
      if (this.y >= gameCanvas.canvas.height) return "out";
      this.y += this.speed * dt;
    } else if (this.type === "passing") {
      if (this.x >= gameCanvas.canvas.width) return "out";
      this.x += this.speed * dt;
    }
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// 1.2 PLAYER CLASS
let player;
class Player {
  constructor(x, y, width, height, speed, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
  }
  update(dt) {
    if (movement.left) this.x -= this.speed * dt;
    if (movement.right) this.x += this.speed * dt;
    if (movement.up) this.y -= this.speed * dt;
    if (movement.down) this.y += this.speed * dt;

    //Limit the player position
    this.x = Math.max(
      0,
      Math.min(gameCanvas.canvas.width - this.width, this.x),
    );
    this.y = Math.max(
      0,
      Math.min(gameCanvas.canvas.height - this.height, this.y),
    );
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// 2. GAME INIT

function init() {
  //Init Canvas
  gameCanvas.canvas = document.getElementById("canvas");
  gameCanvas.ctx = gameCanvas.canvas.getContext("2d");

  //Init player object
  player = new Player(0, 0, 20, 20, 400, "#3da9fc");
  player.x = (gameCanvas.canvas.width - player.width) / 2;
  player.y = (gameCanvas.canvas.height - player.height) / 2;

  //Init obstacles
  const enemy1 = new Obstacle(100, -100, 50, 100, 200, "#ef4565", "falling");
  const enemy2 = new Obstacle(-90, 100, 90, 40, 300, "#ef4565", "passing");
  const enemy3 = new Obstacle(600, -200, 40, 200, 350, "#ef4565", "falling");

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
  const enemy1 = new Obstacle(100, -100, 50, 100, 200, "#ef4565", "falling");
  const enemy2 = new Obstacle(-90, 100, 90, 40, 100, "#ef4565", "passing");
  const enemy3 = new Obstacle(600, -200, 40, 200, 250, "#ef4565", "falling");

  obstacles = [enemy1, enemy2, enemy3];

  //Reset movement
  movement.left = movement.right = movement.up = movement.down = false;
}

//4. DRAW

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
  const { ctx, canvas } = gameCanvas;

  //Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Draw based on game state
  if (gameCanvas.state !== STATE.MENU) {
    player.draw(ctx);
    obstacles.forEach((enemy) => enemy.draw(ctx));
  }
  if (gameCanvas.state !== STATE.PLAYING) {
    drawUI();
  }
}

// 5. UPDATE

function update(dt) {
  if (gameCanvas.state !== STATE.PLAYING) return;
  player.update(dt);
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const isOut = obstacles[i].update(dt) === "out";
    if (isOut) obstacles.splice(i, 1);
  }

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
