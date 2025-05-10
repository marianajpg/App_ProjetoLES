import React, { useState } from 'react';
import ProdutoCard from './ProdutoCard'; // Importa o componente
import '../styles/MeusProdutos.css';

const MeusProdutos = () => {
  const [statusAtivo, setStatusAtivo] = useState('Em processamento');

  // Simulação de um produto (você pode futuramente usar uma lista de produtos)
  const produtoExemplo = {
    id: 1,
    capaUrl: 'https://m.media-amazon.com/images/I/414U616yzqL._SY445_SX342_.jpg',
    titulo: 'A Vida Secreta das Árvores',
    autor: 'Peter Wohlleben',
    preco: 48.99,
    estoque: 10,
    imagens: [
      'https://m.media-amazon.com/images/I/414U616yzqL._SY445_SX342_.jpg',
     
    ],
    editora: 'Editora Sextante',
  };

  return (
    <div className="meus-produtos-container">
      {/* Filtros de Status */}
      <div className="status-filtros">
        <button 
          className={statusAtivo === 'Em processamento' ? 'ativo' : ''}
          onClick={() => setStatusAtivo('Em processamento')}
        >
          Em processamento
        </button>
        <button 
          className={statusAtivo === 'Em trânsito' ? 'ativo' : ''}
          onClick={() => setStatusAtivo('Em trânsito')}
        >
          Em trânsito
        </button>
        <button 
          className={statusAtivo === 'Entregue' ? 'ativo' : ''}
          onClick={() => setStatusAtivo('Entregue')}
        >
          Entregue
        </button>
        <button 
          className={statusAtivo === 'Devoluções/Trocas' ? 'ativo' : ''}
          onClick={() => setStatusAtivo('Devoluções/Trocas')}
        >
          Devoluções/Trocas
        </button>
      </div>

      {/* ProdutoCard com props */}
      <div className='produto-card-meus-produtos'>
      <ProdutoCard 
        id={produtoExemplo.id}
        capaUrl={produtoExemplo.capaUrl}
        titulo={produtoExemplo.titulo}
        autor={produtoExemplo.autor}
        preco={produtoExemplo.preco}
        estoque={produtoExemplo.estoque}
        imagens={produtoExemplo.imagens}
        editora={produtoExemplo.editora}
        extra={
          <button className="detalhes-btn" onClick={() => navigate('/tela-produto', {
            state: { livro: produtoExemplo }
          })}>
            Ver detalhes
          </button>
        }
      />
      <ProdutoCard 
        id={produtoExemplo.id}
        capaUrl={produtoExemplo.capaUrl}
        titulo={produtoExemplo.titulo}
        autor={produtoExemplo.autor}
        preco={produtoExemplo.preco}
        estoque={produtoExemplo.estoque}
        imagens={produtoExemplo.imagens}
        editora={produtoExemplo.editora}
        extra={
          <button className="detalhes-btn" onClick={() => navigate('/tela-produto', {
            state: { livro: produtoExemplo }
          })}>
            Ver detalhes
          </button>
        }
      />
      </div>
    </div>
  );
};

export default MeusProdutos;
