import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart, postCart } from '../services/cart';
import { postItemCart, putItemCart, deleteItemCart } from '../services/itemCart';
import { getBookById } from '../services/books';
import { getImagesById } from '../services/bookImages'; 
import { useAuth } from '../context/AuthLogin';

const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [cartId, setCartId] = useState(null);

  const fetchAndSetCartDetails = async (cart) => {
    if (cart && cart.items) {
      const itemsDetails = await Promise.all(
        cart.items.map(async (item) => {
          const bookDetails = await getBookById(item.bookId);
          const imagensDetails = await getImagesById(item.bookId);
          const bookDetailsImages = imagensDetails.filter(livro => livro.caption === "Principal");
          console.log(item)
          return {
            ...item,
            ...bookDetailsImages,
            ...bookDetails,
            valorVenda: item.price,
            id: item.id,
          };
        })
      );
      setItens(itemsDetails);
    } else {
      setItens([]);
    }
  };

  useEffect(() => {
    const fetchInitialCart = async () => {
      if (!user || !user.id) {
        setItens([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const cartData = await getCart(user.id);
        setCartId(cartData.id);
        await fetchAndSetCartDetails(cartData);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log("Carrinho não encontrado para o usuário, criando um novo...");
          try {
            const newCart = await postCart({ clienteId: user.id });
            setCartId(newCart.id);
            await fetchAndSetCartDetails(newCart);
          } catch (creationError) {
            console.error("Falha ao criar um novo carrinho:", creationError);
            setError("Houve um problema ao criar seu carrinho.");
          }
        } else {
          console.error(err);
          setError("Não foi possível carregar seu carrinho.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInitialCart();
  }, [user]);

  const handleApiCall = async (apiCall) => {
    if (loading || !cartId) return;
    try {
      setLoading(true);
      setError(null);
      await apiCall();
      const updatedCart = await getCart(cartId);
      await fetchAndSetCartDetails(updatedCart);
    } catch (err) {
      console.error("Erro na operação do carrinho:", err);
      const errorMessage = err.response?.data?.message || err.message || "Ocorreu um erro ao atualizar o carrinho.";
      setError(errorMessage);
      try {
        const cartData = await getCart(cartId);
        await fetchAndSetCartDetails(cartData);
      } catch (syncError) {
        console.error("Erro ao sincronizar carrinho:", syncError);
      }
    } finally {
      setLoading(false);
    }
  };

  const adicionarAoCarrinho = (livro) => {
    const itemExistente = itens.find(item => item.bookId === livro.id);

    if (itemExistente) {
      const novaQuantidade = itemExistente.quantity + (livro.quantidade || 1);
      atualizarQuantidade(itemExistente.id, novaQuantidade);
    } else {
      const itemPayload = {
        bookId: livro.id,
        quantity: livro.quantidade || 1,
        price: parseFloat(livro.valorVenda || livro.price)
      };
      handleApiCall(() => postItemCart(cartId, itemPayload));
    }
  };

  const removerDoCarrinho = (itemId) => {
    handleApiCall(() => deleteItemCart(cartId, itemId));
  };

  const atualizarQuantidade = (itemId, quantity) => {
    if (quantity < 1) {
      removerDoCarrinho(itemId);
      return;
    }

    //const itemPayload = { quantity };
    handleApiCall(() => putItemCart(cartId, itemId, quantity));
  };

  const clearError = () => setError(null);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        loading,
        error,
        clearError,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        cartId, 
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};
export const useCarrinho = () => useContext(CarrinhoContext);