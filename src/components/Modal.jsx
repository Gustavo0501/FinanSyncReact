import React from 'react';

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    // Overlay
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-opacity animate-fade-in"
    >
      {/* Contêiner do Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-secondary rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg transform transition-all animate-fade-in-down"
      >
        {/* Botão de Fechar (Opcional, mas recomendado) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-transform hover:scale-110"
          aria-label="Fechar modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {children}
      </div>
    </div>
  );
};

export default Modal;
