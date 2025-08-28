import React, { useState } from 'react';
import EditarLivroModal from '../../components/EditarLivroModal';
import AbasFiltro from '../../components/AbasFiltro';
import CampoPesquisa from '../../components/CampoPesquisa';
import ProdutoCard from '../../components/ProdutoCard';
import '../../styles/colaborador/ConsultaLivros.css';
import Header from '../../components/Header.jsx';

const ConsultaLivros = () => {
  const mockLivros = [
    {
      id: 1,
      titulo: 'O Senhor dos Anéis',
      autor: { nome: 'J.R.R. Tolkien' },
      editora: { nome: 'HarperCollins' },
      valorVenda: 59.9,
      estoque: { quantidade: 10 },
      ativo: true,
      imagens: [{ url: 'https://m.media-amazon.com/images/I/81hCVEC0ExL._SY466_.jpg' }],
    },
    {
      id: 2,
      titulo: 'Duna',
      autor: { nome: 'Frank Herbert' },
      editora: { nome: 'Aleph' },
      valorVenda: 49.9,
      estoque: { quantidade: 5 },
      ativo: true,
      imagens: [{ url: 'https://m.media-amazon.com/images/I/81zN7udGRUL._SY425_.jpg' }],
    },
    {
      id: 3,
      titulo: 'O Guia do Mochileiro das Galáxias',
      autor: { nome: 'Douglas Adams' },
      editora: { nome: 'Arqueiro' },
      valorVenda: 39.9,
      estoque: { quantidade: 0 },
      ativo: false,
      imagens: [{ url: 'https://m.media-amazon.com/images/I/51B7vacPfEL._SY445_SX342_.jpg' }],
    },
    {
      id: 4,
      titulo: 'A Fundação',
      autor: { nome: 'Isaac Asimov' },
      editora: { nome: 'Aleph' },
      valorVenda: 45.0,
      estoque: { quantidade: 20 },
      ativo: true,
      imagens: [{ url: 'https://m.media-amazon.com/images/I/51wraeKdcxL._SY445_SX342_.jpg' }],
    },
  ];

  const [livros, setLivros] = useState(mockLivros);
  const [abaAtiva, setAbaAtiva] = useState('todos');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  const handleAbrirModal = (livro) => {
    setLivroSelecionado(livro);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setLivroSelecionado(null);
  };

  const handleSalvar = (dados) => {
    const updatedLivros = livros.map(livro => 
      livro.id === dados.id ? dados : livro
    );
    setLivros(updatedLivros);
    handleFecharModal();
  };

  const livrosFiltrados = livros.filter(livro => {
    const termo = termoPesquisa.toLowerCase();
    const ativado = livro.ativo;

    const correspondePesquisa = 
      livro.titulo.toLowerCase().includes(termo) ||
      livro.autor?.nome.toLowerCase().includes(termo) ||
      livro.editora?.nome.toLowerCase().includes(termo);

    if (abaAtiva === 'todos') {
      return correspondePesquisa;
    } else if (abaAtiva === 'ativos') {
      return correspondePesquisa && ativado;
    } else if (abaAtiva === 'inativos') {
      return correspondePesquisa && !ativado;
    }
    return true;
  });

  return (
    <div>
      <Header tipoUsuario="colaborador" />
      <div className="consulta-livros">
        <h1>Consulta de Livros</h1>
        <AbasFiltro 
          abaAtiva={abaAtiva} 
          setAbaAtiva={setAbaAtiva} 
          abas={[{ id: 'todos', label: 'Todos' }, { id: 'ativos', label: 'Ativos' }, { id: 'inativos', label: 'Inativos' }]}
        />
        <CampoPesquisa
          termoPesquisa={termoPesquisa}
          setTermoPesquisa={setTermoPesquisa}
        />
        <div className="livros-container">
          {livrosFiltrados.map((livro) => (
            <ProdutoCard
              key={livro.id}
              id={livro.id}
              capaUrl={livro.imagens?.[0]?.url ?? 'https://via.placeholder.com/150'}
              titulo={livro.titulo}
              autor={livro.autor?.nome}
              editora={livro.editora?.nome}
              preco={livro.valorVenda}
              estoque={livro.estoque?.quantidade}
              onClick={() => handleAbrirModal(livro)}
            />
          ))}
        </div>
      </div>
      {modalAberto && (
        <EditarLivroModal onClose={handleFecharModal} onSave={handleSalvar} livro={livroSelecionado} />
      )}
    </div>
  );
};

export default ConsultaLivros;