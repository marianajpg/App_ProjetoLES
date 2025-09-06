import React, { useState, useEffect } from 'react';
import AbasFiltro from '../../components/AbasFiltro.jsx';
import CampoPesquisa from '../../components/CampoPesquisa.jsx';
import TabelaClientes from '../../components/TabelaClientes.jsx';
import Header from '../../components/Header.jsx';
import '../../styles/colaborador/ConsultaClientes.css';
import { getCustomer } from '../../services/customers .jsx';

function ConsultaClientes() {
  const [abaAtiva, setAbaAtiva] = useState('geral');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [valoresFiltro, setValoresFiltro] = useState({
    status: [] // Inicializa como array vazio para múltiplas seleções
  });

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getCustomer();
        setClientes(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  // Lista de abas
  const abas = [
    { id: 'geral', label: 'Geral' },
    { id: 'ativo', label: 'Ativos' },
    { id: 'desativado', label: 'Desativados' },
  ];

  const filtros = [
    {
      id: 'status',
      titulo: 'Status do Cliente',
      tipo: 'checkbox',
      opcoes: [
        { id: 'ativo', label: 'Ativo' },
        { id: 'desativado', label: 'Desativado' },
      ],
    },
  ];

  // Filtra os clientes com base nos critérios selecionados
  const filtrarClientes = (clientes) => {
    return clientes.filter((cliente) => {
      const ativoTexto = cliente.ativo ? 'ativo' : 'desativado';
  
      // 1. Filtro por aba ativa
      const correspondeAba = abaAtiva === 'geral' || abaAtiva === ativoTexto;
  
      // 2. Filtro por termo de pesquisa
      const correspondePesquisa =
        termoPesquisa === '' ||
        cliente.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        cliente.email.toLowerCase().includes(termoPesquisa.toLowerCase());
  
      // 3. Filtro por status (agora suporta múltiplas seleções)
      const filtroStatus = 
        valoresFiltro.status.length === 0 || // Se nenhum status selecionado, mostra todos
        valoresFiltro.status.includes(ativoTexto); // Ou se o status do cliente está nos selecionados
  
      return correspondeAba && correspondePesquisa && filtroStatus;
    });
  };

  const clientesFiltrados = filtrarClientes(clientes);

  return (
    <div>
      <Header tipoUsuario="colaborador" tipoBotao="BotaoProfile" />
      <div className="consulta-clientes">
        <h1>Consulta de Clientes</h1>
        <AbasFiltro abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} abas={abas} />
        <CampoPesquisa
          termoPesquisa={termoPesquisa}
          setTermoPesquisa={setTermoPesquisa}
          filtros={filtros}
          valoresFiltro={valoresFiltro}
          setValoresFiltro={setValoresFiltro}
        />
        <TabelaClientes clientes={clientesFiltrados} setClientes={setClientes} />
      </div>
    </div>
  );
}

export default ConsultaClientes;