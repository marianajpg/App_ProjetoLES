import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import Header from '../components/Header.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { useAuth } from '../context/AuthLogin.jsx';
import { getInventory } from '../services/inventory.jsx';
import { getImagesById } from '../services/bookImages.jsx';
import { getBookById } from '../services/books.jsx';
import '../styles/TelaProduto.css';
import InfoSection from '../components/InfoSection.jsx';

const TelaProduto = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { adicionarAoCarrinho } = useCarrinho();

  const [livro, setLivro] = useState(state?.livro);
  const [isLoading, setIsLoading] = useState(!state?.livro);
  const [error, setError] = useState(null);

  const [descricaoExpandida, setDescricaoExpandida] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [estoque, setEstoque] = useState(null);
  const [imagemPrincipal, setImagemPrincipal] = useState('');

  useEffect(() => {
    if (!livro) {
      const fetchBookData = async () => {
        try {
            const data = await getImagesById(id);
            const data_book = await getBookById(id);
            const all_data = data[0].book;
            all_data.categories = data_book.categories;
            setLivro(all_data);
            
        } catch (err) {
          setError('Não foi possível carregar as informações do livro.');
          console.error("Erro ao buscar livro:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBookData();
    }
  }, [id, livro]);

 useEffect(() => {
  if (livro) {
    setIsLoading(false);
    
    // Buscar estoque
    getInventory()
      .then(data => {
        const inventoryItem = data.filter(item => item.bookId === livro.id);
        const totalQuantity = inventoryItem.reduce((total, item) => total + item.quantity, 0);
        setEstoque(totalQuantity);
      })
      .catch(error => {
        console.error("Erro ao buscar estoque:", error);
        setEstoque(0);
      });
    
    // Buscar categorias se não existirem
    if (!livro.categories) {
      const fetchCategories = async () => {
        try {
          const data_book = await getBookById(id);
          const data_categories = data_book.categories;
          setLivro(prev => ({
            ...prev,
            categories: data_categories
          }));
        } catch (err) {
          console.error("Erro ao buscar categorias:", err);
        }
      };
      fetchCategories();
    }
    
    // Definir imagem principal
    const imagens = livro.images && livro.images.length > 0 
      ? livro.images 
      : [{ url: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lzsc7phps7xh2d', caption: 'Principal' }];
    
    const imagemCapa = imagens.find(img => img.caption === 'Principal') || imagens[0];
    setImagemPrincipal(imagemCapa.url);
    
    // Atualizar livro com imagens padrão se necessário
    if (!livro.images || livro.images.length === 0) {
      setLivro(prev => ({
        ...prev,
        images: imagens
      }));
    }
  }
}, [livro, id]);

  if (isLoading) {
    return (
      <div>
        <Header />
        <div style={{ textAlign: 'center', padding: '50px' }}>Carregando...</div>
        <InfoSection />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>{error}</h2>
          <Link to="/shop-livros">Voltar ao Catálogo</Link>
        </div>
        <InfoSection />
      </div>
    );
  }

  if (!livro) {
    return (
      <div>
        <Header />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Livro não encontrado</h2>
          <p>As informações deste livro não foram carregadas. Por favor, volte para o catálogo e selecione um livro novamente.</p>
          <Link to="/shop-livros">Voltar ao Catálogo</Link>
        </div>
        <InfoSection />
      </div>
    );
  }

  // Prepara o objeto do livro com imagens, garantindo que não seja nulo
  const livroComImagens = { ...livro };
  if (!livroComImagens.images || livroComImagens.images.length === 0) {
    livroComImagens.images = [{ url: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lzsc7phps7xh2d', caption: 'Principal' }];
  }

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Livros', link: '/shop-livros' },
    { label: livro.title, link: '' },
  ];

  const handleAdicionarAoCarrinho = () => {
    const itemCarrinho = {
      id: livro.id,
      titulo: livro.title,
      autor: livro.author,
      editora: livro.publisher,
      capaUrl: imagemPrincipal,
      valorVenda: parseFloat(livro.price),
      isbn: livro.ISBN,
      quantidade: quantidade
    };

    adicionarAoCarrinho(itemCarrinho);
    navigate('/carrinho');
  };

  return (
    <div>
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <div className="produto-container">
        <div className="produto-imagens">
          <div className="produto-miniaturas">
            {livroComImagens.images.map((imagem, index) => (
              <img
                key={index}
                src={imagem.url}
                alt={`Miniatura ${index + 1}`}
                className={`miniatura ${imagem.url === imagemPrincipal ? 'ativo' : ''}`}
                onClick={() => setImagemPrincipal(imagem.url)}
              />
            ))}
          </div>
          <div className="produto-imagem-principal">
            <img src={imagemPrincipal} alt={livro.title} />
          </div>
        </div>

        <div className="produto-detalhes">
          <h1>{livro.title}</h1>
          <p className="produto-preco">
            R$ {parseFloat(livro.price).toFixed(2)}
          </p>
          <p><strong>Autor:</strong> {livro.author}</p>
          <p><strong>Editora:</strong> {livro.publisher}</p>

          {estoque !== null ? (
            <p><strong>Estoque disponível:</strong> {estoque}</p>
          ) : (
            <p><strong>Estoque disponível:</strong> Carregando...</p>
          )}

          <div className="produto-quantidade">
            <label>Quantidade:</label>
            <div className="quantidade-controle">
              <input
                type="number"
                min="1"
                max={estoque !== null ? estoque : undefined}
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value, 10) || 1))}
                disabled={estoque === 0}
                data-cy="product-quantity-input"
              />
            </div>
          </div>

          <button
            className="produto-botao"
            onClick={handleAdicionarAoCarrinho}
            disabled={((usuario?.tipoUsuario === 'cliente' || !usuario) && estoque === 0) || (estoque !== null && quantidade > estoque)}
            data-cy="add-to-cart-button"
          >
            {estoque === 0 ? 'Produto Indisponível' : 'Adicionar ao carrinho'}
          </button>
        </div>
      </div>

      <div className="produto-descricao">
        <div className="produto-descricao-header" onClick={() => setDescricaoExpandida(!descricaoExpandida)}>
          <h2>Descrição do Produto</h2>
          <span className={`seta-descricao ${descricaoExpandida ? 'virada' : ''}`}>▼</span>
        </div>

        <div
          className="produto-descricao-conteudo"
          style={{
            maxHeight: descricaoExpandida ? '500px' : '0',
            opacity: descricaoExpandida ? 1 : 0
          }}
        >
          <p><strong>Categorias:</strong> {livro.categories && livro.categories.length > 0 ? livro.categories.map(c => c.name).join(", ") : 'Não especificada'}</p>
          <p><strong>ISBN:</strong> {livro.ISBN || 'Não especificado'}</p>
          <p><strong>Edição:</strong> {livro.edition || 'Não especificada'}</p>
          <p><strong>Páginas:</strong> {livro.pages || 'Não especificado'}</p>
          <p><strong>Ano de publicação:</strong> {livro.year || 'Não especificado'}</p>
          <p><strong>Sinopse:</strong> {livro.synopsis || 'Não especificada'}</p>
          {livro.dimensions &&
            <p>
              <strong>Dimensões (AxLxP):</strong>
              {` ${livro.dimensions.height}cm x ${livro.dimensions.width}cm x ${livro.dimensions.depth}cm`}
            </p>
          }
          <p><strong>Código de Barras:</strong> {livro.barcode || 'Não especificado'}</p>
        </div>
      </div>
      <InfoSection />
    </div>
  );
};

export default TelaProduto;