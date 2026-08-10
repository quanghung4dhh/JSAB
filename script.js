//Get the canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Draw a line
// ctx.beginPath();
// ctx.moveTo(120, 60);
// ctx.lineTo(670, 199);
// ctx.strokeStyle = "#000";
// ctx.lineWidth = 3;
// ctx.stroke();

//Draw an arc
//ctx.arc(x, y, radius, startingAngle, endingAngle(rad), counterClockwise)
// ctx.arc(50, 50, 50, 1.5 * Math.PI, 0.5 * Math.PI, true);
// ctx.strokeStyle = "red";
// ctx.lineWidth = 3;
// ctx.stroke();

//Draw a triangle
// ctx.beginPath();
// ctx.moveTo(200, 500);
// ctx.lineTo(500, 500);
// ctx.lineTo(350, 300);
// ctx.strokeStyle = "#000";
// ctx.lineWidth = 3;
// ctx.closePath();
// ctx.stroke();

//Draw house

//Draw body
// ctx.fillStyle = "#3da9fc";
// ctx.fillRect(260, 250, 200, 200);

// //Draw roof
// ctx.beginPath();
// ctx.moveTo(250, 250);
// ctx.lineTo(470, 250);
// ctx.lineTo(360, 150);
// ctx.closePath();
// ctx.fillStyle = "#ef4565";
// ctx.fill();

// //Draw door
// ctx.fillStyle = "#90b4ce";
// ctx.fillRect(310, 360, 100, 90);

// //Draw window
// ctx.fillStyle = "#094067";
// ctx.fillRect(400, 300, 50, 50);

function drawHouse(x, y) {
  //House size
  const HOUSE_WIDTH = 200;
  const HOUSE_HEIGHT = 200;

  //Door size
  const DOOR_WIDTH = 100;
  const DOOR_HEIGHT = 90;

  //Window size
  const WINDOW_WIDTH = 50;
  const WINDOW_HEIGHT = 50;

  //Roof height
  const ROOF_HEIGHT = 100;

  //Draw body
  ctx.fillStyle = "#3da9fc";
  ctx.fillRect(x, y, HOUSE_WIDTH, HOUSE_HEIGHT);

  //Draw roof
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + HOUSE_WIDTH + 10, y);
  ctx.lineTo(x + HOUSE_WIDTH / 2, y - ROOF_HEIGHT);
  ctx.closePath();
  ctx.fillStyle = "#ef4565";
  ctx.fill();

  //Draw door
  ctx.fillStyle = "#90b4ce";
  ctx.fillRect(
    x + (HOUSE_WIDTH - DOOR_WIDTH) / 2,
    y + HOUSE_HEIGHT - DOOR_HEIGHT,
    DOOR_WIDTH,
    DOOR_HEIGHT,
  );

  //Draw window
  ctx.fillStyle = "#094067";
  ctx.fillRect(
    x - 10 - WINDOW_WIDTH + HOUSE_WIDTH,
    y + HOUSE_HEIGHT - DOOR_HEIGHT - WINDOW_HEIGHT - 10,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
  );
}

drawHouse(300, 500);
