// 1. STATE GAME

// AUDIO
const audio = new Audio("./audio/Barracuda.mp3");

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
    this.active = true;
  }
  update(dt) {
    if (this.type === "falling") {
      this.y += this.speed * dt;
      if (this.y >= gameCanvas.canvas.height) this.active = false;
    } else if (this.type === "passing") {
      this.x += this.speed * dt;
      if (this.x >= gameCanvas.canvas.width) this.active = false;
    }
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// 1.2 PLAYER CLASS
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

let player = new Player(0, 0, 20, 20, 400, "#3da9fc");

// LOAD LEVEL
let currentLevel = null;
let currentEventIdx = 0;

async function loadLevel() {
  try {
    currentLevel = await (await fetch("./levels/barracuda.json")).json();
    currentEventIdx = 0;
  } catch (err) {
    console.error("Load level fail: ", err);
  }
}

// 2. GAME INIT

async function init() {
  //Init Canvas
  gameCanvas.canvas = document.getElementById("canvas");
  gameCanvas.ctx = gameCanvas.canvas.getContext("2d");

  //Init player object
  player.x = (gameCanvas.canvas.width - player.width) / 2;
  player.y = (gameCanvas.canvas.height - player.height) / 2;

  //Load level
  await loadLevel();

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
    if (state === STATE.PAUSE) {
      event.preventDefault();
      gameCanvas.state = STATE.PLAYING;
      audio.play();
    } else if (state === STATE.GAME_OVER || state === STATE.MENU) {
      event.preventDefault();
      resetGame();
      gameCanvas.state = STATE.PLAYING;
    }
  } else if (event.key === "Escape" && state === STATE.PLAYING) {
    gameCanvas.state = STATE.PAUSE;
    audio.pause();
  }
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

  //Reset obstacles
  obstacles = [];

  //Reset movement
  movement.left = movement.right = movement.up = movement.down = false;

  //Reset audio
  currentEventIdx = 0;
  audio.currentTime = 0;
  audio.play();
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

// PROCESS EVENT OBSTACLE SPAWN

function handleEvent(event) {
  const obstacle = new Obstacle(
    event.x,
    event.y,
    event.width,
    event.height,
    event.speed,
    event.color,
    event.type,
  );
  console.log(audio.currentTime);
  obstacles.push(obstacle);
}

function update(dt) {
  if (gameCanvas.state !== STATE.PLAYING) return;
  player.update(dt);

  //Add obstacle from event
  while (
    currentLevel &&
    currentEventIdx < currentLevel.events.length &&
    audio.currentTime >= currentLevel.events[currentEventIdx].time
  ) {
    const eventInfo = currentLevel.events[currentEventIdx];
    handleEvent(eventInfo);
    currentEventIdx++;
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update(dt);

    //Check Collision
    checkCollision(player, obstacles[i]);
    if (gameCanvas.state !== STATE.PLAYING) break;

    //Delete inactive obstacles
    if (!obstacles[i].active) obstacles.splice(i, 1);
  }
}

// 6. Check collision

function checkCollision(player, enemy) {
  if (checkAABBCollision(player, enemy)) {
    gameCanvas.state = STATE.GAME_OVER;
    audio.pause();
  }
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
