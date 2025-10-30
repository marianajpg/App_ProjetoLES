import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import AbasFiltro from '../../components/AbasFiltro';
import CampoPesquisa from '../../components/CampoPesquisa';
import { getCheckout, putCheckout } from '../../services/checkout';
import { getExchanges } from '../../services/exchanges';
import { postAuthorizeExchanges, postReceiveExchange } from '../../services/exchanges';
import ModalConfirmarRecebimento from '../../components/ModalConfirmarRecebimento';
import ModalPedido from '../../components/ModalPedido';
import '../../styles/colaborador/ConsultaPedidos.css';

// Página para colaboradores consultarem e gerenciarem o status dos pedidos.
const ConsultaPedidos = () => {
  const [abaAtiva, setAbaAtiva] = useState('geral');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [valoresFiltro, setValoresFiltro] = useState({ status: [] });

  const abas = [
    { id: 'geral', label: 'Geral' },
    { id: 'processing', label: 'Processando' },
    { id: 'approved', label: 'Aprovada' },
    
    { id: 'rejected', label: 'Reprovada' },
    { id: 'in_transit', label: 'Em Trânsito' },
    { id: 'delivered', label: 'Entregue' },
    { id: 'exchange', label: 'Troca' },
    { id: 'exchange_authorized', label: 'Troca Autorizada' },
    { id: 'exchange_completed', label: 'Troca Concluida' },
    { id: 'canceled', label: 'Cancelada' },
    
  ];

  const filtros = [
    {
      id: 'status',
      titulo: 'Status do Pedido',
      tipo: 'checkbox',
      opcoes: [
        { id: 'geral', label: 'Geral' },
        { id: 'processing', label: 'Processando' },
        { id: 'approved', label: 'Aprovada' },
        { id: 'rejected', label: 'Reprovada' },
        { id: 'in_transit', label: 'Em Trânsito' },
        { id: 'delivered', label: 'Entregue' },
        { id: 'exchange', label: 'Troca' },
        { id: 'exchange_authorized', label: 'Troca Autorizada' },
    { id: 'exchange_completed', label: 'Troca Concluida' },
      ],
    },
  ];

  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangedItems, setExchangedItems] = useState(new Set());
  const [exchangedQuantitiesMap, setExchangedQuantitiesMap] = useState(new Map());
  const [exchangeMap, setExchangeMap] = useState(new Map());
  const [exchangeStatusMap, setExchangeStatusMap] = useState(new Map());
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    const fetchPedidosAndExchanges = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const sales = await getCheckout();
        const mappedPedidos = sales.map((pedido) => ({
          ...pedido,
          displayStatus: pedido.status.toLowerCase(),
        }));
        setPedidos(mappedPedidos);

        const exchangesData = await getExchanges();
        setExchanges(exchangesData);
        const newExchangedItems = new Set();
        const newExchangeMap = new Map();
        const newExchangedQuantitiesMap = new Map();
        const newExchangeStatusMap = new Map();

        exchangesData.forEach(exchange => {
          exchange.items.forEach(item => {
            newExchangedItems.add(item.vendaItemId);
            newExchangeMap.set(item.vendaItemId, exchange.id);
            newExchangedQuantitiesMap.set(item.vendaItemId, item.quantidade);
            newExchangeStatusMap.set(item.vendaItemId, exchange.status); // Salva o status da troca
          });
        });
        setExchangedItems(newExchangedItems);
        setExchangeMap(newExchangeMap);
        setExchangedQuantitiesMap(newExchangedQuantitiesMap);
        setExchangeStatusMap(newExchangeStatusMap);

      } catch (err) {
        setError('Erro ao carregar pedidos ou trocas.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPedidosAndExchanges();
  }, []);

  const handleStatusChange = async (idCompra, novoStatus) => {
    if (window.confirm(`Tem certeza que deseja alterar o status para ${novoStatus}?`)) {
      try {
        await putCheckout(idCompra, { status: novoStatus });
        setPedidos(
          pedidos.map((p) =>
            p.id === idCompra ? { ...p, status: novoStatus, displayStatus: novoStatus.toLowerCase() } : p
          )
        );
      } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
      }
    }
  };

