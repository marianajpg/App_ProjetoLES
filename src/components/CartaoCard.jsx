import React, { useState } from 'react';
import '../styles/CartaoCard.css';
import lixeira from  '../images/image9.png';

const CartaoCard = ({ cartao, onDelete, onAmountChange, amount, placeholder }) => {
  const [amountError, setAmountError] = useState('');

  if (!cartao) {
    return null;
  }

  // Censura o número do cartão, mostrando apenas os últimos 4 dígitos
  const censoredCardNumber = `•••• •••• •••• ${cartao.numero.slice(-4)}`;

  const handleAmountChangeInternal = (e) => {
    const value = parseFloat(e.target.value);
    if (value < 10 && value !== 0) {
      setAmountError('Valor mínimo por cartão é de 10 reais');
    } else {
      setAmountError('');
    }
    onAmountChange(cartao.id, value);
  };

  return (
    <div className="cartao-card">
      <div className="cartao-card-content-wrapper">
        <div className="cartao-card-body">
          <p className="card-brand">{cartao.bandeira}</p>
          <p className="card-number">
            {censoredCardNumber}
            {cartao.preferredCard && <span className="preferred-card-label">  Preferencial</span>}
          </p>
          <p className="card-holder">{cartao.nome}</p>
        </div>
        <div className="cartao-card-actions">
          <input
            type="number"
            placeholder={placeholder}
            value={amount || ''}
            onChange={handleAmountChangeInternal}
            min="0"
            className="card-amount-input"
          />
          <button onClick={() => onDelete(cartao.id)} className="card-button delete-button">
            <img src = {lixeira}/>
          </button>
        </div>
      </div>
      {amountError && <p className="amount-error-message">{amountError}</p>}
    </div>
  );
};

export default CartaoCard;
