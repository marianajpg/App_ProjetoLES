import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { getCart, postCart, getAllCartsByClientId } from "../services/cart";
import {
  postItemCart,
  putItemCart,
  deleteItemCart,
} from "../services/itemCart";
import { getBookById } from "../services/books";
import { getImagesById } from "../services/bookImages";
import { useAuth } from "../context/AuthLogin";

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
            console.log("item add", item);
            const imagensDetails = await getImagesById(item.bookId);
            const bookDetailsImages = imagensDetails.filter(
              (livro) => livro.caption === "Principal"
            );
            console.log(item);
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
        console.error(
          "fetchAndSetCartDetails: Error fetching item details:",
          detailError
        );
        setError(
          "Houve um problema ao carregar os detalhes dos itens do carrinho."
        );
        setItens([]);
      }
    } else {
      setItens([]);
      console.log("fetchAndSetCartDetails: Cart is empty or invalid.");
    }
  };

// Defina a função fora do useEffect
const fetchInitialCart = useCallback(async () => {
  console.log("fetchInitialCart: Starting.");
  setLoading(true);

  if (!user || !user.id || user.id === "colaborador-mock-id") {
    setItens([]);
    setLoading(false);
    console.log(
      "CarrinhoContext: User is null, has no ID, or is a collaborator. Skipping cart fetch. Loading set to false.",
      { user }
    );
    return;
  }

  try {
    setError(null);
    const allCarts = await getAllCartsByClientId(user.id);
    console.log("CarrinhoContext: All carts for client:", allCarts);

    let activeCart = allCarts.find(
      (cart) => cart.active === true || cart.active === "true"
    );

    if (!activeCart) {
      console.log("Carrinho inativo ou não encontrado para o usuário, criando um novo...");
      const newCart = await postCart({ clienteId: user.id });
      setCartId(newCart.id);
      console.log("CarrinhoContext: New cart created:", newCart);
      await fetchAndSetCartDetails(newCart);
    } else {
      setCartId(activeCart.id);
      console.log("CarrinhoContext: Existing active cart found:", activeCart);
      await fetchAndSetCartDetails(activeCart);
    }
  } catch (err) {
    console.error("CarrinhoContext: Erro ao buscar ou criar carrinho inicial:", err);
    setError(
      err.response?.data?.message ||
      err.message ||
      "Ocorreu um erro ao carregar o carrinho."
    );
  } finally {
    setLoading(false);
    console.log("fetchInitialCart: Finished. Loading set to false.");
  }
}, [user]);

useEffect(() => {
  fetchInitialCart();
}, [fetchInitialCart]);


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
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Ocorreu um erro ao atualizar o carrinho.";
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

  // const adicionarAoCarrinho = (livro) => {
  //   const itemExistente = itens.find(item => item.bookId === livro.id);

  //   if (itemExistente) {
  //     const novaQuantidade = itemExistente.quantity + (livro.quantidade || 1);
  //     console.log("CarrinhoContext: Item existente, atualizando quantidade:", { itemId: itemExistente.id, novaQuantidade });
  //     atualizarQuantidade(itemExistente.id, novaQuantidade);
  //   } else {
  //     const itemPayload = {
  //       itemId: livro.id,
  //       quantity: livro.quantidade || 1,
  //       price: parseFloat(livro.valorVenda || livro.price)
  //     };
  //     console.log("CarrinhoContext: Adicionando novo item ao carrinho:", { cartId, itemPayload });
  //     handleApiCall(() => postItemCart(cartId, itemPayload));
  //   }
  // };

  const adicionarAoCarrinho = async (livro) => {
    try {
      // Criar um carrinho se não existir
      let currentCartId = cartId;
      if (!currentCartId || Number.isNaN(Number(currentCartId))) {
        try {

          const cartPayload = user && user.id ? { clienteId: user.id } : {};
          const newCart = await postCart(cartPayload);
          if (!newCart || !newCart.id) {
            throw new Error("Não foi possível criar um carrinho");
          }
          currentCartId = newCart.id;
          setCartId(currentCartId);
          console.log(
            "CarrinhoContext: Novo carrinho criado com id:",
            currentCartId
          );
        } catch (creationErr) {
          console.error(
            "CarrinhoContext: Erro ao criar carrinho antes de adicionar item:",
            creationErr
          );
          setError("Não foi possível criar um novo carrinho. Tente novamente.");
          return;
        }
      }


      const itemExistente = itens.find((item) => item.bookId === livro.id);

      if (itemExistente) {
        const novaQuantidade = itemExistente.quantity + (livro.quantidade || 1);
        console.log(
          "CarrinhoContext: Item existente, atualizando quantidade:",
          { itemId: itemExistente.id, novaQuantidade }
        );
        atualizarQuantidade(itemExistente.id, novaQuantidade);
      } else {
        const itemPayload = {
          itemId: livro.id,
          quantity: livro.quantidade || 1,
          price: parseFloat(livro.valorVenda || livro.price),
        };
        console.log("CarrinhoContext: Adicionando novo item ao carrinho:", {
          cartId: currentCartId,
          itemPayload,
        });

        handleApiCall(() => postItemCart(currentCartId, itemPayload));
      }
    } catch (err) {
      console.error("CarrinhoContext: Erro em adicionarAoCarrinho:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Erro ao adicionar ao carrinho"
      );
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

    // Atualiza a quantidade do item no carrinho
    handleApiCall(() => putItemCart(cartId, itemId, quantity));
  };

  const clearError = () => setError(null);

  const clearCart = () => {
    setItens([]);
    fetchInitialCart()
    setCartId(null);
  };

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
        clearCart,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};
export const useCarrinho = () => useContext(CarrinhoContext);
