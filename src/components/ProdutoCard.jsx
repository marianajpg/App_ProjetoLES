import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProdutoCard = ({ id, capaUrl, titulo, autor, preco, estoque, onClick, onVerDetalhes, stacked, exchangeStatus }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onVerDetalhes) {
      return;  
    }
    if (onClick) {
      onClick();
    } else {
      navigate(`/tela-produto/${id}`);
    }
  };

  const handleDetalhesClick = (e) => {
    e.stopPropagation(); 
    if (onVerDetalhes) {
      onVerDetalhes();
    }
  };

  return (
    <div className={`card ${estoque === 0 ? 'out-of-stock' : ''} ${stacked ? 'stacked' : ''}`} onClick={handleClick} data-cy={`book-card-${id}`}>
      {exchangeStatus && <div className="exchange-badge">{exchangeStatus}</div>}
      {exchangeStatus == "Troca bem sucedida" && <div className="exchange-strong">{exchangeStatus}</div>}
      {estoque === 0 && <div className="out-of-stock-overlay">Produto fora de estoque</div>}
      <img src={capaUrl} alt={titulo} className="card-image" />
      <div className="card-info">
        <div className="card-text-content">
          <h3 className="card-title">{titulo}</h3>
          <p className="card-author">{autor}</p>
        </div>
        <div className="card-footer">
          <p className="card-price">R${preco}</p>
          {onVerDetalhes && (
            <button className="detalhes-btn" onClick={handleDetalhesClick}>
              Ver detalhes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProdutoCard;