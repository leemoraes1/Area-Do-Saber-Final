const tamanhoTabuleiro = 4;
let tabuleiro = [];
let jogoEncerrado = false;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tamanhoBloco = canvas.width / tamanhoTabuleiro;

document.addEventListener("keydown", controleTeclado);
document.getElementById("reiniciarBtn").addEventListener("click", reiniciarJogo);

iniciarJogo();

function iniciarJogo() {
  tabuleiro = Array.from({ length: tamanhoTabuleiro }, () => Array(tamanhoTabuleiro).fill(0));
  jogoEncerrado = false;
  document.getElementById("mensagemJogo").textContent = "";
  adicionarNovoBloco();
  adicionarNovoBloco();
  desenharTabuleiro();
}

function adicionarNovoBloco() {
  let posicoesVazias = [];
  for (let i = 0; i < tamanhoTabuleiro; i++) {
    for (let j = 0; j < tamanhoTabuleiro; j++) {
      if (tabuleiro[i][j] === 0) posicoesVazias.push({ x: i, y: j });
    }
  }

  if (posicoesVazias.length > 0) {
    let novaPosicao = posicoesVazias[Math.floor(Math.random() * posicoesVazias.length)];
    tabuleiro[novaPosicao.x][novaPosicao.y] = Math.random() < 0.9 ? 2 : 4;
  }
}

function desenharTabuleiro() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < tamanhoTabuleiro; i++) {
    for (let j = 0; j < tamanhoTabuleiro; j++) {
      desenharBloco(i, j, tabuleiro[i][j]);
    }
  }
}

function desenharBloco(x, y, valor) {
  ctx.fillStyle = valor === 0 ? "#cdc1b4" : "#f2b179";
  ctx.fillRect(y * tamanhoBloco, x * tamanhoBloco, tamanhoBloco - 5, tamanhoBloco - 5);

  if (valor !== 0) {
    ctx.fillStyle = "black";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(valor, y * tamanhoBloco + tamanhoBloco / 2, x * tamanhoBloco + tamanhoBloco / 2 + 10);
  }
}

function moverTabuleiro(direcao) {
  let matrizAntes = JSON.stringify(tabuleiro);

  if (direcao === "esquerda" || direcao === "direita") {
    for (let i = 0; i < tamanhoTabuleiro; i++) {
      let linha = tabuleiro[i].slice();
      if (direcao === "direita") linha.reverse();
      linha = moverEUnir(linha);
      if (direcao === "direita") linha.reverse();
      tabuleiro[i] = linha;
    }
  } else if (direcao === "cima" || direcao === "baixo") {
    for (let j = 0; j < tamanhoTabuleiro; j++) {
      let coluna = tabuleiro.map(row => row[j]);
      if (direcao === "baixo") coluna.reverse();
      coluna = moverEUnir(coluna);
      if (direcao === "baixo") coluna.reverse();
      for (let i = 0; i < tamanhoTabuleiro; i++) {
        tabuleiro[i][j] = coluna[i];
      }
    }
  }

  if (JSON.stringify(tabuleiro) !== matrizAntes) {
    adicionarNovoBloco();
    desenharTabuleiro();
    verificarFimDeJogo();
  }
}

function moverEUnir(linha) {
  linha = linha.filter(num => num !== 0);
  for (let i = 0; i < linha.length - 1; i++) {
    if (linha[i] === linha[i + 1]) {
      linha[i] *= 2;
      linha[i + 1] = 0;
      i++;
    }
  }
  linha = linha.filter(num => num !== 0);
  while (linha.length < tamanhoTabuleiro) linha.push(0);
  return linha;
}

function verificarFimDeJogo() {
  if (jogoEncerrado) return;

  for (let i = 0; i < tamanhoTabuleiro; i++) {
    for (let j = 0; j < tamanhoTabuleiro; j++) {
      if (tabuleiro[i][j] === 2048) {
        document.getElementById("mensagemJogo").textContent = "🎉 Parabéns! Você chegou ao 2048! 🎉";
        jogoEncerrado = true;
        return;
      }
    }
  }

  for (let i = 0; i < tamanhoTabuleiro; i++) {
    for (let j = 0; j < tamanhoTabuleiro; j++) {
      if (tabuleiro[i][j] === 0) return;
      if (j < tamanhoTabuleiro - 1 && tabuleiro[i][j] === tabuleiro[i][j + 1]) return;
      if (i < tamanhoTabuleiro - 1 && tabuleiro[i][j] === tabuleiro[i + 1][j]) return;
    }
  }

  document.getElementById("mensagemJogo").textContent = "💀 Game Over! 💀";
  jogoEncerrado = true;
}

function controleTeclado(event) {
  if (jogoEncerrado) return;

  const teclas = {
    ArrowUp: "cima",
    ArrowDown: "baixo",
    ArrowLeft: "esquerda",
    ArrowRight: "direita"
  };

  if (teclas[event.key]) moverTabuleiro(teclas[event.key]);
}

function reiniciarJogo() {
  iniciarJogo();
}
