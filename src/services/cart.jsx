import { api } from "./api";

export const postCart = async (cartData) => {
    const { data } = await api.post('/cart', cartData);
    return data;
};

export const getCart = async (id) => {
    if (!id) return null;

    try {
        const response = await api.get(`/cart/${encodeURIComponent(id)}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao consultar carrinho: ', error);
        throw new Error('Não foi possível consultar o carrinho');
    }
};

export const getAllCartsByClientId = async (clientId) => {
    if (!clientId) return [];

    try {
        const response = await api.get(`/cart/costumer/${encodeURIComponent(clientId)}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao consultar carrinhos do cliente: ', error);
        throw new Error('Não foi possível consultar os carrinhos do cliente');
    }
};



// exemplo GET
//{"id":1,"active":true,"appliedDiscount":"0.00","couponAppliedId":null,"clienteId":2,"created_at":"2025-10-08T19:01:21.249Z","updated_at":"2025-10-08T19:01:21.249Z","items":[{"id":2,"quantity":1,"bookId":3,"cartId":1,"price":"27.60","created_at":"2025-10-08T19:11:35.087Z","updated_at":"2025-10-08T19:11:35.087Z"},{"id":3,"quantity":1,"bookId":4,"cartId":1,"price":"24.15","created_at":"2025-10-08T19:11:47.633Z","updated_at":"2025-10-08T19:11:47.633Z"},{"id":1,"quantity":6,"bookId":1,"cartId":1,"price":"32.00","created_at":"2025-10-08T19:07:27.174Z","updated_at":"2025-10-08T19:13:20.416Z"}]}

//exemplo POST
// {
//   "clienteId": 2
// }
