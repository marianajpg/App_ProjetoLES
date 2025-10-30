import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ModalTroca.css';

const ModalTroca = ({ item, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const navigate = useNavigate();
  const quantityInputRef = useRef(null);

  useEffect(() => {
    if (quantityInputRef.current) {
        quantityInputRef.current.focus();
    }
  }, []);

  const handleConfirm = () => {
    onConfirm(item, quantity, reason);
    navigate('/perfil', { state: { aba: 'MeusProdutos' } });
  };

  const handleQuantityChange = (e) => {
    let newQuantity = parseInt(e.target.value);
    if (newQuantity > item.quantity) {
        newQuantity = item.quantity;
    }
    if (newQuantity < 1) {
        newQuantity = 1;
    }
    setQuantity(newQuantity);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-troca">
        <h4>Solicitar Troca</h4>
        <p>Item: {item.book.title}</p>
        {item.quantity > 1 && (
            <div className="quantity-selector">
                <label htmlFor="quantity">Quantidade:</label>
                <input
                    ref={quantityInputRef}
                    type="number"
                    id="quantity"
                    min="1"
                    max={item.quantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                />
                <p>Quantidade máxima para troca: {item.quantity}</p>
            </div>
        )}
        <div className="reason-selector">
            <label htmlFor="reason">Motivo da troca:</label>
            <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
        </div>
        <div className="modal-troca__actions">
            <button className="modal__cancel-action" onClick={onClose}>Cancelar</button>
            <button className="modal__main-action" onClick={handleConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalTroca;