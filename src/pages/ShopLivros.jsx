
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import FiltrosLivro from '../components/FiltrosLivro';
import ProdutoCard from '../components/ProdutoCard';
import '../styles/ShopLivros.css';
import CampoPesquisa from '../components/CampoPesquisa';
import InfoSection from '../components/InfoSection.jsx';

// Dados mockados para simular um catálogo de livros.
const mockLivros = [
  { id: 1, titulo: 'A Vida Secreta das Árvores', autor: { nome: 'Peter Wohlleben' }, editora: { nome: 'Sextante' }, ano: 2016, valorVenda: 48.99, categorias: [{ nome: 'Não-ficção' }, { nome: 'Ciência' }], imagens: [{ url: 'https://m.media-amazon.com/images/I/414U616yzqL._SY445_SX342_.jpg' }], estoque: [{ quantidade: 15 }] },
  { id: 2, titulo: 'O Homem Mais Rico da Babilônia', autor: { nome: 'George S. Clason' }, editora: { nome: 'HarperCollins' }, ano: 2017, valorVenda: 25.99, categorias: [{ nome: 'Finanças' }, { nome: 'Desenvolvimento Pessoal' }], imagens: [{ url: 'https://m.media-amazon.com/images/I/41Xc4wyyMIL._SY445_SX342_.jpg' }], estoque: [{ quantidade: 30 }] },
  { id: 3, titulo: 'Pai Rico, Pai Pobre', autor: { nome: 'Robert T. Kiyosaki' }, editora: { nome: 'Alta Books' }, ano: 2018, valorVenda: 35.50, categorias: [{ nome: 'Finanças' }, { nome: 'Desenvolvimento Pessoal' }], imagens: [{ url: 'https://m.media-amazon.com/images/I/51UjO3YMafL._SY445_SX342_.jpg' }], estoque: [{ quantidade: 25 }] },
  { id: 4, titulo: 'Sapiens: Uma Breve História da Humanidade', autor: { nome: 'Yuval Noah Harari' }, editora: { nome: 'L&PM' }, ano: 2015, valorVenda: 69.90, categorias: [{ nome: 'História' }, { nome: 'Antropologia' }], imagens: [{ url: 'https://m.media-amazon.com/images/I/41FU42ESk5L._SY445_SX342_.jpg' }], estoque: [{ quantidade: 10 }] },
  { id: 5, titulo: '1984', autor: { nome: 'George Orwell' }, editora: { nome: 'Companhia das Letras' }, ano: 2009, valorVenda: 22.80, categorias: [{ nome: 'Ficção' }, { nome: 'Distopia' }], imagens: [{ url: 'https://m.media-amazon.com/images/I/51VXYaKO-sL._SY445_SX342_.jpg' }], estoque: [{ quantidade: 50 }] }
];

// Página de catálogo de livros, com funcionalidades de pesquisa e filtro.
const ShopLivros = () => {
  const breadcrumbItems = [{ label: 'Home', link: '/' }, { label: 'Livros', link: '' }];

  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [filtros, setFiltros] = useState({ autores: [], editoras: [], anos: [], faixasDePreco: [], categorias: [], ordenacao: '' });
  const [livros, setLivros] = useState(mockLivros);

  const faixasDePreco = [
    { label: 'R$10–R$30', min: 10, max: 30 },
    { label: 'R$30–R$50', min: 30, max: 50 },
    { label: 'R$50–R$100', min: 50, max: 100 },
    { label: 'R$100–R$150', min: 100, max: 150 },
  ];

  // Função principal que aplica a pesquisa, os filtros e a ordenação sobre a lista de livros.
  const filtrarLivros = () => {
    let filtrados = livros.filter((livro) => {
      const termo = termoPesquisa.toLowerCase();
  
      const correspondePesquisa = termo === '' || livro.titulo.toLowerCase().includes(termo) || livro.autor?.nome.toLowerCase().includes(termo) || livro.editora?.nome.toLowerCase().includes(termo);
      const anoValido = filtros.anos.length === 0 || filtros.anos.includes(livro.ano);
      const faixaPrecoValida = filtros.faixasDePreco.length === 0 || filtros.faixasDePreco.some((faixaLabel) => {
        const faixa = faixasDePreco.find((f) => f.label === faixaLabel);
        return faixa && livro.valorVenda >= faixa.min && livro.valorVenda <= faixa.max;
      });
      const categoriaValida = filtros.categorias.length === 0 || filtros.categorias.some((cat) => livro.categorias.map(c => c.nome).includes(cat));
  
      return correspondePesquisa && anoValido && faixaPrecoValida && categoriaValida;
    });
  
    // Aplica a ordenação selecionada.
    switch (filtros.ordenacao) {
      case 'Menor preço': filtrados.sort((a, b) => a.valorVenda - b.valorVenda); break;
      case 'Maior preço': filtrados.sort((a, b) => b.valorVenda - a.valorVenda); break;
      case 'Mais recentes': filtrados.sort((a, b) => b.ano - a.ano); break;
      default: break;
    }
    return filtrados;
  };
  
  const livrosFiltrados = filtrarLivros();

  return (
    <div>
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="shop-titulo">CATÁLOGO DE LIVROS</h1>
      <CampoPesquisa termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} />
      <div className="main-container">
        <FiltrosLivro onFiltroChange={setFiltros} />
        <div className="cards-container">
          {livrosFiltrados.map((livro) => (
            <ProdutoCard
              key={livro.id}
              id={livro.id}
              capaUrl={livro.imagens?.[0]?.url ?? 'https://via.placeholder.com/150'}
              titulo={livro.titulo}
              autor={livro.autor?.nome ?? 'Autor desconhecido'}
              preco={livro.valorVenda}
              estoque={livro.estoque?.reduce((total, item) => total + item.quantidade, 0) ?? 0}
              imagens={livro.imagens ?? []}
              editora={livro.editora?.nome ?? 'Editora desconhecida'}
              extra={null}
            />
          ))}
        </div>
      </div>
      <InfoSection />
    </div>
  );
};

export default ShopLivros;