const pedidosParaExibir = pedidos.map(pedido => {
    const itemsFiltrados = pedido.items.filter(item => {
      
      const isExchanged = exchangedItems.has(item.id);
      // Pega o status da TROCA (convertendo para maiúsculo por segurança)
      const itemExchangeStatus = exchangeStatusMap.get(item.id)?.toUpperCase();

      // LÓGICA DE FILTRO POR ABA
      switch (abaAtiva) {
        // --- ABAS DE TROCA ---
        case 'geral':
          return true; // Sempre mostra na aba Geral
        case 'exchange':
        case 'em_troca':
          // Mostra apenas se o item está em troca E o status da TROCA é 'EM_TROCA' ou 'PENDING'
          return isExchanged && (itemExchangeStatus === 'EXCHANGE' || itemExchangeStatus === 'PENDING');
        
        case 'exchange_authorized':
          // Mostra apenas se o item está em troca E o status da TROCA é 'AUTORIZADA'
          return isExchanged && itemExchangeStatus === 'EXCHANGE_AUTHORIZED';

        // case 'exchange_completed':
        //   return isExchanged && itemExchangeStatus === 'EXCHANGE_COMPLETED';

        // --- ABAS DE STATUS DE PEDIDO ---
        default:
          // Se o item JÁ ESTÁ em processo de troca, não o mostre
          // nas abas de status de pedido (ex: 'approved', 'delivered').
          if (isExchanged) {
            return false;
          }

          // Se não está em troca, filtre pelo STATUS DO PEDIDO
          const orderStatusMap = {
            'processing': 'PROCESSING',
            'approved': 'APPROVED',
            'in_transit': 'IN_TRANSIT',
            'delivered': 'DELIVERED', 
            'rejected': 'REJECTED',
            'canceled': 'CANCELED',
          };
          
          return orderStatusMap[abaAtiva] === pedido.status;
      }
    });

    if (itemsFiltrados.length === 0) {
      return null;
    }

    return { ...pedido, items: itemsFiltrados };
  }).filter(Boolean);

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedPedidoParaRecebimento, setSelectedPedidoParaRecebimento] = useState(null);
  const [isPedidoModalOpen, setIsPedidoModalOpen] = useState(false);
  const [selectedPedidoParaVisualizacao, setSelectedPedidoParaVisualizacao] = useState(null);

  const handleOpenReceiveModal = (pedido) => {
    setSelectedPedidoParaRecebimento(pedido);
    setIsReceiveModalOpen(true);
  };

  const handleOpenPedidoModal = (pedido) => {
    // Encontra o pedido original e completo da lista `pedidos`
    const originalPedido = pedidos.find(p => p.id === pedido.id);
    if (originalPedido) {
      setSelectedPedidoParaVisualizacao(originalPedido);
      setIsPedidoModalOpen(true);
    } else {
      console.error("Pedido original não encontrado para o ID:", pedido.id);
    }
  };

const renderStatusButton = (pedido, exchangedItems, exchangeStatusMap) => {
  // Verifica se o pedido tem itens em troca
  const hasExchangedItems = pedido.items.some(item => exchangedItems.has(item.id));
  
  // Encontra o ID da troca e status da troca associado a este pedido
  let exchangeId = null;
  let exchangeStatus = null;
  
  if (hasExchangedItems) {
    const itemEmTroca = pedido.items.find(item => exchangedItems.has(item.id));
    if (itemEmTroca) {
      exchangeId = exchangeMap.get(itemEmTroca.id);
      exchangeStatus = exchangeStatusMap.get(itemEmTroca.id)?.toUpperCase();
    }
  }

  // LÓGICA PARA PEDIDOS COM TROCA
  if (hasExchangedItems) {
    switch (exchangeStatus) {
      case 'EXCHANGE':
      case 'PENDING':
        return (
          <div className="status-buttons-container">
            <button
              className="status-button status-detalhes"
              onClick={() => handleOpenPedidoModal(pedido)}
            >
              Ver Detalhes
            </button>
            <button
              className="status-button status-troca-autorizada"
              onClick={() => handleAuthorizeExchange(exchangeId, pedido.id)}
            >
              Autorizar Troca
            </button>
          </div>
        );
      
      case 'AUTORIZADA':
        return (
          <div className="status-buttons-container">
            <button
              className="status-button status-detalhes"
              onClick={() => handleOpenPedidoModal(pedido)}
            >
              Ver Detalhes
            </button>
            <button
              className="status-button status-recebido"
              onClick={() => handleOpenReceiveModal(pedido)}
            >
              Confirmar Recebimento
            </button>
          </div>
        );
      
      case 'RECEBIDA':
      case 'EXCHANGE_COMPLETED':
        return (
          <button
            className="status-button status-detalhes"
            onClick={() => handleOpenPedidoModal(pedido)}
          >
            Ver Detalhes
          </button>
        );
      
      default:
        return (
          <button
            className="status-button status-detalhes"
            onClick={() => handleOpenPedidoModal(pedido)}
          >
            Ver Detalhes
          </button>
        );
    }
  }

  // LÓGICA PARA PEDIDOS SEM TROCA (STATUS NORMAL DO PEDIDO)
  switch (pedido.displayStatus) {
    case 'approved':
      return (
        <button
          className="status-button status-processamento"
          onClick={() => handleStatusChange(pedido.id, 'IN_TRANSIT')}
        >
          Em Trânsito
        </button>
      );
    
    case 'processing':
      return (
        <button
          className="status-button status-em_transito"
          onClick={() => handleStatusChange(pedido.id, 'APPROVED')}
        >
          Aprovar
        </button>
      );
    
    case 'in_transit':
      return (
        <button
          className="status-button status-entregue"
          onClick={() => handleStatusChange(pedido.id, 'DELIVERED')}
        >
          Confirmar Entrega
        </button>
      );
    
    case 'delivered':
      return (
        <button
          className="status-button status-detalhes"
          onClick={() => handleOpenPedidoModal(pedido)}
        >
          Ver Detalhes
        </button>
      );
    
    default:
      return (
        <button
          className="status-button status-detalhes"
          onClick={() => handleOpenPedidoModal(pedido)}
        >
          Ver Detalhes
        </button>
      );
  }
};

