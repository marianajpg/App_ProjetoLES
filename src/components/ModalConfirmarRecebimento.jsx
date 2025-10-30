import React, { useState } from 'react';
import '../styles/ModalConfirmarRecebimento.css';

const ModalConfirmarRecebimento = ({ pedido, onClose, onConfirm }) => {
  const [itemsToRestock, setItemsToRestock] = useState([]);

  const handleRestockChange = (itemId) => {
    setItemsToRestock(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(itemsToRestock);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h3 className="modal__title">Confirmar Recebimento</h3>
          <button className="modal__close-btn" onClick={onClose} aria-label="Fechar modal">×</button>
        </header>
        <section className="modal__content">
          <p>Selecione os itens que devem retornar ao estoque:</p>
          <div className="items-list">
            {pedido.items.map(item => (
              <div key={item.id} className="item">
                <label>
                  <input
                    type="checkbox"
                    checked={itemsToRestock.includes(item.id)}
                    onChange={() => handleRestockChange(item.id)}
                  />
                  <div className="item-details">
                    <span className="item-title">{item.book.title}</span>
                    <span className="item-quantity">Qtd: {item.quantity}</span>
                    <span className="item-price">R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
          <div className="exchange-total">
            <strong>Valor Total da Troca:</strong> R$ {pedido.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0).toFixed(2).replace('.', ',')}
          </div>
        </section>
        <footer className="modal__actions">
          <button className="modal__cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="modal__confirm-btn" onClick={handleConfirm}>Confirmar</button>
        </footer>
      </div>
    </div>
  );
};

export default ModalConfirmarRecebimento;