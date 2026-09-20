// 0. CLASS
// 0.1 OBSTACLE CLASS

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

// 0.2 PLAYER CLASS
class Player {
  constructor(x, y, width, height, speed, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
    this.direction = "left";
    this.dashSpeed = 2000; //pixel/s
    this.invincible = false;
  }
  update(dt) {
    this.invincible = false;

    //Handle dash cooldown
    if (DASH.dashCD >= 0) DASH.dashCD = Math.max(0, DASH.dashCD - dt);

    //Handle Dash movement
    if (DASH.dash) {
      this.invincible = true;
      switch (this.direction) {
        case "left": {
          this.x -= this.dashSpeed * dt;
          break;
        }
        case "right": {
          this.x += this.dashSpeed * dt;
          break;
        }
        case "down": {
          this.y += this.dashSpeed * dt;
          break;
        }
        case "up": {
          this.y -= this.dashSpeed * dt;
          break;
        }
      }
      // DASH.dash = false
      if (DASH.dashTime >= 0) DASH.dashTime = Math.max(0, DASH.dashTime - dt);

      if (DASH.dashTime <= 0) DASH.dash = false;
    }

    if (movement.left) {
      this.x -= this.speed * dt;
      this.direction = "left";
    }

    if (movement.right) {
      this.x += this.speed * dt;
      this.direction = "right";
    }

    if (movement.up) {
      this.y -= this.speed * dt;
      this.direction = "up";
    }

    if (movement.down) {
      this.y += this.speed * dt;
      this.direction = "down";
    }

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

// 0.3 Player particle class
class PlayerParticle {
  constructor(x, y, vx, vy, life, maxDuration, size, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxDuration = maxDuration;
    this.size = size;
    this.color = color;
    this.active = true;
  }

  update(dt) {
    if (life <= 0) {
      this.active = false;
      return;
    }

    x += vx * dt;
    y += vy * dt;
    life -= dt;
  }

  draw() {
    const { ctx } = gameCanvas;

    //Calculate the opacity of the paricle
    const opacity = this.life / this.maxDuration;
    ctx.globalAlpha = opacity;

    //Draw the particle
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);

    //Reset the opacity of the context
    ctx.globalAlpha = 1;
  }
}

// 0.4 Level System Class
class LevelSystem {
  constructor(filePath) {
    this.filePath = filePath;
  }

  //Load level Json from json file
  async loadLevel() {
    this.currentLevel = await (await fetch(this.filePath)).json();
    this.currentEventIdx = 0;
    this.bpm = this.currentLevel.bpm;
    this.offset = this.currentLevel.offset;
    this.events = this.currentLevel.events;
    this.audio = new Audio(this.currentLevel.song);
  }

  //Using While loop to load Event
  processEvents() {
    const spawned = [];
    //Add obstacle from event
    while (
      this.currentLevel &&
      this.currentEventIdx < this.currentLevel.events.length &&
      this.audio.currentTime >=
        (this.currentLevel.events[this.currentEventIdx].beat * 60) / this.bpm +
          this.offset
    ) {
      const eventInfo = this.currentLevel.events[this.currentEventIdx];
      spawned.push(eventInfo);
      this.currentEventIdx++;
    }
    return spawned;
  }

  //Reset audio
  reset() {
    this.currentEventIdx = 0;
    this.audio.currentTime = 0;
  }
}

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

//Dash management
const DASH = {
  dash: false,
  dashCD: 0.2,
  dashTime: 0,
  dashMaxTime: 0.1,
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

let playerParticles = []; //PLayer particle array

const player = new Player(0, 0, 20, 20, 400, "#3da9fc"); // init player object

// LOAD LEVEL
const levelSystem = new LevelSystem("./levels/barracuda.json");

// Screen shaking
const screenShake = { intensity: 0, duration: 0 };

// 2. GAME INIT

async function init() {
  //Init Canvas
  gameCanvas.canvas = document.getElementById("canvas");
  gameCanvas.ctx = gameCanvas.canvas.getContext("2d");

  //Init player object
  player.x = (gameCanvas.canvas.width - player.width) / 2;
  player.y = (gameCanvas.canvas.height - player.height) / 2;

  //Load level
  await levelSystem.loadLevel();

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

  //Handle Key Dash
  handleKeyDash(event);
}

function handleStateKey(event) {
  let { state } = gameCanvas;
  let audio = levelSystem.audio;

  if (event.key === "Enter" || event.key === " ") {
    if (state === STATE.PAUSE) {
      event.preventDefault();
      gameCanvas.state = STATE.PLAYING;
      audio.play();
    } else if (state === STATE.GAME_OVER || state === STATE.MENU) {
      event.preventDefault();
      resetGame();
      gameCanvas.state = STATE.PLAYING;
      audio.play();
    }
  } else if (event.key === "Escape" && state === STATE.PLAYING) {
    gameCanvas.state = STATE.PAUSE;
    audio.pause();
  }
}

function handleKeyDash(event) {
  if (
    gameCanvas.state === STATE.PLAYING &&
    event.key === " " &&
    !event.repeat &&
    DASH.dashCD <= 0
  ) {
    DASH.dash = true;
    DASH.dashCD = 0.2;
    DASH.dashTime = DASH.dashMaxTime;
  }
}

function handleKeyUp(event) {
  //Handle Movement
  const key = KEY[event.key];
  if (key) movement[key] = false;

  //Handle Dash
  if (event.key === " ") DASH.dash = false;
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
  levelSystem.reset();
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

// Screen Shaking function

function screenShaking(dt) {
  const { ctx } = gameCanvas;

  ctx.save();
  if (screenShake.duration <= 0) return;

  const dx = (Math.random() - 0.5) * 2 * screenShake.intensity;
  const dy = (Math.random() - 0.5) * 2 * screenShake.intensity;
  ctx.translate(dx, dy);
  screenShake.duration -= dt;
  screenShake.intensity *= 0.9;
}

function draw(dt) {
  const { ctx, canvas } = gameCanvas;

  // Screen Shaking

  screenShaking(dt);

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

  ctx.restore();
}

// 5. UPDATE

//Handle spawn array from Level System
function handleSpawn() {
  //Obtain new Events from Level System
  const newEvents = levelSystem.processEvents();

  // Process each event
  newEvents.forEach((event) => {
    if (event.category === "obstacle") {
      obstacles.push(
        new Obstacle(
          event.x,
          event.y,
          event.width,
          event.height,
          event.speed,
          event.color,
          event.type,
        ),
      );
    } else if (event.category === "shaking") {
      screenShake.intensity = event.intensity;
      screenShake.duration = event.duration;
    }
  });
}

function update(dt) {
  if (gameCanvas.state !== STATE.PLAYING) return;
  player.update(dt);

  handleSpawn();

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
  if (player.invincible) return;
  if (checkAABBCollision(player, enemy)) {
    gameCanvas.state = STATE.GAME_OVER;
    levelSystem.audio.pause();
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

  return leftA < rightB && rightA > leftB && topA < bottomB && bottomA > topB;
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
  draw(dt);

  //Loop
  requestAnimationFrame(gameLoop);
}

init();
