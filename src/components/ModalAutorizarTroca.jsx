import React from 'react';
import '../styles/ModalAutorizarTroca.css';

const ModalAutorizarTroca = ({ pedido, exchanges, onClose, onConfirm }) => {
  if (!pedido) return null;

  // Find the specific exchange related to this row
  const exchange = exchanges.find(ex => ex.id === pedido.exchangeId);
  const motivo = exchange ? exchange.motivo : 'Motivo não encontrado';

  const handleConfirm = () => {
    // The onConfirm prop will be handleAuthorizeExchange, which needs exchangeId and pedido.id
    onConfirm(pedido.exchangeId, pedido.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h3 className="modal__title">Autorizar Troca</h3>
          <button className="modal__close-btn" onClick={onClose} aria-label="Fechar modal">×</button>
        </header>
        <section className="modal__content">
          <p><strong>Motivo da Solicitação:</strong> {motivo}</p>
          <div className="items-list">
            {pedido.items.map(item => (
              <div key={item.id} className="item-details-row">
                <span className="item-title">{item.book.title}</span>
                <span className="item-quantity">Qtd: {item.quantity}</span>
                <span className="item-price">R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
          </div>
          <div className="exchange-total">
            <strong>Valor Total da Troca:</strong> R$ {pedido.total.toFixed(2).replace('.', ',')}
          </div>
        </section>
        <footer className="modal__actions">
          <button className="modal__cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="modal__confirm-btn" onClick={handleConfirm}>Autorizar</button>
        </footer>
      </div>
    </div>
  );
};

export default ModalAutorizarTroca;