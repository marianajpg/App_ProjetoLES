import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import InfoSection from '../components/InfoSection.jsx';
import ProdutoCard from '../components/ProdutoCard.jsx';
import Banner from '../components/Banner.jsx';
import {getBooks} from '../services/books'
import {getInventory} from '../services/inventory';
import { getCategory } from '../services/category';
import '../styles/Home.css';

// Página principal da aplicação, exibe livros em destaque e categorias.
const Home = () => {
  const navigate = useNavigate();
  // Dados mockados para a seção de categorias.
  const categories = [
    { id: 1, name: 'Ficção Científica', color: 'var(--primary-color)' },
    { id: 2, name: 'Fantasia', color: 'var(--secondary-color)' },
    { id: 3, name: 'Romance', color: 'var(--tertiary-color)' },
    { id: 4, name: 'Mistério', color: 'var(--quaternary-color)' },
  ];

  const [allProdutos, setAllProdutos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
      const fetchAllBooksAndInventory = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const [booksResponse, inventoryResponse] = await Promise.all([
            getBooks({}),
            getInventory()
          ]);
  
          const booksArray = Array.isArray(booksResponse) ? booksResponse.slice(0, 4) : booksResponse.books.slice(0, 4) || [];
          console.log("LIvros", booksArray)
          const inventoryArray = Array.isArray(inventoryResponse) ? inventoryResponse : inventoryResponse.inventory || [];
  
          const booksWithInventory = booksArray.map(book => {
            const totalQuantity = inventoryArray
              .filter(item => item.bookId === book.id)
              .reduce((sum, item) => sum + item.quantity, 0);
            return { ...book, inventory: totalQuantity };
          });
          setAllProdutos(booksWithInventory);
        } catch (err) {
          setError('Não foi possível carregar os livros ou o estoque. Tente novamente mais tarde.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchAllBooksAndInventory();
    }, []);

   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategory();

        const listaCopia = [...categoriesData];

        // Embaralha a cópia da lista
        for (let i = listaCopia.length - 1; i > 0; i--) {
          // Gera um índice aleatório
          const j = Math.floor(Math.random() * (i + 1));
          
          // Troca os elementos de posição
          [listaCopia[i], listaCopia[j]] = [listaCopia[j], listaCopia[i]];
        }

        const quatroCategorias = listaCopia.slice(0, 4);

        console.log(quatroCategorias);
        setCategorias(quatroCategorias);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <main className="main-content">
      <Header tipoUsuario="cliente" tipoBotao="BotaoLogin" />
      <Banner 
        backgroundColor='#ffebe1'
        image='/src/images/image_banner.png'
        title='Descubra Novas Histórias'
        description='Milhares de títulos esperando por você. Encontre sua próxima leitura favorita!'
        link='/shop-livros'
        linkText='Explorar Livros'
        textColor='#333'
        buttonColor='#852f1b'
        buttonTextColor='#fff'
      />

      <section className="home-section">
        <h2 className="home-section-title">Livros em Destaque</h2>
        <div className="produtos-grid">
          {allProdutos.map((livro) => (
              <ProdutoCard
                key={livro.id}
                id={livro.id}
                capaUrl={
                  livro.images && livro.images.length > 0 ?  livro.images.find(img => img.caption === 'Principal').url: ""}
                titulo={livro.title}
                autor={livro.author ?? 'Autor desconhecido'}
                preco={parseFloat(livro.price).toFixed(2) || 0}
                estoque={livro.inventory}
                imagens={livro.images}
                editora={livro.publisher ?? 'Editora desconhecida'}
                onClick={() => navigate(`/tela-produto/${livro.id}`, { state: { livro } })}
              />
            ))}
        </div>
        <div className="shop-link-container">
          <Link to="/shop-livros" className="shop-link-button">Ver todos os livros</Link>
        </div>
      </section>

      <section className="home-section categories-section">
        <h2 className="home-section-title">Navegue por Categorias</h2>
        <div className="categories-grid">
          {categorias.map((categoria, index) => (
            <div key={categoria.id} className="category-card" style={{ backgroundColor: categories[index % categories.length].color }} onClick={() => navigate('/shop-livros', { state: { categoria: categoria.name } })}>
              <h3 className="category-name">{categoria.name}</h3>
            </div>
          ))}

        </div>
      </section>

      <InfoSection />
    </main>
  );
};

export default Home;
