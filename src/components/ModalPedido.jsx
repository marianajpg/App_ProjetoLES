import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalTroca from './ModalTroca';
import { postExchange } from '../services/exchanges';
import '../styles/ModalPedido.css';

// Define os possíveis fluxos de status


const ModalPedido = ({ pedido, onClose, onExchangeSuccess, exchangedItems, exchangedQuantitiesMap, exchanges }) => { const navigate = useNavigate();
  const [showModalTroca, setShowModalTroca] = useState(false);
  const [itemParaTroca, setItemParaTroca] = useState(null);
  
  if (!pedido) return null;

  const handleVerProduto = (id) => {
    navigate(`/tela-produto/${id}`);
  };

  const handleOpenModalTroca = (item) => {
    setItemParaTroca(item);
    setShowModalTroca(true);
  };

  const handleConfirmTroca = async (item, quantity, reason) => {
      console.log(`Solicitando troca para ${quantity} unidade(s) do item:`, item, `Motivo: ${reason}`);
    const exchangeData = {
      saleId: pedido.id,
      items: [
        {
          vendaItemId: item.id,
          quantidade: quantity,
        },
      ],
      motivo: reason,
    };

    try {
      await postExchange(exchangeData);
      alert('Solicitação de troca enviada com sucesso! O status do pedido será atualizado em breve.');
      setShowModalTroca(false);
      
      if (onExchangeSuccess) {
        onExchangeSuccess(); 
      } else {
        onClose(); // Fallback caso não seja passada
      }

    } catch (error) {
      console.error("Erro ao solicitar troca:", error);
      alert('Falha ao solicitar troca. Tente novamente mais tarde.');
    }
  };


  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <header className="modal__header">
            <h3 className="modal__title">
              {`Pedido ${pedido.status}`}
              {pedido.status === 'DELIVERED' && (
                <span className="modal__delivery-date">dia {new Date(pedido.created_at).toLocaleDateString()}</span>
              )}
            </h3>
            <button className="modal__close-btn" onClick={onClose} aria-label="Fechar modal">×</button>
          </header>

          <section className="pedido-info">
            <h4 className="pedido-info__id">Pedido ID: {pedido.id}</h4>
            
            {pedido.items.map(item => {
              const isExchanged = exchangedItems && exchangedItems.has(item.id);
              const exchangedQuantity = exchangedQuantitiesMap && exchangedQuantitiesMap.get(item.id);
              let exchangeStatus = 'Troca em andamento';
              if (isExchanged) {
                const exchange = exchanges.find(ex => ex.items.some(exItem => exItem.vendaItemId === item.id));
                if (exchange && exchange.status.toUpperCase() === 'EXCHANGE_AUTHORIZED') {
                  exchangeStatus = 'Troca bem sucedida';
                }
              }
              return (
                <div key={item.id} className={`pedido-info__book-details ${isExchanged ? 'exchanged-item' : ''}`}>
                  {isExchanged && <div className="exchange-badge-modal">{exchangeStatus}</div>}
                  {isExchanged && exchangeStatus == "Troca bem sucedida" && <div className="exchange-strong-modal">{exchangeStatus}</div>}
                  <img src={item.book.images.find(img => img.caption === 'Principal').url} alt={item.book.title} className="pedido-info__book-cover" />
                  <div className="livro-info">
                    <div>
                      <h5 className="livro-titulo">{item.book.title}</h5>
                      <p className="livro-autor">{item.book.author}</p>
                      {isExchanged && exchangedQuantity && (
                        <p className="summary__quantity-exchanged">Quantidade em troca: {exchangedQuantity}</p>
                      )}
                      <p className="summary__quantity">Quantidade: {item.quantity || 1}</p>
                      
                    </div>
                    <div className="livro-info__footer">
                      <p className="livro-preco">R${(item.unitPrice || 0).toFixed(2).replace('.', ',')}</p>
                      <div className="livro-info__actions">
                        {(pedido.status === 'DELIVERED' || pedido.status === 'EXCHANGE' || pedido.status === 'EM_TROCA') && !isExchanged && (
                          <button className="modal__secondary-action" onClick={() => handleOpenModalTroca(item)}>
                            Trocar
                          </button>
                        )}
                        <button className="modal__main-action" onClick={() => handleVerProduto(item.book.id)}>
                          Ver produto
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="summary">
              <div className="summary__values">
                <p><span>Sub-total:</span> <span>R${(pedido.total - pedido.freightValue).toFixed(2).replace('.', ',')}</span></p>
                <p><span>Frete:</span> <span>R${(pedido.freightValue || 0).toFixed(2).replace('.', ',')}</span></p>
                <p className="summary__total"><span>Total:</span> <span>R${(pedido.total || 0).toFixed(2).replace('.', ',')}</span></p>
              </div>
            </div>
          </section>

          <footer className="modal__actions">
            <div className="help-actions">
              <h5 className="help-actions__title">Ajuda com a compra</h5>
              <button className="help-actions__btn">Pedir ajuda →</button>
            </div>
          </footer>
        </div>
      </div>
      {showModalTroca && (
        <ModalTroca 
          item={itemParaTroca} 
          onClose={() => setShowModalTroca(false)} 
          onConfirm={handleConfirmTroca} 
        />
      )}
    </>
  );
};

export default ModalPedido;