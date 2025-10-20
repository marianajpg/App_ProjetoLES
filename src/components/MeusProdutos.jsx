import React, { useState, useEffect, useRef } from 'react';
import ProdutoCard from './ProdutoCard';
import ModalPedido from './ModalPedido';
import '../styles/MeusProdutos.css';
import { getCheckout } from '../services/checkout';

const MeusProdutos = ({ user }) => {
  const [statusAtivo, setStatusAtivo] = useState('Em trânsito'); // Changed initial state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const buttonsRef = useRef({});
  const [todosOsPedidos, setTodosOsPedidos] = useState([]);

  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'separated'

  useEffect(() => {
    const fetchSales = async () => {
      if (user && user.id) {
        try {
          const sales = await getCheckout();
          const userSales = sales.filter(sale => sale.clientId === user.id);
          setTodosOsPedidos(userSales);
        } catch (error) {
          console.error("Erro ao buscar vendas:", error);
        }
      }
    };
    fetchSales();
  }, [user]);

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
    setSelectedPedido({ ...pedido, selectedItem: item });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
  };

  const pedidosFiltrados = todosOsPedidos.filter(p => mapStatus(p.status) === statusAtivo);

  const statusOptions = [
    'Em processamento',
    'Em trânsito',
    'Entregue',
    'Devoluções/Trocas',
    'Cancelado',
  ];

  const renderGroupedView = () => {
    return pedidosFiltrados.map(pedido => (
      <ProdutoCard 
        key={pedido.id}
        id={pedido.items[0].book.id}
        capaUrl={pedido.items[0].book.images.find(img => img.caption === 'Principal').url}
        titulo={pedido.items[0].book.title}
        autor={pedido.items[0].book.author}
        preco={pedido.items[0].unitPrice}
        estoque={1} // Estoque não é relevante aqui
        onVerDetalhes={() => handleOpenModal(pedido)}
        stacked={pedido.items.length > 1}
      />
    ));
  };

  const renderSeparatedView = () => {
    return pedidosFiltrados.flatMap(pedido => 
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
        {pedidosFiltrados.length > 0 ? (
          viewMode === 'grouped' ? renderGroupedView() : renderSeparatedView()
        ) : (
          <div className="no-pedidos">
            <img src="/src/images/image-nenhumProduto.png" alt="Nenhum pedido encontrado" className="no-pedidos-img" />
            <p>Nenhum pedido encontrado nesta categoria.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ModalPedido pedido={selectedPedido} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MeusProdutos;
