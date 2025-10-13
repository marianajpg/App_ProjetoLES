
import React from 'react';
import { useCarrinho } from '../context/CarrinhoContext'; 
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import InfoSection from '../components/InfoSection.jsx';
import '../styles/Carrinho.css'

const Carrinho = () => {
  const { itens, removerDoCarrinho, atualizarQuantidade, loading, error, clearError } = useCarrinho();

  console.log(itens)

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Carrinho', link: '' },
  ];

  const subtotal = itens.reduce((total, item) => {
    const valorVenda = item.valorVenda || 0;
    return total + (valorVenda * (item.quantity || 1));
  }, 0);

  return (
    <div>
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <div className="carrinho-container">
        <h1>Meu Carrinho</h1>

        {loading && <div className="carrinho-loading">Atualizando carrinho...</div>}

        {error && (
          <div className="carrinho-error">
            <p>{error}</p>
            <button onClick={clearError}>OK</button>
          </div>
        )}

        <div className="carrinho-cabecalho">
          <div className="carrinho-coluna-produto">Livro</div>
          <div className="carrinho-coluna-preco">Preço</div>
          <div className="carrinho-coluna-quantidade">Quantidade</div>
          <div className="carrinho-coluna-total">Total</div>
        </div>

        {!loading && itens.length === 0 ? (
          <p>Seu carrinho está vazio</p>
        ) : (
          itens.map((item) => {
            const valorVenda = item.valorVenda || 0;
            const quantidade = item.quantidade || item.quantity || 1;
            return (
              <div key={item.id} className="carrinho-item">
                <div className="carrinho-coluna-produto">
                  <img 
                    src={item.url || item[0].url} 
                    alt={item.titulo || item.title} 
                    className="carrinho-imagem" 
                  />
                  <div className="carrinho-detalhes-produto">
                    <h3>{item.titulo || item.nome}</h3>
                    <p>{item.author || 'Não informado'}</p>
                    <button
                      onClick={() => removerDoCarrinho(item.id)}
                      className="carrinho-remover"
                      disabled={loading}
                    >
                      Remover
                    </button>
                  </div>
                </div>
                <div className="carrinho-coluna-preco">
                  <p>R${typeof parseFloat(valorVenda) === 'number' ? parseFloat(valorVenda).toFixed(2) : '0,00'}</p>
                </div>
                <div className="carrinho-coluna-quantidade">
                  <input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) => atualizarQuantidade(item.id, parseInt(e.target.value) || 1)}
                    className="carrinho-quantidade"
                    disabled={loading}
                  />
                </div>
                <div className="carrinho-coluna-total">
                  <p>R${(valorVenda * quantidade).toFixed(2)}</p>
                </div>
              </div>
            );
          })
        )}

        <div className="carrinho-finalizar">
          <div className="carrinho-subtotal">
            <div className="carrinho-subtotal-label">Subtotal</div>
            <div className="carrinho-subtotal-valor">R${subtotal.toFixed(2)}</div>
          </div>
          <Link
            to="/pagamento"
            state={{ itens, subtotal }}
            className={`carrinho-botao ${itens.length === 0 || loading ? 'disabled' : ''}`}
            onClick={(e) => (itens.length === 0 || loading) && e.preventDefault()}
          >
            Finalizar compra
          </Link>
        </div>
      </div>
    <InfoSection />
    </div>
  );
};

export default Carrinho;
