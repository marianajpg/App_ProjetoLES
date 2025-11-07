
import React, { useState, useEffect } from 'react';
import CampoPesquisa from '../../components/CampoPesquisa.jsx';
import TabelaTransacoes from '../../components/TabelaTransacoes.jsx';
import ModalPedido from '../../components/ModalPedido.jsx'; 
import '../../styles/colaborador/TransacoesCliente.css';
import { getCheckout } from '../../services/checkout.jsx';

// Componente para exibir as transações de um cliente específico.
function TransacoesCliente({ clienteId }) { // Recebe o ID do cliente como propriedade.
  const [abaAtiva, setAbaAtiva] = useState('todas');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [valoresFiltro, setValoresFiltro] = useState({});
  const [transacoes, setTransacoes] = useState([]);
  const [transacoesOriginais, setTransacoesOriginais] = useState([]); 
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null); 
  const [modalAberto, setModalAberto] = useState(false); 
  const abas = [
    { id: 'todas', label: 'Todas' },
    { id: 'Cartão Único', label: 'Cartão Único' },
    { id: 'Múltiplos Cartões', label: 'Múltiplos Cartões' },
  ];

  const filtros = [
    { id: 'formaPagamento', titulo: 'Forma de Pagamento', tipo: 'checkbox', opcoes: [
        { id: 'Cartão Único', label: 'Cartão Único' }, { id: 'Múltiplos Cartões', label: 'Múltiplos Cartões' }
    ]},
  ];

  useEffect(() => {
    const fetchTransacoes = async () => {
      try {
        const response = await getCheckout();
        const transacoesCliente = response.filter(
          (transacao) => transacao.clientId === clienteId
        );
        setTransacoesOriginais(transacoesCliente); 

        const transacoesFormatadas = transacoesCliente.map((transacao) => ({
          id: transacao.id,
          data: new Date(transacao.created_at).toLocaleDateString(),
          desconto: `R$ ${transacao.appliedDiscount.toFixed(2)}`,
          valorTotal: `R$ ${transacao.total.toFixed(2)}`,
          formaPagamento: transacao.payments.length > 1 ? 'Múltiplos Cartões' : 'Cartão Único',
          status: transacao.status,
          detalhes: 'Ver detalhes',
        }));
        setTransacoes(transacoesFormatadas);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
      }
    };

    if (clienteId) {
      fetchTransacoes();
    }
  }, [clienteId]);

  const handleVerDetalhes = (id) => {
    const pedido = transacoesOriginais.find(t => t.id === id);
    setPedidoSelecionado(pedido);
    setModalAberto(true);
  };

  const handleCloseModal = () => {
    setModalAberto(false);
    setPedidoSelecionado(null);
  };

  // Filtra as transações com base na aba e na pesquisa.
  const transacoesFiltradas = transacoes.filter((transacao) => {
    const correspondeAba = abaAtiva === 'todas' || transacao.formaPagamento === abaAtiva;
    const correspondePesquisa = 
      transacao.formaPagamento.toLowerCase().includes(termoPesquisa.toLowerCase()) || 
      transacao.valorTotal.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      transacao.status.toLowerCase().includes(termoPesquisa.toLowerCase());
    const correspondeFiltro = !valoresFiltro.formaPagamento || transacao.formaPagamento === valoresFiltro.formaPagamento;
    return correspondeAba && correspondePesquisa && correspondeFiltro;
  });

  return (
    <div className="transacoes-colaborador transacoes-cliente-scope">
      <CampoPesquisa termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} filtros={filtros} valoresFiltro={valoresFiltro} setValoresFiltro={setValoresFiltro} />
      <TabelaTransacoes transacoes={transacoesFiltradas} onVerDetalhes={handleVerDetalhes} />
      {modalAberto && pedidoSelecionado && (
        <ModalPedido pedido={pedidoSelecionado} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default TransacoesCliente;
