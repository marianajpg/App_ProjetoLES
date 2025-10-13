import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LivroModal from '../../components/LivroModal';
import AbasFiltro from '../../components/AbasFiltro';
import CampoPesquisa from '../../components/CampoPesquisa';
import ProdutoCard from '../../components/ProdutoCard';
import '../../styles/colaborador/ConsultaLivros.css';
import Header from '../../components/Header.jsx';

// Mock data that matches the full API structure
const mockLivros = [
  { 
    id: 1, 
    title: 'O Senhor dos Anéis', 
    author: 'J.R.R. Tolkien', 
    publisher: 'HarperCollins', 
    year: 1954,
    edition: '1ª Edição',
    ISBN: '978-0618640157',
    pages: 1216,
    synopsis: 'Uma jornada épica para destruir um anel poderoso e salvar a Terra-média da escuridão.',
    dimensions: { height: 22, width: 15, depth: 5, weight: 1500 },
    barcode: '9780618640157',
    price: '129.90',
    status: 'ACTIVE',
    pricegroup: { id: 1, name: 'Padrão' },
    ativo: true, // For filtering
    imagens: [{ url: 'https://m.media-amazon.com/images/I/81hCVEC0ExL._SY466_.jpg' }] 
  },
  { 
    id: 2, 
    title: 'Duna', 
    author: 'Frank Herbert', 
    publisher: 'Aleph', 
    year: 1965,
    edition: 'Edição de Colecionador',
    ISBN: '978-8576570013',
    pages: 688,
    synopsis: 'Em um futuro distante, casas nobres lutam pelo controle do planeta desértico Arrakis.',
    dimensions: { height: 23, width: 16, depth: 4, weight: 900 },
    barcode: '9788576570013',
    price: '89.90',
    status: 'ACTIVE',
    pricegroup: { id: 1, name: 'Padrão' },
    ativo: true,
    imagens: [{ url: 'https://m.media-amazon.com/images/I/81zN7udGRUL._SY425_.jpg' }] 
  },
  { 
    id: 3, 
    title: 'O Guia do Mochileiro das Galáxias', 
    author: 'Douglas Adams', 
    publisher: 'Arqueiro', 
    year: 1979,
    edition: 'Edição Definitiva',
    ISBN: '978-8576570488',
    pages: 208,
    synopsis: 'As aventuras de um humano azarado após a demolição da Terra para a construção de uma via expressa hiperespacial.',
    dimensions: { height: 21, width: 14, depth: 2, weight: 300 },
    barcode: '9788576570488',
    price: '39.90',
    status: 'INACTIVE',
    pricegroup: { id: 2, name: 'Promoção' },
    ativo: false,
    imagens: [{ url: 'https://m.media-amazon.com/images/I/51B7vacPfEL._SY445_SX342_.jpg' }] 
  },
];


const ConsultaLivros = () => {
  const navigate = useNavigate();
  const [livros, setLivros] = useState(mockLivros);
  const [abaAtiva, setAbaAtiva] = useState('todos');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  
  const [modalAberto, setModalAberto] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  const handleAbrirModal = (livro = null) => {
    setLivroSelecionado(livro);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setLivroSelecionado(null);
  };

  const handleSalvar = (dadosDoLivro) => {
    if (livroSelecionado) { // Edit Mode
      console.log('Atualizando livro:', dadosDoLivro);
      const updatedLivros = livros.map(livro => 
        livro.id === dadosDoLivro.id ? { ...livro, ...dadosDoLivro } : livro
      );
      setLivros(updatedLivros);
    } else { // Create Mode
      console.log('Criando novo livro:', dadosDoLivro);
      const livroCriado = { 
        ...dadosDoLivro, 
        id: Math.random(), // Simulate new ID
        ativo: dadosDoLivro.status === 'ACTIVE',
        pricegroup: { id: dadosDoLivro.pricegroupId, name: 'Novo Grupo' } // Simulate
      };
      setLivros(prev => [...prev, livroCriado]);
    }
    handleFecharModal();
  };

  const livrosFiltrados = livros.filter(livro => {
    const termo = termoPesquisa.toLowerCase();
    const correspondePesquisa = (livro.title || '').toLowerCase().includes(termo) || 
                              (livro.author || '').toLowerCase().includes(termo) || 
                              (livro.publisher || '').toLowerCase().includes(termo);

    if (abaAtiva === 'todos') return correspondePesquisa;
    if (abaAtiva === 'ativos') return correspondePesquisa && livro.ativo;
    if (abaAtiva === 'inativos') return correspondePesquisa && !livro.ativo;
    return true;
  });

  return (
    <div>
      <Header tipoUsuario="colaborador" />
      <div className="consulta-livros">
        <h1>Consulta de Livros</h1>
        <div className="abas-e-botao-container">
          <AbasFiltro 
            abaAtiva={abaAtiva} 
            setAbaAtiva={setAbaAtiva} 
            abas={[{ id: 'todos', label: 'Todos' }, { id: 'ativos', label: 'Ativos' }, { id: 'inativos', label: 'Inativos' }]} 
          />
          <button 
            className="botao-criar" 
            onClick={() => handleAbrirModal()}
            title="Criar Novo Livro"
          >
            +
          </button>
        </div>
        <CampoPesquisa termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} />
        <div className="livros-container">
          {livrosFiltrados.map((livro) => (
            <ProdutoCard
              key={livro.id}
              id={livro.id}
              capaUrl={livro.imagens?.[0]?.url ?? 'https://via.placeholder.com/150'}
              titulo={livro.title}
              autor={livro.author}
              editora={livro.publisher}
              preco={livro.price}
              // Estoque não existe mais na estrutura principal, removido para consistência
              // estoque={livro.estoque?.quantidade} 
              onClick={() => handleAbrirModal(livro)}
            />
          ))}
        </div>
      </div>
      {modalAberto && <LivroModal onClose={handleFecharModal} onSave={handleSalvar} livro={livroSelecionado} />}
    </div>
  );
};

export default ConsultaLivros;