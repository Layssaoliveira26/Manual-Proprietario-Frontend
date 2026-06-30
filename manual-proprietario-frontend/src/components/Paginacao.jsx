export function Paginacao({ 
  paginaAtual, 
  totalPaginas, 
  onMudarPagina 
}) {
  if (totalPaginas <= 1) return null;

  const renderizarNumeros = () => {
    const numeros = [];
    const intervalo = 2; // mostra 2 números antes e depois da página atual

    let inicio = Math.max(1, paginaAtual - intervalo);
    let fim = Math.min(totalPaginas, paginaAtual + intervalo);

    // Botão anterior
    if (paginaAtual > 1) {
      numeros.push(
        <button
          key="anterior"
          onClick={() => onMudarPagina(paginaAtual - 1)}
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          ‹
        </button>
      );
    }

    // Primeira página (se não estiver no intervalo)
    if (inicio > 1) {
      numeros.push(
        <button
          key={1}
          onClick={() => onMudarPagina(1)}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          1
        </button>
      );
      if (inicio > 2) {
        numeros.push(<span key="dots1" className="px-2 py-1">...</span>);
      }
    }

    // Números do intervalo
    for (let i = inicio; i <= fim; i++) {
      numeros.push(
        <button
          key={i}
          onClick={() => onMudarPagina(i)}
          className={`px-3 py-1 rounded transition-colors ${
            i === paginaAtual
              ? 'bg-[#C15A3E] text-white border border-[#C15A3E]'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Última página (se não estiver no intervalo)
    if (fim < totalPaginas) {
      if (fim < totalPaginas - 1) {
        numeros.push(<span key="dots2" className="px-2 py-1">...</span>);
      }
      numeros.push(
        <button
          key={totalPaginas}
          onClick={() => onMudarPagina(totalPaginas)}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          {totalPaginas}
        </button>
      );
    }

    // Botão próximo
    if (paginaAtual < totalPaginas) {
      numeros.push(
        <button
          key="proximo"
          onClick={() => onMudarPagina(paginaAtual + 1)}
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          ›
        </button>
      );
    }

    return numeros;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6 mb-6">
      {renderizarNumeros()}
    </div>
  );
}