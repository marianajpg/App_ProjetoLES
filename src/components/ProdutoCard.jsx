import React from 'react';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return 'R$0,00';
  }

  if (typeof value === 'number') {
    return `R$${value.toFixed(2).replace('.', ',')}`;
  }

  const raw = String(value).replace(/[\sR$]/g, '');
  const normalized = raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw;
  const numeric = Number(normalized);
  if (!Number.isNaN(numeric)) {
    return `R$${numeric.toFixed(2).replace('.', ',')}`;
  }

  return String(value);
};

const ProdutoCard = ({ id, capaUrl, titulo, autor, preco, totalCompra, estoque, onClick, onVerDetalhes, onTrocarTodos, onTrocarItem, stacked, exchangeStatus }) => {
  const navigate = useNavigate();
  const isExchanged = !!exchangeStatus;
  const priceToDisplay = totalCompra ?? preco;
  const formattedPrice = formatCurrency(priceToDisplay);

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
      {exchangeStatus == "Troca não autorizada" && <div className="exchange-rejected">{exchangeStatus}</div>}
                  
      {exchangeStatus === "Troca Concluída" && <div className="exchange-strong">{exchangeStatus}</div>}
      {estoque === 0 && <div className="out-of-stock-overlay">Produto fora de estoque</div>}
      <img src={capaUrl} alt={titulo} className="card-image" />
      <div className="card-info">
        <div className="card-text-content">
          <h3 className="card-title">{titulo}</h3>
          <p className="card-author">{autor}</p>
        </div>
        <div className="card-footer">
          <p className="card-price">{formattedPrice}</p>
          <div className="card-buttons-container">
            {onTrocarItem && (
              <button className="detalhes-btn" onClick={onTrocarItem}>
                Trocar
              </button>
            )}
            {onTrocarTodos && (
              <button className="detalhes-btn" onClick={onTrocarTodos}>
                Trocar todos os itens
              </button>
            )}
            {onVerDetalhes && (
              <button className="detalhes-btn" onClick={handleDetalhesClick}>
                Ver detalhes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdutoCard;