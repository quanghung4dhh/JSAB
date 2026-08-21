// 1. STATE GAME

const gameState = {
  canvas: null,
  ctx: null,
  player: {
    x: 10,
    y: 10,
    size: 20,
    speed: 300, //(pixel/s)
  },
  movement: {
    up: false,
    down: false,
    left: false,
    right: false,
  },
  KEY: {
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
  },
  lastTime: 0,
};

// 2. GAME INIT
function init() {
  //Khởi tạo canvas và ctx
  gameState.canvas = document.getElementById("canvas");
  gameState.ctx = gameState.canvas.getContext("2d");

  //Gắn sự kiện ấn phím
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  //Tạo game loop
  gameState.lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

// 3. EVENT KEY HANDLER
function handleKeyDown(event) {
  const key = gameState.KEY[event.key];
  if (key) gameState.movement[key] = true;
}

function handleKeyUp(event) {
  const key = gameState.KEY[event.key];
  if (key) gameState.movement[key] = false;
}

// 4. DRAW FUNCTION
function draw() {
  const { ctx, player } = gameState;
  ctx.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);
  ctx.fillStyle = "#ef4565";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// 5. UPDATE FUNCTION
function update(dt) {
  const { player, movement, canvas } = gameState;

  //Update vị trí player
  if (movement.up) player.y -= player.speed * dt;
  if (movement.down) player.y += player.speed * dt;
  if (movement.left) player.x -= player.speed * dt;
  if (movement.right) player.x += player.speed * dt;

  //Giới hạn vị trí player
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

// 6. GAMELOOP
function gameLoop(timeStamp) {
  const dt = (timeStamp - gameState.lastTime) / 1000;
  gameState.lastTime = timeStamp;
  update(dt);
  draw();
  requestAnimationFrame(gameLoop);
}

init();

