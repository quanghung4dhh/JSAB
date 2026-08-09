//Get the canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// console.log(ctx)

//Draw rectangle (fill)
// ctx.fillStyle = "rgba(61, 169, 252, 0.9)";
// ctx.fillRect(30, 30, 100, 100);
// ctx.fillStyle = "red";
// ctx.fillRect(950, 590, 100, 100);

//Draw rectangle (stroke)
ctx.strokeStyle = "rgba(61, 169, 252, 1)";
ctx.lineWidth = "2";
ctx.strokeRect(30, 30, 100, 100);

ctx.strokeStyle = "red";
ctx.lineWidth = "2";
ctx.strokeRect(950, 590, 100, 100);