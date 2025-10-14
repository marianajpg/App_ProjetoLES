import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart, postCart, getAllCartsByClientId } from '../services/cart';
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
    console.log("fetchAndSetCartDetails: Starting for cart:", cart);
    if (cart && cart.items) {
      try {
        const itemsDetails = await Promise.all(
          cart.items.map(async (item) => {
            const bookDetails = await getBookById(item.bookId);
            console.log("item add", item)
            const imagensDetails = await getImagesById(item.bookId);
            const bookDetailsImages = imagensDetails.filter(livro => livro.caption === "Principal");
            console.log(item)
            return {
              ...item,
              ...bookDetailsImages,
              ...bookDetails,
              valorVenda: parseFloat(item.price),
              id: item.id,
            };
          })
        );
        setItens(itemsDetails);
        console.log("fetchAndSetCartDetails: Successfully set items.");
      } catch (detailError) {
        console.error("fetchAndSetCartDetails: Error fetching item details:", detailError);
        setError("Houve um problema ao carregar os detalhes dos itens do carrinho.");
        setItens([]);
      }
    } else {
      setItens([]);
      console.log("fetchAndSetCartDetails: Cart is empty or invalid.");
    }
  };

  useEffect(() => {
    const fetchInitialCart = async () => {
      console.log("fetchInitialCart: Starting.");
      setLoading(true); // Ensure loading is true at the start of fetch
      if (!user || !user.id || user.id == "colaborador-mock-id") {
        setItens([]);
        setLoading(false);
        console.log("CarrinhoContext: User is null, has no ID, or is a collaborator. Skipping cart fetch. Loading set to false.", { user });
        return;
      }
      console.log("CarrinhoContext: Fetching initial cart for user:", user);

      try {
        setError(null);
        const allCarts = await getAllCartsByClientId(user.id);
        console.log("CarrinhoContext: All carts for client:", allCarts);

        let activeCart = allCarts.find(cart => cart.active === true || cart.active === "true");

        if (!activeCart) {
          console.log("Carrinho inativo ou não encontrado para o usuário, criando um novo...");
          try {
            const newCart = await postCart({ clienteId: user.id });
            setCartId(newCart.id);
            console.log("CarrinhoContext: New cart created:", newCart);
            await fetchAndSetCartDetails(newCart);
          } catch (creationError) {
            console.error("Falha ao criar um novo carrinho:", creationError);
            setError("Houve um problema ao criar seu carrinho.");
          }
        } else {
          setCartId(activeCart.id);
          console.log("CarrinhoContext: Existing active cart found:", activeCart);
          await fetchAndSetCartDetails(activeCart);
        }
      } catch (err) {
        console.error("CarrinhoContext: Erro ao buscar ou criar carrinho inicial:", err);
        setError(err.response?.data?.message || err.message || "Ocorreu um erro ao carregar o carrinho.");
      } finally {
        setLoading(false); // Ensure loading is false after initial fetch attempt
        console.log("fetchInitialCart: Finished. Loading set to false.");
      }
    };
    fetchInitialCart();
  }, [user]);

  const handleApiCall = async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      await apiCall();
      const updatedCart = await getCart(cartId);
      if (!updatedCart || !updatedCart.active) {
        setItens([]);
        setCartId(null);
        setError("Carrinho inativo ou não encontrado após a operação.");
        return;
      }
      console.log("CarrinhoContext: Cart updated after API call:", updatedCart);
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
      console.log("CarrinhoContext: Item existente, atualizando quantidade:", { itemId: itemExistente.id, novaQuantidade });
      atualizarQuantidade(itemExistente.id, novaQuantidade);
    } else {
      const itemPayload = {
        itemId: livro.id,
        quantity: livro.quantidade || 1,
        price: parseFloat(livro.valorVenda || livro.price)
      };
      console.log("CarrinhoContext: Adicionando novo item ao carrinho:", { cartId, itemPayload });
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