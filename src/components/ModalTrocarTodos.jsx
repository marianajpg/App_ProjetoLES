import React, { useState } from 'react';
import '../styles/ModalAutorizarTroca.css';

const ModalTrocarTodos = ({ pedido, onClose, onConfirm }) => {
  if (!pedido) return null;

  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h3 className="modal__title">Trocar Todos os Itens</h3>
          <button className="modal__close-btn" onClick={onClose} aria-label="Fechar modal">×</button>
        </header>
        <section className="modal__content">
          <p>Por favor, informe o motivo da troca de todos os itens do pedido.</p>
          <textarea
            className="reason-textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motivo da troca..."
          />
        </section>
        <footer className="modal__actions">
          <button className="modal__cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="modal__confirm-btn" onClick={handleConfirm} disabled={!reason}>Confirmar Troca</button>
        </footer>
      </div>
    </div>
  );
};

export default ModalTrocarTodos;
