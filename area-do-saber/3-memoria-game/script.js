// Espera o site carregar todo antes de rodar o jogo
document.addEventListener("DOMContentLoaded", () => {

  // Pega os elementos do HTML
  const cardBoard = document.querySelector("#cardboard"); // tabuleiro onde vão as cartas
  const scoreElement = document.querySelector("#score"); // pontuação
  const messageElement = document.querySelector("#message"); // mensagem de parabéns
  const restartBtn = document.querySelector("#restart-btn"); // botão de reiniciar

  // Lista com as imagens das cartas (só frente, depois duplica)
  const imgs = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"];

  // Variáveis de controle do jogo
  let firstCard = null; // primeira carta virada
  let secondCard = null; // segunda carta virada
  let lockCards = false; // trava o clique enquanto as cartas tão sendo comparadas
  let score = 0; // pontuação inicial
  let totalMatches = 0; // quantos pares já foram achados

  // Função que embaralha as cartas (shuffle = embaralhar)
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5); // sorteio aleatório
  }

  // Cria as cartas no tabuleiro
  function createCards() {
    const cards = shuffle([...imgs, ...imgs]); // duplica e embaralha as imagens
    let cardHTML = "";

    // Cria o HTML das cartas
    cards.forEach(img => {
      cardHTML += `
        <div class="memory-card" data-card="${img}">
          <img class="front-face" src="img/${img}" alt="Carta Frente" />
          <img class="back-face" src="img/tras.png" alt="Carta Verso" />
        </div>`;
    });

    // Coloca as cartas no tabuleiro
    cardBoard.innerHTML = cardHTML;

    // Adiciona o clique em todas as cartas
    document.querySelectorAll(".memory-card").forEach(card =>
      card.addEventListener("click", flipCard)
    );

    // Reinicia contagem de pares e variáveis
    totalMatches = 0;
    resetCards();
  }

  // Função que vira uma carta
  function flipCard() {
    // Se já tiver travado, ou clicou na mesma carta, ou já foi combinada, ignora
    if (lockCards || this === firstCard || this.classList.contains("matched")) return;

    this.classList.add("flip"); // vira a carta

    if (!firstCard) {
      firstCard = this; // se não tem nenhuma carta virada ainda
      return;
    }

    // Segunda carta virada
    secondCard = this;
    lockCards = true; // trava enquanto verifica

    checkForMatch(); // verifica se formou par
  }

  // Verifica se as duas cartas são iguais
  function checkForMatch() {
    const isMatch = firstCard.dataset.card === secondCard.dataset.card;
    if (isMatch) {
      disableCards(); // se for par
    } else {
      unflipCards(); // se não for, desvira
    }
  }

  // Desativa o clique nas cartas que formaram par
  function disableCards() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    updateScore(10); // adiciona 10 pontos
    totalMatches++; // conta um par encontrado

    // Depois de um tempo, reseta as variáveis
    setTimeout(() => {
      resetCards();

      // Se encontrou todos os pares, mostra parabéns
      const totalPairs = imgs.length;
      if (totalMatches === totalPairs) {
        messageElement.textContent = "🎉 Parabéns! Você encontrou todos os pares!";
      }
    }, 500); // espera meio segundo pra dar tempo de ver
  }

  // Desvira as cartas se forem diferentes
  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetCards(); // limpa variáveis
    }, 1000); // espera 1 segundo antes de desvirar
  }

  // Reseta as cartas viradas e a trava
  function resetCards() {
    [firstCard, secondCard, lockCards] = [null, null, false];
  }

  // Atualiza o placar
  function updateScore(points) {
    score += points;
    scoreElement.textContent = `Pontuação: ${score}`;
  }

  // Reinicia o jogo quando clica no botão
  function restartGame() {
    score = 0;
    scoreElement.textContent = "Pontuação: 0";
    messageElement.textContent = "";
    createCards(); // recria as cartas embaralhadas
  }

  // Escuta o clique no botão de reiniciar
  restartBtn.addEventListener("click", restartGame);

  // Quando o site carregar, inicia o jogo
  createCards();
  updateScore(0);
});
