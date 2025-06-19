// Seleciona os elementos DOM
const cardBoard = document.querySelector("#cardboard");
const scoreElement = document.querySelector("#score");
const messageElement = document.querySelector("#message");
const restartBtn = document.querySelector("#restart-btn");

// Imagens dos pares
const imgs = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"];

let firstCard = null;
let secondCard = null;
let lockCards = false;
let score = 0;

// Embaralhamento do array
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Cria as cartas na tela
function createCards() {
  const cards = shuffle([...imgs, ...imgs]);
  let cardHTML = "";

  cards.forEach(img => {
    cardHTML += `
      <div class="memory-card" data-card="${img}">
        <img class="front-face" src="img/${img}" alt="Carta Frente" />
        <img class="back-face" src="img/tras.png" alt="Carta Verso" />
      </div>`;
  });

  cardBoard.innerHTML = cardHTML;

  // Adiciona evento de clique a todas as cartas
  document.querySelectorAll(".memory-card").forEach(card =>
    card.addEventListener("click", flipCard)
  );
}

// Gira a carta
function flipCard() {
  if (lockCards || this === firstCard || this.classList.contains("matched")) return;

  this.classList.add("flip");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

// Verifica se houve acerto
function checkForMatch() {
  const isMatch = firstCard.dataset.card === secondCard.dataset.card;

  isMatch ? disableCards() : unflipCards();
}

// Desativa clique e mantém viradas
function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  updateScore(10);
  resetCards();

  // Checa se acabou o jogo
  if (document.querySelectorAll(".memory-card:not(.matched)").length === 0) {
    setTimeout(() => {
      messageElement.textContent = "🎉 Parabéns! Você venceu!";
    }, 500);
  }
}

// Desvira cartas erradas
function unflipCards() {
  lockCards = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetCards();
  }, 1000);
}

// Reseta variáveis temporárias
function resetCards() {
  [firstCard, secondCard, lockCards] = [null, null, false];
}

// Atualiza pontuação na tela
function updateScore(points) {
  score += points;
  scoreElement.textContent = `Pontuação: ${score}`;
}

// Reinicia o jogo
function restartGame() {
  score = 0;
  updateScore(0);
  messageElement.textContent = "";
  createCards();
}

// Início do jogo
restartBtn.addEventListener("click", restartGame);
createCards();
updateScore(0);