// Modifique a assinatura da função para aceitar 'exchangeId' e 'idCompra'
const handleAuthorizeExchange = async (exchangeId, idCompra) => {
    if (!exchangeId) {
      console.error('Não foi possível encontrar o ID da troca para este pedido.');
      alert('Erro: ID da troca não associado a este pedido.');
      return;
    }

    if (window.confirm(`Tem certeza que deseja autorizar a TROCA ID: ${exchangeId}?`)) {
      try {
        await postAuthorizeExchanges({}, exchangeId);
        
        const itemsToUpdate = [];
        for (const [itemId, exId] of exchangeMap.entries()) {
          if (exId === exchangeId) {
            itemsToUpdate.push(itemId);
          }
        }

        setExchangeStatusMap(prevMap => {
          const newMap = new Map(prevMap);
          itemsToUpdate.forEach(itemId => newMap.set(itemId, 'AUTORIZADA'));
          return newMap;
        });

         setPedidos(
           pedidos.map((p) =>
             p.id === idCompra ? { ...p, status: 'EXCHANGE_AUTHORIZED', displayStatus: 'exchange_authorized' } : p
           )
         );
         
      } catch (error) {
        console.error('Erro ao autorizar troca:', error);
      }
    }
  };

  const handleConfirmReceive = async (itemsToRestock) => {
    if (!selectedPedido) return;

    try {
      await postReceiveExchange(selectedPedido.id, itemsToRestock);
      setPedidos(
        pedidos.map((p) =>
          p.id === selectedPedido.id ? { ...p, status: 'EXCHANGE_COMPLETED', displayStatus: 'exchange_completed' } : p
        )
      );
      setIsReceiveModalOpen(false);
    } catch (error) {
      console.error('Erro ao confirmar recebimento:', error);
    }
  };

  return (
    <div>
      <Header tipoUsuario="colaborador" />
      <div className="consulta-pedidos">
        <h1>Consulta de Pedidos</h1>
        <AbasFiltro abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} abas={abas} />
        <CampoPesquisa
          termoPesquisa={termoPesquisa}
          setTermoPesquisa={setTermoPesquisa}
          filtros={filtros}
          valoresFiltro={valoresFiltro}
          setValoresFiltro={setValoresFiltro}
        />
        <div className="pedidos-container">
          {isLoading ? (
            <p>Carregando pedidos...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table className="tabela-pedidos">
              <thead>
                <tr>
                  <th>ID DO PEDIDO</th>
                  <th>ID DO CLIENTE</th>
                  <th>VALOR TOTAL</th>
                  <th>FORMA DE PAGAMENTO</th>
                  <th className="status-header">STATUS</th>
                  <th>ID DA TROCA</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {pedidosParaExibir.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.id}</td>
                    <td>{pedido.clientId}</td>
                    <td>R$ {pedido.total.toFixed(2).replace('.', ',')}</td>
                    <td>
                      {pedido.payments && pedido.payments.length > 0
                        ? pedido.payments.map((p) => p.type).join(', ')
                        : 'N/A'}
                    </td>
                    <td>{pedido.status}</td>
                    <td>
                      {pedido.items.some(item => exchangedItems.has(item.id))
                        ? exchangeMap.get(pedido.items.find(item => exchangedItems.has(item.id)).id)
                        : 'N/A'}
                    </td>
                    <td>{renderStatusButton(pedido, exchangedItems, exchangeStatusMap)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {isReceiveModalOpen && (
        <ModalConfirmarRecebimento
          pedido={selectedPedidoParaRecebimento}
          onClose={() => setIsReceiveModalOpen(false)}
          onConfirm={handleConfirmReceive}
        />
      )}

      {isPedidoModalOpen && (
        <ModalPedido
          pedido={selectedPedidoParaVisualizacao}
          onClose={() => setIsPedidoModalOpen(false)}
          exchangedItems={exchangedItems}
          exchangedQuantitiesMap={exchangedQuantitiesMap}
          exchanges={exchanges}
        />
      )}
    </div>
  );
};

export default ConsultaPedidos;