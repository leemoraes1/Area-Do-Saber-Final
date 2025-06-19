const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
const totalBoxes = canvas.width / box;

let snake = [];
let food = {};
let direction = "";
let game;
let score = 0;

function startGame() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
  score = 0;

  createFood();
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("parabens").style.display = "none";

  clearInterval(game);
  game = setInterval(draw, 100);
}

function createFood() {
  food = {
    x: Math.floor(Math.random() * totalBoxes) * box,
    y: Math.floor(Math.random() * totalBoxes) * box
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#673ab7" : "#9575cd";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "#ff6f61";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;

  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    collision(headX, headY, snake)
  ) {
    clearInterval(game);
    document.getElementById("gameOver").style.display = "block";
    return;
  }

  let newHead = { x: headX, y: headY };

  if (headX === food.x && headY === food.y) {
    score++;
    createFood();

    if (score === 10) {
      clearInterval(game);
      document.getElementById("parabens").style.display = "block";
    }
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function collision(x, y, array) {
  return array.some(segment => segment.x === x && segment.y === y);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});
