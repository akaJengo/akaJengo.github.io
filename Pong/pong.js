var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height/2;
var dx = 3;
var dy = -3;
var ballRadius = 10;

// left player paddle
var leftPaddleHeight = 90;
var leftPaddleWidth = 15;
var leftPaddleX = 5;
var leftPaddleY = canvas.height / 2 - leftPaddleHeight / 2;

// Right player paddle
var rightPaddleHeight = 90;
var rightPaddleWidth = 15;
var rightPaddleX = canvas.width - (rightPaddleWidth + 5);
var rightPaddleY = canvas.height / 2 - rightPaddleHeight / 2;

// boolean to handle pressed keys
var leftUpPressed = false;
var leftDownPressed = false;
var rightUpPressed = false;
var rightDownPressed = false;

var leftScore = 0;
var rightScore = 0;


var leftTrain = [];
var ballX = []; 
var ballY = []; 
var starG = true; 

function keyDownHandler(e) {
    if(e.keyCode == 83) {
        leftUpPressed = true;
    }
    else if (e.keyCode == 90) {
        leftDownPressed = true;
    }
    if (e.keyCode == 38) {
      rightUpPressed = true;
    }
    else if (e.keyCode == 40) {
      rightDownPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 83) {
        leftUpPressed = false;
    }
    else if (e.keyCode == 90) {
        leftDownPressed = false;
    }
    if (e.keyCode == 38) {
      rightUpPressed = false;
    }
    else if (e.keyCode == 40) {
      rightDownPressed = false;
    }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function drawScores() {
  ctx.font = "80px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(leftScore, (canvas.width / 2) - 80, 80);
  ctx.fillText(rightScore, (canvas.width / 2) + 40, 80);
}

function collisionsWithLeftPaddle() {
    if ((x - ballRadius) <= 5 + leftPaddleWidth) {
      if (y > leftPaddleY && y < leftPaddleY + leftPaddleHeight)
        dx = -dx;
      else if ((x - ballRadius) <= 0) {
        rightScore++;
        //alert("Game Over");
        x = canvas.width / 2;
        y = canvas.height / 2;
        dx = -dx;
        dy = -dy;
//         document.location.reload();
      }
    }
}

function collisionsWithRightPaddle() {
  if ((x + ballRadius) >= canvas.width - (rightPaddleWidth + 5)) {
    if (y > rightPaddleY && y < rightPaddleY + rightPaddleHeight)
      dx = -dx;
    else if (x + ballRadius >= canvas.width) {
      leftScore++;
      //alert("Game Over");
      x = canvas.width / 2;
      y = canvas.height / 2;
      dx = -dx;
      dy = -dy;
      //document.location.reload();
    }
  }
}

function computeCollisionsWithWallsAndPaddle() {
  collisionsWithLeftPaddle();
  collisionsWithRightPaddle();
  if (((y - ballRadius) <= 0) || ((y + ballRadius) >= canvas.height)) {
    dy = -dy;
  }
}

function drawLeftPaddle() {
  ctx.beginPath();
  ctx.rect(leftPaddleX, leftPaddleY, leftPaddleWidth, leftPaddleHeight);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
  if (leftDownPressed && leftPaddleY < canvas.height - leftPaddleHeight) {
    leftPaddleY += 7;
    leftTrain.push(1); 
  }
  else if (leftUpPressed && leftPaddleY > 0) {
    leftPaddleY -= 7;
    leftTrain.push(-1); 
  }
  else {
    leftTrain.push(0); 
  }
}

function drawRightPaddle() {
  ctx.beginPath();
  ctx.rect(rightPaddleX, rightPaddleY, rightPaddleWidth, rightPaddleHeight);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
  if (rightDownPressed && rightPaddleY < canvas.height - rightPaddleHeight) {
    rightPaddleY += 7;
  }
  else if (rightUpPressed && rightPaddleY > 0) {
    rightPaddleY -= 7;
  }
}

function drawScene() {
  ctx.beginPath();
  ctx.rect(canvas.width / 2 - 1, 0, 3, canvas.height);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScores();
  drawScene();
  drawLeftPaddle();
  drawRightPaddle();
  drawBall();
  computeCollisionsWithWallsAndPaddle();
  x += dx;
  y += dy;
  ballX.push(x); 
  ballY.push(y);
  document.getElementById("yVal").innerHTML = y;
  document.getElementById("xVal").innerHTML = x;
  document.getElementById("paddleVal").innerHTML = leftTrain[leftTrain.length - 1];
}

function press(e) {
  if(e.keyCode == 86){
    starG = true; 
  }
  if(e.keyCode == 32){
    starG = false; 
  }
}

function mainLoop(){
  if(starG == true){
    draw();  
  }
  else if(starG == false){
    createModel(); 
  }
}

setInterval(mainLoop, 10);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("keypress", press);

function run(){

  const dataTensor = tf.tensor3d([[ballY, ballX, leftTrain]]); 
  console.log(dataTensor);

  const model = createModel();  
  
}

function createModel(){
  const model = tf.sequential(); 

  model.add(tf.layers.dense(
    {inputShape: [3], 
      units: 5, 
      activation: 'sigmoid'})); 

  model.add(tf.layers.dense(
    {units: 1, 
      activation: 'softmax'})); 
    
  return model; 
}

