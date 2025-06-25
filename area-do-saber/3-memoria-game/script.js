document.addEventListener("DOMContentLoaded", () => {
  const cardBoard = document.querySelector("#cardboard");
  const scoreElement = document.querySelector("#score");
  const messageElement = document.querySelector("#message");
  const restartBtn = document.querySelector("#restart-btn");

  const imgs = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"];

  let firstCard = null;
  let secondCard = null;
  let lockCards = false;
  let score = 0;
  let totalMatches = 0;

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function createCards() {
    const cards = shuffle([...imgs, ...imgs]); // duplica imagens
    let cardHTML = "";

    cards.forEach(img => {
      cardHTML += `
        <div class="memory-card" data-card="${img}">
          <img class="front-face" src="img/${img}" alt="Carta Frente" />
          <img class="back-face" src="img/tras.png" alt="Carta Verso" />
        </div>`;
    });

    cardBoard.innerHTML = cardHTML;
    document.querySelectorAll(".memory-card").forEach(card =>
      card.addEventListener("click", flipCard)
    );
    totalMatches = 0;
    resetCards();
  }

  function flipCard() {
    if (lockCards || this === firstCard || this.classList.contains("matched")) return;

    this.classList.add("flip");

    if (!firstCard) {
      firstCard = this;
      return;
    }

    secondCard = this;
    lockCards = true;
    checkForMatch();
  }

  function checkForMatch() {
    const isMatch = firstCard.dataset.card === secondCard.dataset.card;
    if (isMatch) {
      disableCards();
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    updateScore(10);
    totalMatches++;

    setTimeout(() => {
      resetCards();

      const totalPairs = imgs.length;
      if (totalMatches === totalPairs) {
        messageElement.textContent = "🎉 Parabéns! Você encontrou todos os pares!";
      }
    }, 500); // tempo para garantir que a virada finalize
  }

  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetCards();
    }, 1000); // tempo maior para mostrar as cartas antes de desvirar
  }

  function resetCards() {
    [firstCard, secondCard, lockCards] = [null, null, false];
  }

  function updateScore(points) {
    score += points;
    scoreElement.textContent = `Pontuação: ${score}`;
  }

  function restartGame() {
    score = 0;
    scoreElement.textContent = "Pontuação: 0";
    messageElement.textContent = "";
    createCards();
  }

  restartBtn.addEventListener("click", restartGame);

  // Inicialização do jogo
  createCards();
  updateScore(0);
});
