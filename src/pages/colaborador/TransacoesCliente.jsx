
import React, { useState, useEffect } from 'react';
import CampoPesquisa from '../../components/CampoPesquisa.jsx';
import TabelaTransacoes from '../../components/TabelaTransacoes.jsx';
import '../../styles/colaborador/TransacoesCliente.css';
import axios from 'axios';

// Componente para exibir as transações de um cliente específico.
function TransacoesCliente({ clienteId }) { // Recebe o ID do cliente como propriedade.
  const [abaAtiva, setAbaAtiva] = useState('todas');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [valoresFiltro, setValoresFiltro] = useState({});
  const [transacoes, setTransacoes] = useState([]); 

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

  // Busca as transações de uma API (usando JSONPlaceholder como exemplo).
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        // Formata os dados recebidos para o formato esperado pela tabela.
        const transacoesFormatadas = response.data.map((post) => ({
          id: post.id,
          data: new Date().toLocaleDateString(),
          desconto: `R$ ${(Math.random() * 50).toFixed(2)}`,
          valorTotal: `R$ ${(Math.random() * 500).toFixed(2)}`,
          formaPagamento: Math.random() > 0.5 ? 'Cartão Único' : 'Múltiplos Cartões',
          detalhes: 'Ver detalhes',
        }));
        setTransacoes(transacoesFormatadas);
      })
      .catch((error) => console.error('Erro ao buscar transações:', error));
  }, [clienteId]); // Adiciona clienteId como dependência para buscar novas transações se o cliente mudar.

  // Filtra as transações com base na aba e na pesquisa.
  const transacoesFiltradas = transacoes.filter((transacao) => {
    const correspondeAba = abaAtiva === 'todas' || transacao.formaPagamento === abaAtiva;
    const correspondePesquisa = transacao.formaPagamento.toLowerCase().includes(termoPesquisa.toLowerCase()) || transacao.valorTotal.toLowerCase().includes(termoPesquisa.toLowerCase());
    const correspondeFiltro = !valoresFiltro.formaPagamento || transacao.formaPagamento === valoresFiltro.formaPagamento;
    return correspondeAba && correspondePesquisa && correspondeFiltro;
  });

  return (
    <div className="transacoes-colaborador">
      <CampoPesquisa termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} filtros={filtros} valoresFiltro={valoresFiltro} setValoresFiltro={setValoresFiltro} />
      <TabelaTransacoes transacoes={transacoesFiltradas} />
    </div>
  );
}

export default TransacoesCliente;
