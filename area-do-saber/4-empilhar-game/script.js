const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let stack = [];
let currentBlock;
let gameOver = false;
let fallSpeed = 1;
let moveSpeed = 50;
const colors = ["#20c4cb", "#ff6f61", "#9c27b0", "#ff9800", "#673ab7", "#ffd600"];
const gameOverMessage = document.getElementById("gameOverMessage");
const congratulationsMessage = document.getElementById("parabens");

function StartGame() {
    stack = [];
    gameOver = false;
    gameOverMessage.style.display = "none";
    congratulationsMessage.style.display = "none";
    stack.push({
        x: (canvas.width - 100) / 2,
        y: canvas.height - 30,
        width: 100,
        height: 30,
        color: "#673ab7"
    });
    spawnBlock();
    requestAnimationFrame(update);
}

function spawnBlock() {
    let width = Math.floor(Math.random() * (150 - 50)) + 50;
    let color = colors[Math.floor(Math.random() * colors.length)];
    currentBlock = {
        x: (canvas.width - width) / 2,
        y: 0,
        width: width,
        height: 30,
        color: color
    };
}

function update() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let block of stack) {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
    }
    if (currentBlock) {
        currentBlock.y += fallSpeed;
        let lastBlock = stack[stack.length - 1];
        if (currentBlock.y + currentBlock.height >= lastBlock.y) {
            if (
                currentBlock.x + currentBlock.width < lastBlock.x ||
                currentBlock.x > lastBlock.x + lastBlock.width
            ) {
                endGame();
                return;
            }
            currentBlock.y = lastBlock.y - currentBlock.height;
            stack.push({ ...currentBlock });
            spawnBlock();
        }
        ctx.fillStyle = currentBlock.color;
        ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);
    }
    if (stack.length >= 10) winGame();
    requestAnimationFrame(update);
}

function endGame() {
    gameOver = true;
    gameOverMessage.style.display = "block";
}

function winGame() {
    gameOver = true;
    congratulationsMessage.style.display = "block";
}

window.addEventListener("keydown", (e) => {
    if (!currentBlock || gameOver) return;
    if (e.code === "ArrowLeft" && currentBlock.x > 0) {
        currentBlock.x -= moveSpeed;
    } else if (e.code === "ArrowRight" && currentBlock.x + currentBlock.width < canvas.width) {
        currentBlock.x += moveSpeed;
    }
});

StartGame();
