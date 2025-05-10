import React, { createContext, useState, useContext, useEffect } from 'react';

const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
  const [itens, setItens] = useState(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens));
  }, [itens]);

  
  const adicionarAoCarrinho = (livro) => {
    // Validação dos dados obrigatórios
    if (!livro.id || !livro.titulo || livro.preco === undefined) {
      console.error("Dados incompletos para adicionar ao carrinho:", livro);
      
      return;
    }

    const itemExistente = itens.find((item) => item.id === livro.id);

    if (itemExistente) {
      const novosItens = itens.map((item) =>
        item.id === livro.id
          ? { ...item, quantidade: item.quantidade + (livro.quantidade || 1) }
          : item
      );
      setItens(novosItens);
    } else {
      setItens([...itens, {
        id: livro.id,
        titulo: livro.titulo,
        autor: livro.autor || 'Não informado',
        capaUrl: livro.capaUrl || livro.imageUrl || '',
        preco: livro.preco, // Garantimos que só usamos preco
        quantidade: livro.quantidade || 1,
        editora: livro.editora || 'Não informada'
      }]);
    }
  };

  const removerDoCarrinho = (id) => {
    const novosItens = itens.filter((item) => item.id !== id);
    setItens(novosItens);
  };

  const atualizarQuantidade = (id, quantidade) => {
    if (quantidade < 1) return;

    const novosItens = itens.map((item) =>
      item.id === id ? { ...item, quantidade } : item
    );
    setItens(novosItens);
  };

  return (
    <CarrinhoContext.Provider
      value={{ 
        itens, 
        adicionarAoCarrinho, 
        removerDoCarrinho, 
        atualizarQuantidade 
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => useContext(CarrinhoContext);