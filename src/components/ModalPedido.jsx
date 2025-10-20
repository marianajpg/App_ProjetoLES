import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ModalPedido.css';

// Define os possíveis fluxos de status
const BASE_STATUS_ORDER = ['Em processamento', 'Em trânsito', 'Entregue'];
const EXCHANGE_STATUS_ORDER = ['Em troca', 'Troca autorizada', 'Item recebido', 'Finalizada'];

// Agrupa todos os status que devem ser considerados parte do fluxo de devolução/troca
const ALL_EXCHANGE_RELATED_STATUSES = ['Devolução', "Devoluções/Trocas", ...EXCHANGE_STATUS_ORDER];

const mapStatus = (apiStatus) => {
  switch (apiStatus) {
    case 'APPROVED':
      return 'Em trânsito';
    case 'PROCESSING':
      return 'Em processamento';
    case 'DELIVERED':
      return 'Entregue';
    case 'RETURNED':
      return 'Devoluções/Trocas';
    case 'CANCELED':
      return 'Cancelado';
    default:
      return apiStatus;
  }
};

const ModalPedido = ({ pedido, onClose }) => {
  const navigate = useNavigate();
  
  if (!pedido) return null;

  const mappedStatus = mapStatus(pedido.status);

  // 1. LÓGICA CORRIGIDA: Verifica se o status atual pertence ao fluxo de troca
  const isExchangeFlow = ALL_EXCHANGE_RELATED_STATUSES.includes(mappedStatus);

  // 2. ESCOLHE o array correto para exibir, em vez de combinar
  const statusOrderToDisplay = isExchangeFlow ? EXCHANGE_STATUS_ORDER : BASE_STATUS_ORDER;

  // A lógica do índice continua funcionando perfeitamente
  const currentStatusIndex = statusOrderToDisplay.indexOf(mappedStatus);

  const handleVerProduto = (id) => {
    navigate(`/tela-produto/${id}`);
  };

  const handleSolicitarTroca = async (item) => {
    console.log("Solicitando troca para o item:", item);
    if (window.confirm('Tem certeza que deseja solicitar a troca deste item?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        alert('Solicitação de troca enviada com sucesso! O status do pedido será atualizado em breve.');
        onClose();
      } catch (error) {
        console.error("Erro ao solicitar troca:", error);
        alert('Falha ao solicitar troca. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h3 className="modal__title">
            {/* 3. MELHORIA: Título dinâmico para clareza */}
            {isExchangeFlow ? 'Acompanhamento da Troca' : `Pedido ${mappedStatus}`}
            {mappedStatus === 'Entregue' && !isExchangeFlow && (
              <span className="modal__delivery-date">dia {new Date(pedido.created_at).toLocaleDateString()}</span>
            )}
          </h3>
          <button className="modal__close-btn" onClick={onClose} aria-label="Fechar modal">×</button>
        </header>

        <div className="status-bar">
          {statusOrderToDisplay.map((status, index) => (
            <div 
              key={status} 
              className={`status-bar__step ${index <= currentStatusIndex ? 'status-bar__step--active' : ''}`}
            >
              {status}
            </div>
          ))}
        </div>

        <section className="pedido-info">
          <h4 className="pedido-info__id">Pedido ID: {pedido.id}</h4>
          
          {pedido.items.map(item => (
            <div key={item.id} className="pedido-info__book-details">
              <img src={item.book.images.find(img => img.caption === 'Principal').url} alt={item.book.title} className="pedido-info__book-cover" />
              <div className="livro-info">
                <div>
                  <h5 className="livro-titulo">{item.book.title}</h5>
                  <p className="livro-autor">{item.book.author}</p>
                  <p className="summary__quantity">Quantidade: {item.quantity || 1}</p>
                </div>
                <div className="livro-info__footer">
                  <p className="livro-preco">R${(item.unitPrice || 0).toFixed(2).replace('.', ',')}</p>
                  {/* {mappedStatus === 'Entregue' && ( */}
                    <button className="modal__secondary-action" onClick={() => handleSolicitarTroca(item)}>
                      Trocar
                    </button>
                  
                  <button className="modal__main-action" onClick={() => handleVerProduto(item.book.id)}>
                    Ver produto
                  </button>
                </div>
              </div>
            </div>
          ))}
          
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
            {/* 4. MELHORIA: Botão de troca só aparece para pedidos entregues */}

            <button className="help-actions__btn">Pedir ajuda →</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ModalPedido;