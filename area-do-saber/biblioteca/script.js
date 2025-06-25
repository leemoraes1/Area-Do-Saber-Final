function filtrar(faixa) {
  const livros = document.querySelectorAll('.livro');

  livros.forEach(livro => {
    if (faixa === 'todas' || livro.dataset.faixa === faixa) {
      livro.style.display = 'block';
    } else {
      livro.style.display = 'none';
    }
  });
}
