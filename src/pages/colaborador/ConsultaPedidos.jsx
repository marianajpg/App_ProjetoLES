import React, { useState } from 'react';
import Header from '../../components/Header';
import AbasFiltro from '../../components/AbasFiltro';
import CampoPesquisa from '../../components/CampoPesquisa';
import '../../styles/colaborador/ConsultaPedidos.css';

// Página para colaboradores consultarem e gerenciarem o status dos pedidos.
const ConsultaPedidos = () => {
  const [abaAtiva, setAbaAtiva] = useState('geral');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [valoresFiltro, setValoresFiltro] = useState({ status: [] });

  const abas = [
    { id: 'geral', label: 'Geral' },
    { id: 'processamento', label: 'Processando' },
    { id: 'em_transito', label: 'Em Trânsito' },
    { id: 'entregue', label: 'Entregue' },
    { id: 'troca', label: 'Troca' },
  ];

  const filtros = [
    { id: 'status', titulo: 'Status do Pedido', tipo: 'checkbox', opcoes: [
        { id: 'processamento', label: 'Processando' }, { id: 'em_transito', label: 'Em Trânsito' },
        { id: 'entregue', label: 'Entregue' }, { id: 'troca', label: 'Troca' },
    ]},
  ];

  // Dados mockados para simular uma lista de pedidos.
  const [pedidos, setPedidos] = useState([
    { idCompra: '12345', idProduto: '1', cliente: 'João da Silva', total: 129.9, status: 'processamento' },
    { idCompra: '67890', idProduto: '2', cliente: 'Maria Oliveira', total: 89.9, status: 'em_transito' },
    { idCompra: '11223', idProduto: '3', cliente: 'Carlos Pereira', total: 250.0, status: 'entregue' },
    { idCompra: '44556', idProduto: '4', cliente: 'Ana Costa', total: 75.5, status: 'troca' },
  ]);

  // Altera o status de um pedido (simulação local).
  const handleStatusChange = (idCompra, novoStatus) => {
    setPedidos(pedidos.map(p => (p.idCompra === idCompra ? { ...p, status: novoStatus } : p)));
  };

  // Filtra os pedidos com base na pesquisa, aba de status e filtros de checkbox.
  const pedidosFiltrados = pedidos.filter(pedido => {
    const termo = termoPesquisa.toLowerCase();
    const status = pedido.status.toLowerCase();
    const correspondePesquisa = pedido.idCompra.toLowerCase().includes(termo) || pedido.cliente.toLowerCase().includes(termo);
    const correspondeAba = abaAtiva === 'geral' || status === abaAtiva;
    const correspondeFiltro = valoresFiltro.status.length === 0 || valoresFiltro.status.includes(status);
    return correspondePesquisa && correspondeAba && correspondeFiltro;
  });

  // Renderiza o botão de ação apropriado com base no status atual do pedido.
  const renderStatusButton = (pedido) => {
    switch (pedido.status) {
      case 'processamento': return <button className="status-button status-em_transito" onClick={() => handleStatusChange(pedido.idCompra, 'em_transito')}>Em Trânsito</button>;
      case 'em_transito': return <button className="status-button status-entregue" onClick={() => handleStatusChange(pedido.idCompra, 'entregue')}>Confirmar Entrega</button>;
      case 'entregue': return <button className="status-button status-troca" onClick={() => handleStatusChange(pedido.idCompra, 'troca')}>Troca</button>;
      case 'troca': return <button className="status-button status-troca" disabled>Troca Solicitada</button>;
      default: return null;
    }
  }

  return (
    <div>
      <Header tipoUsuario="colaborador" />
      <div className="consulta-pedidos">
        <h1>Consulta de Pedidos</h1>
        <AbasFiltro abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} abas={abas} />
        <CampoPesquisa termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} filtros={filtros} valoresFiltro={valoresFiltro} setValoresFiltro={setValoresFiltro} />
        <div className="pedidos-container">
          <table className="tabela-pedidos">
            <thead>
              <tr><th>CLIENTE</th><th>ID PRODUTO</th><th>ID COMPRA</th><th>VALOR TOTAL</th><th className="status-header">STATUS</th></tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.idCompra}>
                  <td>{pedido.cliente}</td>
                  <td>{pedido.idProduto}</td>
                  <td>{pedido.idCompra}</td>
                  <td>R$ {pedido.total.toFixed(2).replace('.', ',')}</td>
                  <td>{renderStatusButton(pedido)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsultaPedidos;