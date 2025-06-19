// Seleção do canvas onde o jogo será desenhado
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variáveis do jogo
let stack = []; // Pilha onde os blocos caem
let currentBlock; // O bloco atual que está caindo
let gameOver = false; // Controle do status do jogo
let fallSpeed = 1; // Velocidade da queda dos blocos
let moveSpeed = 50; // Velocidade de movimento do bloco
const colors = ["#20c4cb", "#ff6f61", "#9c27b0", "#ff9800", "#673ab7", "#ffd600"]; // Cores dos blocos
const gameOverMessage = document.getElementById("gameOverMessage"); // Mensagem de "Game Over"
const congratulationsMessage = document.getElementById("parabens"); // Mensagem de "Parabéns"

// Função que inicia o jogo
function StartGame() {
    stack = []; // Reseta a pilha
    gameOver = false; // Reseta o status do jogo
    gameOverMessage.style.display = "none";
    congratulationsMessage.style.display = "none";
    
    // Primeiro bloco fixo na base
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

// Função que cria um novo bloco com tamanho aleatório
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

// Função que atualiza o jogo
function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha todos os blocos empilhados
    for (let block of stack) {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
    }
    
    // Movimento do bloco caindo
    if (currentBlock) {
        currentBlock.y += fallSpeed;
        let lastBlock = stack[stack.length - 1];

        // Se o bloco colidir corretamente com o último
        if (currentBlock.y + currentBlock.height >= lastBlock.y) {
            if (
                currentBlock.x + currentBlock.width < lastBlock.x ||
                currentBlock.x > lastBlock.x + lastBlock.width
            ) {
                endGame(); // Se não estiver alinhado, termina o jogo
                return;
            }
            currentBlock.y = lastBlock.y - currentBlock.height;
            stack.push({ ...currentBlock }); // Adiciona o bloco na pilha
            spawnBlock();
        }

        ctx.fillStyle = currentBlock.color;
        ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);
    }
    
    if (stack.length >= 10) winGame();
    requestAnimationFrame(update);
}

// Função que finaliza o jogo
function endGame() {
    gameOver = true;
    gameOverMessage.style.display = "block";
}

// Função que mostra a mensagem de vitória
function winGame() {
    gameOver = true;
    congratulationsMessage.style.display = "block";
}

// Controles para mover o bloco
window.addEventListener("keydown", (e) => {
    if (!currentBlock || gameOver) return;
    if (e.code === "ArrowLeft" && currentBlock.x > 0) {
        currentBlock.x -= moveSpeed;
    } else if (e.code === "ArrowRight" && currentBlock.x + currentBlock.width < canvas.width) {
        currentBlock.x += moveSpeed;
    }
});

// Inicia o jogo
StartGame();
