export function ModalErro({ isAberto, mensagem, onFechar, subtexto = "Ocorreu um erro durante a operação." }) {
  if (!isAberto) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-[1px]"
      onClick={onFechar}
    >
      <div 
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center relative"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          {mensagem}
        </h2>
        <p className="text-sm text-gray-500">
          {subtexto}
        </p>
      </div>
    </div>
  );
}