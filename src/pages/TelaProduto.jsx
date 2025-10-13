import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import Header from '../components/Header.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { useAuth } from '../context/AuthLogin.jsx';
import { getInventory } from '../services/inventory.jsx';
import '../styles/TelaProduto.css';
import InfoSection from '../components/InfoSection.jsx';

const TelaProduto = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { adicionarAoCarrinho } = useCarrinho();

  // O livro é recebido diretamente do estado da navegação
  const livro = state?.livro;

  const [descricaoExpandida, setDescricaoExpandida] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [estoque, setEstoque] = useState(null);

  useEffect(() => {
    if (livro) {
      getInventory()
        .then(data => {
          const inventoryItem = data.filter(item => item.bookId === livro.id);
          if (inventoryItem.length > 0) {
            const totalQuantity = inventoryItem.reduce((total, item) => total + item.quantity, 0);
            setEstoque(totalQuantity);
          } else {
            setEstoque(0);
          }
        })
        .catch(error => {
          console.error("Erro ao buscar estoque:", error);
          setEstoque(0);
        });
    }
  }, [livro]);

  // A API não fornece imagens, então usaremos um placeholder
  if (!livro || !livro.images || livro.images.length === 0) {
    livro.images = [{ url: 'https://via.placeholder.com/300x450?text=Capa+Indispon%C3%ADvel' }];
  }
  
  const imagemCapa = livro.images.find(img => img.caption === 'Principal');
  const [imagemPrincipal, setImagemPrincipal] = useState(imagemCapa ? imagemCapa.url : livro.images[0].url);

  // Se nenhum livro foi passado, mostra uma mensagem de erro
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
            {livro.images.map((imagem, index) => (
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
              />
            </div>
          </div>

          <button
            className="produto-botao"
            onClick={handleAdicionarAoCarrinho}
            disabled={usuario?.tipoUsuario === 'colaborador' || estoque === 0 || quantidade > estoque}
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