const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let box = 20;
let totalBoxes;

let snake = [];
let food = {};
let direction = "";
let game;
let score = 0;

// Função para ajustar o tamanho do canvas de forma responsiva
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8;  // 80% da largura da tela
  canvas.height = window.innerHeight * 0.6;  // 60% da altura da tela

  totalBoxes = Math.floor(canvas.width / box);
}

resizeCanvas();  // Chama a função uma vez no início

// Recalcula o tamanho quando a janela é redimensionada
window.addEventListener('resize', resizeCanvas);

function startGame() {
  snake = [{ x: Math.floor(totalBoxes / 2) * box, y: Math.floor(totalBoxes / 2) * box }];
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

  // Desenha a cobrinha
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#673ab7" : "#9575cd";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Desenha o alimento
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

// Controle por teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Controle por toque (mobile)
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function (e) {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener("touchmove", function (e) {
  if (!touchStartX || !touchStartY) return;

  const touch = e.touches[0];
  const touchEndX = touch.clientX;
  const touchEndY = touch.clientY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && direction !== "LEFT") direction = "RIGHT";
    else if (diffX < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (diffY > 0 && direction !== "UP") direction = "DOWN";
    else if (diffY < 0 && direction !== "DOWN") direction = "UP";
  }

  touchStartX = 0;
  touchStartY = 0;
});

// Evita scroll no canvas em celulares
document.body.addEventListener('touchstart', function(e) {
  if (e.target === canvas) e.preventDefault();
}, { passive: false });

document.body.addEventListener('touchmove', function(e) {
  if (e.target === canvas) e.preventDefault();
}, { passive: false });
