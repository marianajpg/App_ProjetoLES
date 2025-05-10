import React, { useState, useEffect } from 'react';
import AbasFiltro from '../../components/AbasFiltro.jsx';
import CampoPesquisa from '../../components/CampoPesquisa.jsx';
import TabelaClientes from '../../components/TabelaClientes.jsx';
import Header from '../../components/Header.jsx';
import '../../styles/colaborador/ConsultaClientes.css';
import axios from 'axios';

function ConsultaClientes() {
  const [abaAtiva, setAbaAtiva] = useState('geral');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [clientes, setClientes] = useState([]); // Estado para armazenar os clientes
  const [valoresFiltro, setValoresFiltro] = useState({});

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
      tipo: 'radio',
      opcoes: [
        { id: 'ativo', label: 'Ativo' },
        { id: 'desativado', label: 'Desativado' },
      ],
    },
  ];



  // Busca os clientes da API
  useEffect(() => {
    axios.get('http://localhost:3001/clientes') // Endereço da sua API
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar clientes:', error);
      });
  }, []);

  // Filtra os clientes com base na aba ativa e no termo de pesquisa
  const filtrarClientes = (clientes) => {
    return clientes.filter((cliente) => {
      const ativoTexto = cliente.ativo ? 'ativo' : 'desativado';
  
      const correspondeAba = abaAtiva === 'geral' || abaAtiva === ativoTexto;
  
      const correspondePesquisa =
        cliente.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        cliente.email.toLowerCase().includes(termoPesquisa.toLowerCase());
  
      const filtroStatus =
        !valoresFiltro.status || valoresFiltro.status === ativoTexto;
  
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
        <TabelaClientes clientes={clientesFiltrados} />
      </div>
    </div>
  );
}

export default ConsultaClientes;
