import React, { useState, useEffect, useRef } from 'react';
import ProdutoCard from './ProdutoCard';
import ModalPedido from './ModalPedido';
import '../styles/MeusProdutos.css';
import { getCheckout } from '../services/checkout';
import { getExchanges, postExchange } from '../services/exchanges';
import ModalTrocarTodos from './ModalTrocarTodos';

const MeusProdutos = ({ user }) => {
  const [statusAtivo, setStatusAtivo] = useState('Em trânsito');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const buttonsRef = useRef({});
  const [todosOsPedidos, setTodosOsPedidos] = useState([]);
  const [exchangedItems, setExchangedItems] = useState(new Set());
  const [exchangedQuantitiesMap, setExchangedQuantitiesMap] = useState(new Map());
  const [exchanges, setExchanges] = useState([]);
  const [isTrocarTodosModalOpen, setIsTrocarTodosModalOpen] = useState(false);
  const [selectedPedidoParaTroca, setSelectedPedidoParaTroca] = useState(null);
  const [viewMode, setViewMode] = useState('grouped');

  // Função para buscar dados
  const fetchSalesAndExchanges = async () => {
    if (user && user.id) {
      try {
        const sales = await getCheckout();
        const userSales = sales.filter(sale => sale.clientId === user.id);
        setTodosOsPedidos(userSales);

        const exchangesData = await getExchanges();
        setExchanges(exchangesData);
        const newExchangedItems = new Set();
        const newExchangedQuantitiesMap = new Map();
        exchangesData.forEach(exchange => {
          // Filtra apenas trocas que não estejam concluídas ou rejeitadas, se necessário
          // Ex: if (exchange.status !== 'COMPLETED' && exchange.status !== 'REJECTED') {
          exchange.items.forEach(item => {
            newExchangedItems.add(item.vendaItemId);
            // Acumula quantidades caso haja múltiplas trocas para o mesmo item
            const currentQty = newExchangedQuantitiesMap.get(item.vendaItemId) || 0;
            newExchangedQuantitiesMap.set(item.vendaItemId, currentQty + item.quantidade);
          });
          // }
        });
        setExchangedItems(newExchangedItems);
        setExchangedQuantitiesMap(newExchangedQuantitiesMap);
      } catch (error) {
        console.error("Erro ao buscar vendas ou trocas:", error);
      }
    }
  };

  useEffect(() => {
    fetchSalesAndExchanges();
  }, [user]);

  // Lógica de filtragem e transformação dos pedidos
  const pedidosParaExibir = todosOsPedidos.map(pedido => {
    let itemsParaExibir = [];

    const statusMap = {
      'Em processamento': ['APPROVED'],
      'Em trânsito': ['IN_TRANSIT'],
      'Entregue': ['DELIVERED', 'EXCHANGE', 'EXCHANGE_COMPLETED', 'EXCHANGE_AUTHORIZED', 'EXCHANGE_REJECTED'], // All statuses that represent a delivered or exchanged state
      'Devoluções/Trocas': ['EXCHANGE', 'EXCHANGE_AUTHORIZED', 'EXCHANGE_REJECTED', 'EXCHANGE_COMPLETED'], // Statuses related to exchanges
      'Cancelado': ['CANCELED']
    };

    const allowedStatusesForTab = statusMap[statusAtivo];

    if (!allowedStatusesForTab || !allowedStatusesForTab.includes(pedido.status)) {
      return null; // Filter out orders whose status doesn't match the active tab
    }

    // Now, process items based on the active tab
    if (statusAtivo === 'Devoluções/Trocas') {
      itemsParaExibir = pedido.items
        .map(item => {
          const exchange = exchanges.find(ex => ex.items.some(exItem => exItem.vendaItemId === item.id));

          if (exchange) { // If the item is part of any exchange
            let exchangeStatus = 'Troca em andamento';
            if (typeof exchange.status === 'string') {
              const upperCaseStatus = exchange.status.trim().toUpperCase();
              if (upperCaseStatus === 'EXCHANGE_AUTHORIZED') {
                exchangeStatus = 'Troca Autorizada';
              } else if (upperCaseStatus === 'EXCHANGE_COMPLETED') {
                exchangeStatus = 'Troca Concluída';
              } else if (upperCaseStatus === 'EXCHANGE_REJECTED') {
                exchangeStatus = 'Troca não autorizada';
              }
            }
            // Get the quantity from the exchange item itself, not the map, as the map might be for active exchanges
            const exchangedItemInExchange = exchange.items.find(exItem => exItem.vendaItemId === item.id);
            const quantityInExchange = exchangedItemInExchange ? exchangedItemInExchange.quantidade : 0;

            return { ...item, quantity: quantityInExchange, exchangeStatus: exchangeStatus };
          }
          return null;
        })
        .filter(Boolean);
    } else if (statusAtivo === 'Entregue') {
      itemsParaExibir = pedido.items
        .map(item => {
          const originalQuantity = item.quantity || 1;
          const exchangedQuantity = exchangedQuantitiesMap.get(item.id) || 0;
          const deliveredQuantity = originalQuantity - exchangedQuantity;
          if (deliveredQuantity > 0) {
            return { ...item, quantity: deliveredQuantity };
          }
          return null;
        })
        .filter(Boolean);
    } else { // For 'Em processamento', 'Em trânsito', 'Cancelado'
      itemsParaExibir = pedido.items.filter(item => !exchangedQuantitiesMap.has(item.id));
    }

    if (itemsParaExibir.length === 0) {
      return null;
    }

    return { ...pedido, items: itemsParaExibir };
  }).filter(Boolean);

  useEffect(() => {
    const activeBtn = buttonsRef.current[statusAtivo];
    if (activeBtn) {
      setIndicatorStyle({
        width: activeBtn.offsetWidth,
        left: activeBtn.offsetLeft,
      });
    }
  }, [statusAtivo]);

  const handleOpenModal = (pedido, item) => {
    // Busca o pedido original completo, sem as quantidades modificadas
    const fullOrder = todosOsPedidos.find(p => p.id === pedido.id);
    setSelectedPedido({ ...fullOrder, selectedItem: item });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
  };

  const handleTrocarTodosClick = (pedido) => {
    setSelectedPedidoParaTroca(pedido);
    setIsTrocarTodosModalOpen(true);
  };

  const handleConfirmTrocarTodos = async (reason) => {
    if (!selectedPedidoParaTroca) return;

    const itemsToExchange = selectedPedidoParaTroca.items.map(item => ({
      vendaItemId: item.id,
      quantidade: item.quantity,
    }));

    const exchangeData = {
      saleId: selectedPedidoParaTroca.id,
      items: itemsToExchange,
      motivo: reason,
    };

    try {
      await postExchange(exchangeData);
      setIsTrocarTodosModalOpen(false);
      fetchSalesAndExchanges();
    } catch (error) {
      console.error("Erro ao solicitar a troca de todos os itens:", error);
    }
  };

  const handleTrocarItemClick = (pedido, item) => {
    const fullOrder = todosOsPedidos.find(p => p.id === pedido.id);
    setSelectedPedido({ ...fullOrder, selectedItem: item });
    setIsModalOpen(true);
  };

  const handleExchangeSuccess = () => {
    handleCloseModal(); // Fecha o modal
    fetchSalesAndExchanges(); // Refaz o fetch dos dados para atualizar a UI
  };


  const statusOptions = [
    'Em processamento',
    'Em trânsito',
    'Entregue',
    'Devoluções/Trocas',
    'Cancelado',
  ];

  const renderGroupedView = () => {
    return pedidosParaExibir.map(pedido => (
      <ProdutoCard 
        key={pedido.id}
        id={pedido.items[0].book.id}
        capaUrl={pedido.items[0].book.images.find(img => img.caption === 'Principal').url}
        titulo={pedido.items[0].book.title}
        autor={pedido.items[0].book.author}
        preco={pedido.items[0].unitPrice}
        estoque={1} // Estoque não é relevante aqui
        onVerDetalhes={() => handleOpenModal(pedido)}
        onTrocarTodos={(
          pedido.status === 'DELIVERED'
        ) ? () => handleTrocarTodosClick(pedido) : undefined}
        stacked={pedido.items.length > 1}
        exchangeStatus={pedido.items[0].exchangeStatus}
      />
    ));
  };
 
  const renderSeparatedView = () => {
    return pedidosParaExibir.flatMap(pedido => 
      pedido.items.map(item => (
        <ProdutoCard 
          key={`${pedido.id}-${item.book.id}`}
          id={item.book.id}
          capaUrl={item.book.images.find(img => img.caption === 'Principal').url}
          titulo={item.book.title}
          autor={item.book.author}
          preco={item.unitPrice}
          estoque={1} // Estoque não é relevante aqui
          onVerDetalhes={() => handleOpenModal(pedido, item)}
          onTrocarItem={(
            (pedido.status === 'EXCHANGE_COMPLETED' || 
             pedido.status === 'EXCHANGE' || 
             pedido.status === 'EXCHANGE_REJECTED' || 
             pedido.status === 'EXCHANGE_AUTHORIZED') && 
            !exchangedItems.has(item.id)
          ) ? () => handleTrocarItemClick(pedido, item) : undefined}
          exchangeStatus={item.exchangeStatus}
        />
      ))
    );
  };


  return (
    <div className="meus-produtos-container">
      <div className="status-filtros">
        {statusOptions.map((status) => (
          <button
            key={status}
            ref={(el) => (buttonsRef.current[status] = el)}
            className={statusAtivo === status ? 'ativo' : ''}
            onClick={() => setStatusAtivo(status)}
          >
            {status}
          </button>
        ))}
        <div className="status-indicator" style={indicatorStyle}></div>
      </div>

      <div className="view-mode-buttons">
        <button onClick={() => setViewMode('grouped')} className={viewMode === 'grouped' ? 'ativo' : ''}>Agrupado</button>
        <button onClick={() => setViewMode('separated')} className={viewMode === 'separated' ? 'ativo' : ''}>Separado</button>
      </div>

      <div className={`produto-card-meus-produtos ${viewMode === 'grouped' ? 'grouped-view' : 'separated-view'}`}>
        {pedidosParaExibir.length > 0 ? (
          viewMode === 'grouped' ? renderGroupedView() : renderSeparatedView()
        ) : (
          <div className="no-pedidos">
            <img src="/src/images/image-nenhumProduto.png" alt="Nenhum pedido encontrado" className="no-pedidos-img" />
            <p>Nenhum pedido encontrado nesta categoria.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ModalPedido 
          pedido={selectedPedido} 
          onClose={handleCloseModal} 
          // Passa a nova função de callback
          onExchangeSuccess={handleExchangeSuccess} 
          exchangedItems={exchangedItems} 
          exchangedQuantitiesMap={exchangedQuantitiesMap} 
          exchanges={exchanges} 
        />
      )}

      {isTrocarTodosModalOpen && (
        <ModalTrocarTodos
          pedido={selectedPedidoParaTroca}
          onClose={() => setIsTrocarTodosModalOpen(false)}
          onConfirm={handleConfirmTrocarTodos}
          
        />
      )}
    </div>
  );
};

export default MeusProdutos;