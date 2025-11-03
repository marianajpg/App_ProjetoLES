import React, { useState } from 'react';
import '../styles/ModalAutorizarTroca.css';

const ModalConfirmarRecebimento = ({ pedido, onClose, onConfirm }) => {
  if (!pedido) return null;

  const [codCoupon, setCodCoupon] = useState("");

  const handleConfirm = async () => {
    const response = await onConfirm(pedido.exchangeId, pedido.id);
    if (response?.couponCode) {
      setCodCoupon(response.couponCode);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h3 className="modal__title">Confirmar Recebimento da Troca</h3>
          <button className="modal__close-btn" onClick={onClose} aria-label="Fechar modal">×</button>
        </header>
        <section className="modal__content">
          <p>Confirme o recebimento dos itens abaixo para gerar o cupom de troca.</p>
          <div className="items-list">
            {pedido.items.map(item => (
              <div key={item.id} className="item-details-row">
                <span className="item-title">{item.book.title}</span>
                <span className="item-quantity">Qtd: {item.quantity}</span>
              </div>
            ))}
          </div>
          {codCoupon && (
            <div className="coupon-display">
              <p>Cupom gerado:</p>
              <strong>{codCoupon}</strong>
            </div>
          )}
        </section>
        <footer className="modal__actions">
          <button className="modal__cancel-btn" onClick={onClose}>Cancelar</button>
          {!codCoupon && (
            <button className="modal__confirm-btn" onClick={handleConfirm}>Confirmar Recebimento</button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default ModalConfirmarRecebimento;
