import React, { useState } from 'react';
import AbasFiltro from '../../components/AbasFiltro.jsx';
import CampoPesquisa from '../../components/CampoPesquisa.jsx';
import TabelaClientes from '../../components/TabelaClientes.jsx';
import Header from '../../components/Header.jsx';
import '../../styles/colaborador/ConsultaClientes.css';

function ConsultaClientes() {
  const [abaAtiva, setAbaAtiva] = useState('geral');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [valoresFiltro, setValoresFiltro] = useState({
    status: [] // Inicializa como array vazio para múltiplas seleções
  });

  // Dados mockados de clientes
  const mockClientes = [
    { id: 1, nome: 'João da Silva', email: 'joao.silva@example.com', ativo: true, dataNascimento: '1990-01-01', telefone: '11999999999' },
    { id: 2, nome: 'Maria Oliveira', email: 'maria.oliveira@example.com', ativo: false, dataNascimento: '1985-05-10', telefone: '21988888888' },
    { id: 3, nome: 'Carlos Pereira', email: 'carlos.pereira@example.com', ativo: true, dataNascimento: '1992-09-20', telefone: '31977777777' },
    { id: 4, nome: 'Ana Costa', email: 'ana.costa@example.com', ativo: true, dataNascimento: '1988-03-15', telefone: '41966666666' },
    { id: 5, nome: 'Pedro Martins', email: 'pedro.martins@example.com', ativo: false, dataNascimento: '1995-11-25', telefone: '51955555555' },
    { id: 6, nome: 'Juliana Santos', email: 'juliana.santos@example.com', ativo: true, dataNascimento: '1998-07-30', telefone: '61944444444' },
    { id: 7, nome: 'Lucas Souza', email: 'lucas.souza@example.com', ativo: true, dataNascimento: '1991-02-20', telefone: '71933333333' },
    { id: 8, nome: 'Fernanda Lima', email: 'fernanda.lima@example.com', ativo: false, dataNascimento: '1980-12-12', telefone: '81922222222' },
    { id: 9, nome: 'Ricardo Alves', email: 'ricardo.alves@example.com', ativo: true, dataNascimento: '1993-10-05', telefone: '91911111111' },
    { id: 10, nome: 'Camila Ribeiro', email: 'camila.ribeiro@example.com', ativo: true, dataNascimento: '1996-04-18', telefone: '11998765432' },
  ];

  const [clientes, setClientes] = useState(mockClientes);

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