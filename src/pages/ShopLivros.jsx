import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import FiltrosLivro from '../components/FiltrosLivro';
import ProdutoCard from '../components/ProdutoCard';
import Paginacao from '../components/Paginacao';
import InfoSection from '../components/InfoSection';
import CampoPesquisa from '../components/CampoPesquisa';
import { getBooks } from '../services/books';
import '../styles/ShopLivros.css';

const faixasDePrecoMap = [
  { label: 'R$10–R$30', min: 10, max: 30 },
  { label: 'R$30–R$50', min: 30, max: 50 },
  { label: 'R$50–R$100', min: 50, max: 100 },
  { label: 'R$100–R$150', min: 100, max: 150 },
];

const ShopLivros = () => {
  const breadcrumbItems = [{ label: 'Home', link: '/' }, { label: 'Livros', link: '' }];
  const navigate = useNavigate();

  const [allProdutos, setAllProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [filtros, setFiltros] = useState({ autores: [], editoras: [], anos: [], faixasDePreco: [], categorias: [], ordenacao: '' });

  useEffect(() => {
    const fetchAllBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getBooks({}); 
        const booksArray = Array.isArray(response) ? response : response.books || [];
        setAllProdutos(booksArray);
      } catch (err) {
        setError('Não foi possível carregar os livros. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBooks();
  }, []);

  // Gera opções para os filtros dinâmicos
  const autorOptions = useMemo(() => 
    [...new Set(allProdutos.map(p => p.author).filter(Boolean))]
      .map(author => ({ value: author, label: author }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    [allProdutos]
  );

  const editoraOptions = useMemo(() => 
    [...new Set(allProdutos.map(p => p.publisher).filter(Boolean))]
      .map(publisher => ({ value: publisher, label: publisher }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    [allProdutos]
  );

  const anoOptions = useMemo(() => 
    [...new Set(allProdutos.map(p => p.year).filter(Boolean))]
      .map(year => ({ value: year, label: year.toString() }))
      .sort((a, b) => a.label.localeCompare(b.label)), 
    [allProdutos]
  );

  const handleFiltroChange = (novosFiltros) => {
    setFiltros(novosFiltros);
    setCurrentPage(1);
  };
  
  const handlePesquisaChange = (termo) => {
    setTermoPesquisa(termo);
    setCurrentPage(1);
  };

const getFilteredAndSearchedItems = () => {
  let items = allProdutos.filter(livro => {
    const termo = termoPesquisa.toLowerCase();
    const correspondePesquisa = termo === '' || 
      livro.title.toLowerCase().includes(termo) ||
      (livro.author && livro.author.toLowerCase().includes(termo));

    const correspondeAutores = filtros.autores.length === 0 || filtros.autores.includes(livro.author);
    const correspondeEditoras = filtros.editoras.length === 0 || filtros.editoras.includes(livro.publisher);
    const correspondeAnos = filtros.anos.length === 0 || filtros.anos.includes(livro.year); // ← FILTRO DE ANOS
    const correspondeCategorias = filtros.categorias.length === 0 || filtros.categorias.some(cat => (livro.categories || []).map(c => c.name).includes(cat));

    const correspondePreco = filtros.faixasDePreco.length === 0 || filtros.faixasDePreco.some(faixaLabel => {
      const faixa = faixasDePrecoMap.find(f => f.label === faixaLabel);
      const price = parseFloat(livro.price);
      return faixa && price >= faixa.min && price <= faixa.max;
    });

    return correspondePesquisa && correspondeAutores && correspondeEditoras && correspondeAnos && correspondeCategorias && correspondePreco;
  });

  switch (filtros.ordenacao) {
    case 'Menor preço': items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break;
    case 'Maior preço': items.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break;
    case 'Mais recentes': items.sort((a, b) => b.year - a.year); break;
    default: break;
  }

  return items;
};

  const filteredItems = getFilteredAndSearchedItems();

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="shop-titulo">CATÁLOGO DE LIVROS</h1>
      <CampoPesquisa termoPesquisa={termoPesquisa} setTermoPesquisa={handlePesquisaChange} />
      <div className="main-container">
        <FiltrosLivro 
          onFiltroChange={handleFiltroChange}
          autorOptions={autorOptions}
          editoraOptions={editoraOptions}
          anoOptions={anoOptions}
        />
        <div className="cards-container">
          {isLoading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p>{error}</p>
          ) : currentItems.length > 0 ? (
            currentItems.map((livro) => (
              <ProdutoCard
                key={livro.id}
                id={livro.id}
                capaUrl={
                  livro.images && livro.images.length > 0 ?  livro.images.find(img => img.caption === 'Principal').url: ""}
                titulo={livro.title}
                autor={livro.author ?? 'Autor desconhecido'}
                preco={parseFloat(livro.price).toFixed(2) || 0}
                estoque={null}
                imagens={livro.images}
                editora={livro.publisher ?? 'Editora desconhecida'}
                onClick={() => navigate(`/tela-produto/${livro.id}`, { state: { livro } })}
              />
            ))
          ) : (
            <div className="nenhum-produto"
            ><img src="/src/images/image-nenhumProduto.png" alt="Nenhum produto encontrado" className="no-pedidos-img" />
            <p>Nenhum livro encontrado com os filtros selecionados.</p></div>
          )}
        </div>
      </div>
      <Paginacao
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <InfoSection />
    </div>
  );
};

export default ShopLivros;

