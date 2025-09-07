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
    status: [],
    genero: [], // Novo
    anoNascimento: [], // Novo
    dataCriacao: [], // Novo
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
    { // Novo filtro: Gênero
      id: 'genero',
      titulo: 'Gênero',
      tipo: 'checkbox',
      opcoes: [
        { id: 'FEMININO', label: 'Feminino' },
        { id: 'MASCULINO', label: 'Masculino' },
        { id: 'OUTRO', label: 'Outro' },
        { id: 'PREFIRO_NAO_DIZER', label: 'Prefiro não dizer' }
      ],
    },
    { // Novo filtro: Ano de Nascimento
      id: 'anoNascimento',
      titulo: 'Ano de Nascimento',
      tipo: 'checkbox',
      opcoes: [
        { id: 'antes1990', label: 'Antes de 1990' },
        { id: '1990-1999', label: '1990-1999' },
        { id: '2000-2009', label: '2000-2009' },
        { id: '2010-2019', label: '2010-2019' },
        { id: '2020ouDepois', label: '2020 ou Depois' },
      ],
    },
    { // Novo filtro: Data de Criação
      id: 'dataCriacao',
      titulo: 'Data de Criação',
      tipo: 'checkbox',
      opcoes: [
        { id: 'antes2020', label: 'Antes de 2020' },
        { id: '2020', label: '2020' },
        { id: '2021', label: '2021' },
        { id: '2022', label: '2022' },
        { id: '2023', label: '2023' },
        { id: '2024', label: '2024' },
        { id: '2025ouDepois', label: '2025 ou Depois' },
      ],
    },
  ];

  // Filtra os clientes com base nos critérios selecionados
  const filtrarClientes = (clientes) => {
    return clientes.filter((cliente) => {
      const ativoTexto = cliente.ativo ? 'ativo' : 'desativado';
  
      // 1. Filtro por aba ativa
      const correspondeAba = abaAtiva === 'geral' || abaAtiva === ativoTexto;
  
      // 2. Filtro por termo de pesquisa (agora suporta múltiplos termos)
      const termos = termoPesquisa.toLowerCase().split(' ').filter(t => t.length > 0); // Divide por espaço e remove termos vazios
  
      const correspondePesquisa = termos.every(termo => {
        // Campos de informações pessoais
        const camposPessoais = [
          cliente.name,
          cliente.cpf,
          cliente.phone,
          cliente.gender, // Gênero
          cliente.email,
        ].filter(Boolean).map(field => String(field).toLowerCase()); // Converte para string e minúsculas
  
        // Campos de endereço
        const camposEndereco = cliente.addresses ? cliente.addresses.flatMap(address => [
          address.residenceType,
          address.streetType,
          address.street,
          address.number,
          address.complement,
          address.neighborhood,
          address.zipCode,
          address.city,
          address.state,
          address.observations,
          address.country,
        ].filter(Boolean).map(field => String(field).toLowerCase())) : [];
  
        const todosCampos = [...camposPessoais, ...camposEndereco];
  
        return todosCampos.some(campo => campo.includes(termo));
      });
  
      // 3. Filtro por status (agora suporta múltiplas seleções)
      const filtroStatus = 
        valoresFiltro.status.length === 0 || // Se nenhum status selecionado, mostra todos
        valoresFiltro.status.includes(ativoTexto); // Ou se o status do cliente está nos selecionados
  
      // 4. Novo filtro: Gênero
      const filtroGenero = 
        valoresFiltro.genero.length === 0 ||
        (cliente.gender && valoresFiltro.genero.includes(cliente.gender));
  
      // 5. Novo filtro: Ano de Nascimento
      const filtroAnoNascimento = 
        valoresFiltro.anoNascimento.length === 0 ||
        (cliente.birthdaydate && valoresFiltro.anoNascimento.some(filtro => {
          const anoNascimento = new Date(cliente.birthdaydate).getFullYear();
          if (filtro === 'antes1990') return anoNascimento < 1990;
          if (filtro === '1990-1999') return anoNascimento >= 1990 && anoNascimento <= 1999;
          if (filtro === '2000-2009') return anoNascimento >= 2000 && anoNascimento <= 2009;
          if (filtro === '2010-2019') return anoNascimento >= 2010 && anoNascimento <= 2019;
          if (filtro === '2020ouDepois') return anoNascimento >= 2020;
          return false;
        }));
  
      // 6. Novo filtro: Data de Criação (assumindo que cliente.createdAt existe e é uma string de data)
      const filtroDataCriacao = 
        valoresFiltro.dataCriacao.length === 0 ||
        (cliente.createdAt && valoresFiltro.dataCriacao.some(filtro => {
          const anoCriacao = new Date(cliente.createdAt).getFullYear();
          if (filtro === 'antes2020') return anoCriacao < 2020;
          if (filtro === '2020') return anoCriacao === 2020;
          if (filtro === '2021') return anoCriacao === 2021;
          if (filtro === '2022') return anoCriacao === 2022;
          if (filtro === '2023') return anoCriacao === 2023;
          if (filtro === '2024') return anoCriacao === 2024;
          if (filtro === '2025ouDepois') return anoCriacao >= 2025;
          return false;
        }));
  
      return correspondeAba && correspondePesquisa && filtroStatus && filtroGenero && filtroAnoNascimento && filtroDataCriacao;
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