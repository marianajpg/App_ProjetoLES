import React, { useState, useEffect, useRef } from 'react';
import ProdutoCard from './ProdutoCard';
import ModalPedido from './ModalPedido';
import '../styles/MeusProdutos.css';

const MeusProdutos = () => {
  const [statusAtivo, setStatusAtivo] = useState('Em processamento');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const buttonsRef = useRef({});

  const todosOsPedidos = [
    {
      id: '1',
      status: 'Em processamento',
      dataEntrega: '20/08/2024',
      capaUrl: 'https://m.media-amazon.com/images/I/414U616yzqL._SY445_SX342_.jpg',
      titulo: 'A Vida Secreta das Árvores',
      autor: 'Peter Wohlleben',
      preco: 48.99,
      quantidade: 1,
      subTotal: 48.99,
      frete: 5.00,
      total: 53.99,
    },
    {
      id: '2',
      status: 'Em trânsito',
      dataEntrega: '22/08/2024',
      capaUrl: 'https://m.media-amazon.com/images/I/41Xc4wyyMIL._SY445_SX342_.jpg',
      titulo: 'O Homem Mais Rico da Babilônia',
      autor: 'George S. Clason',
      preco: 25.99,
      quantidade: 1,
      subTotal: 25.99,
      frete: 5.00,
      total: 30.99,
    },
    {
      id: '3',
      status: 'Entregue',
      dataEntrega: '15/08/2024',
      capaUrl: 'https://m.media-amazon.com/images/I/41897yAI4LL._SY445_SX342_.jpg',
      titulo: 'Pai Rico, Pai Pobre',
      autor: 'Robert T. Kiyosaki',
      preco: 35.50,
      quantidade: 1,
      subTotal: 35.50,
      frete: 5.00,
      total: 40.50,
    },
     {
      id: '4',
      status: 'Devoluções/Trocas',
      dataEntrega: '15/08/2024',
      capaUrl: 'https://m.media-amazon.com/images/I/41897yAI4LL._SY445_SX342_.jpg',
      titulo: 'Pai Rico, Pai Pobre',
      autor: 'Robert T. Kiyosaki',
      preco: 35.50,
      quantidade: 1,
      subTotal: 35.50,
      frete: 0.00,
      total: 35.50,
    }
  ];

  useEffect(() => {
    const activeBtn = buttonsRef.current[statusAtivo];
    if (activeBtn) {
      setIndicatorStyle({
        width: activeBtn.offsetWidth,
        left: activeBtn.offsetLeft,
      });
    }
  }, [statusAtivo]);

  const handleOpenModal = (pedido) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
  };

  const pedidosFiltrados = todosOsPedidos.filter(p => p.status === statusAtivo);

  const statusOptions = [
    'Em processamento',
    'Em trânsito',
    'Entregue',
    'Devoluções/Trocas',
    'Cancelado',
  ];

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

      <div className='produto-card-meus-produtos'>
        {pedidosFiltrados.length > 0 ? (
          pedidosFiltrados.map(pedido => (
            <ProdutoCard 
              key={pedido.id}
              {...pedido}
              onVerDetalhes={() => handleOpenModal(pedido)}
            />
          ))
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