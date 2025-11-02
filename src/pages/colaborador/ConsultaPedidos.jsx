import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import AbasFiltro from '../../components/AbasFiltro';
import CampoPesquisa from '../../components/CampoPesquisa';
import { getCheckout, putCheckout } from '../../services/checkout';
import { getExchanges } from '../../services/exchanges';
import { postAuthorizeExchanges, postReceiveExchange, putExchangesConfirmation } from '../../services/exchanges';
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
  const [codCoupon, setCodCoupon] = useState("");

  const fetchAllData = async () => {
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
          newExchangeStatusMap.set(item.vendaItemId, exchange.status);
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

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleStatusChange = async (idCompra, novoStatus) => {
    if (window.confirm(`Tem certeza que deseja alterar o status para ${novoStatus}?`)) {
      try {
        await putCheckout(idCompra, { status: novoStatus });
        // Recarrega os dados para garantir consistência
        fetchAllData();
      } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
      }
    }
  };

  const pedidosParaExibir = pedidos.flatMap(pedido => {
    const deliveredItems = [];
    let deliveredTotal = 0; // Total para itens entregues
    
    // Pega o valor do frete do pedido original
    const freightValue = parseFloat(pedido.freightValue) || 0; 

    // Agrupa itens de troca por ID da troca
    const exchangesGroup = new Map();

    pedido.items.forEach(item => {
      const originalQuantity = item.quantity || 1;
      const exchangedQuantity = exchangedQuantitiesMap.get(item.id) || 0;
      const deliveredQuantity = originalQuantity - exchangedQuantity;
      const price = parseFloat(item.unitPrice) || 0;

      // 1. Adiciona itens que foram entregues (não trocados)
      if (deliveredQuantity > 0) {
        deliveredItems.push({ ...item, quantity: deliveredQuantity });
        // Adiciona ao total da linha de entrega
        deliveredTotal += deliveredQuantity * price;
      }

      // 2. Agrupa itens que estão em troca
      if (exchangedQuantity > 0) {
        const exchangeId = exchangeMap.get(item.id);
        const exchangeStatus = exchangeStatusMap.get(item.id)?.toUpperCase() || 'EXCHANGE';

        // Se este grupo de troca ainda não foi visto, inicializa com groupTotal = 0
        if (!exchangesGroup.has(exchangeId)) {
          exchangesGroup.set(exchangeId, {
            items: [],
            status: exchangeStatus,
            groupTotal: 0 
          });
        }
        
        const currentGroup = exchangesGroup.get(exchangeId);
        
        currentGroup.items.push({ 
          ...item, 
          quantity: exchangedQuantity 
        });
        
        // Adiciona ao total desta linha de troca
        currentGroup.groupTotal += exchangedQuantity * price;
      }
    });

    // 3. Monta o resultado final
    const result = [];

    // Adiciona a linha de itens entregues, se houver
    if (deliveredItems.length > 0) {
      result.push({
        ...pedido,
        items: deliveredItems,
        // Total dos itens entregues + frete
        total: deliveredTotal + freightValue, 
        displayType: 'Entrega',
        rowId: `${pedido.id}-delivered`,
        displayStatus: pedido.status.toLowerCase(),
        exchangeId: null
      });
    }

    // Adiciona uma linha PARA CADA troca encontrada
    for (const [exchangeId, data] of exchangesGroup.entries()) {
      result.push({
        ...pedido,
        items: data.items,
        // Total APENAS dos itens desta troca
        total: data.groupTotal,
        displayType: 'Troca',
        rowId: `${pedido.id}-exchange-${exchangeId}`,
        displayStatus: data.status.toLowerCase(),
        exchangeId: exchangeId
      });
    }

    return result;
  
  }).filter(p => {
    // A sua lógica de filtro (que já estava correta)
    if (abaAtiva === 'geral') return true;

    if (p.displayType === 'Troca') {
      const itemDisplayStatus = p.displayStatus.toUpperCase();
      switch (abaAtiva) {
        case 'exchange':
          return itemDisplayStatus === 'EXCHANGE' || itemDisplayStatus === 'PENDING';
        case 'exchange_authorized':
          return itemDisplayStatus === 'EXCHANGE_AUTHORIZED';
        default:
          return false;
      }
    }

    if (['exchange', 'exchange_authorized'].includes(abaAtiva)) {
        return false;
    }

    if (abaAtiva === 'delivered') {
        const validStatusForDelivered = ['DELIVERED', 'EXCHANGE', 'EXCHANGE_AUTHORIZED'];
        return validStatusForDelivered.includes(p.status.toUpperCase()); 
    }

    const orderStatusMap = {
      'processing': 'PROCESSING',
      'approved': 'APPROVED',
      'in_transit': 'IN_TRANSIT',
      'rejected': 'REJECTED',
      'canceled': 'CANCELED',
    };
    return orderStatusMap[abaAtiva] === p.status.toUpperCase(); 
  });
 

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedPedidoParaRecebimento, setSelectedPedidoParaRecebimento] = useState(null);
  const [isPedidoModalOpen, setIsPedidoModalOpen] = useState(false);
  const [selectedPedidoParaVisualizacao, setSelectedPedidoParaVisualizacao] = useState(null);

  const handleOpenReceiveModal = (pedido) => {
    setSelectedPedidoParaRecebimento(pedido);
    setIsReceiveModalOpen(true);
  };

  const handleOpenPedidoModal = (pedido) => {
    const originalPedido = pedidos.find(p => p.id === pedido.id);
    if (originalPedido) {
      setSelectedPedidoParaVisualizacao(originalPedido);
      setIsPedidoModalOpen(true);
    } else {
      console.error("Pedido original não encontrado para o ID:", pedido.id);
    }
  };

  const renderStatusButton = (pedido) => {
    // LÓGICA PARA PEDIDOS COM TROCA
    if (pedido.displayType === 'Troca') {
      const exchangeId = pedido.exchangeId; 
      const exchangeStatus = pedido.displayStatus.toUpperCase();

      switch (exchangeStatus) {
        case 'EXCHANGE':
        case 'PENDING':
          // ... (botões "Ver Detalhes" e "Autorizar Troca")
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
        
        case 'EXCHANGE_AUTHORIZED': 
          // ... (botões "Ver Detalhes" e "Confirmar Recebimento")
          return (
            <div className="status-buttons-container">
              <button
                className="status-button status-detalhes"
                onClick={() => handleOpenPedidoModal(pedido)}
              >
                Ver Detalhes
              </button>
            </div>
          );
        
        default:
          // ... (botão "Ver Detalhes" padrão)
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
        // ... (botão "Em Trânsito")
        return (
          <button
            className="status-button status-processamento"
            onClick={() => handleStatusChange(pedido.id, 'IN_TRANSIT')}
          >
            Em Trânsito
          </button>
        );
      
      case 'processing':
        // ... (botão "Aprovar")
        return (
          <button
            className="status-button status-em_transito"
            onClick={() => handleStatusChange(pedido.id, 'APPROVED')}
          >
            Aprovar
          </button>
        );
      
      case 'in_transit':
        // ... (botão "Confirmar Entrega")
        return (
          <button
            className="status-button status-entregue"
            onClick={() => handleStatusChange(pedido.id, 'DELIVERED')}
          >
            Confirmar Entrega
          </button>
        );
      
      case 'delivered':
        // ... (botão "Ver Detalhes")
        return (
          <button
            className="status-button status-detalhes"
            onClick={() => handleOpenPedidoModal(pedido)}
          >
            Ver Detalhes
          </button>
        );
      
      default:
        // ... (botão "Ver Detalhes" padrão)
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

const handleAuthorizeExchange = async (exchangeId, idCompra) => {
  if (!exchangeId) {
    console.error('ID da troca não encontrado.');
    alert('Erro: ID da troca não associado a este pedido.');
    return;
  }

  if (window.confirm(`Tem certeza que deseja autorizar a TROCA ID: ${exchangeId}?`)) {
    try {
      await postAuthorizeExchanges({}, exchangeId)
      const responseAuthorize = await putExchangesConfirmation(exchangeId);

      if (responseAuthorize?.couponCode) {
        setCodCoupon(responseAuthorize.couponCode);
        alert(`Troca autorizada com sucesso! Cupom gerado: ${responseAuthorize.couponCode}`)
      }

      console.log("retorno",responseAuthorize)

      fetchAllData();
    } catch (error) {
      console.error('Erro ao autorizar troca:', error);
    }
  }
};


  const handleConfirmReceive = async (itemsToRestock) => {
    if (!selectedPedidoParaRecebimento) return;

    // O 'selectedPedidoParaRecebimento' é a linha da tabela,
    // que agora contém o 'exchangeId' correto.
    const exchangeId = selectedPedidoParaRecebimento.exchangeId;

    if (!exchangeId) {
      console.error('Erro fatal: ID da Troca não encontrado no pedido selecionado para recebimento.');
      alert('Erro: ID da Troca não encontrado.');
      return;
    }

    try {
      await postReceiveExchange(exchangeId, itemsToRestock);
      
      // Recarrega todos os dados para refletir a mudança
      fetchAllData();
      
      setIsReceiveModalOpen(false);
      setSelectedPedidoParaRecebimento(null);
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
                  <th>TIPO</th>
                  <th>ID DA TROCA</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {pedidosParaExibir.map((pedido) => (
                  <tr key={pedido.rowId}>
                    <td>{pedido.id}</td>
                    <td>{pedido.clientId}</td>
                    <td>R$ {pedido.total.toFixed(2).replace('.', ',')}</td>
                    <td>
                      {pedido.payments && pedido.payments.length > 0
                        ? pedido.payments.map((p) => p.type).join(', ')
                        : 'N/A'}
                    </td>
                    <td>
                      {pedido.displayStatus.charAt(0).toUpperCase() + pedido.displayStatus.slice(1).toLowerCase()}
                    </td>
                    <td>{pedido.displayType}</td>
                    <td>
                      {pedido.exchangeId || 'N/A'}
                    </td>
                    <td>{renderStatusButton(pedido)}</td>
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