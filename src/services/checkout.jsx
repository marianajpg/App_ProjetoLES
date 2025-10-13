import { api } from "./api";

export const postCheckout = async (checkoutData) => {
    const { data } = await api.post('/checkout', checkoutData);
    return data;
};


export const getCheckout = async () => {
    try{
    const response = await api.get('/checkout');
    return response.data;
    } catch (error) {
        console.error('Erro ao consultar venda: ', error);
        throw new Error('Não foi possível consultar as vendas');
    }
};

export const deleteCheckout = async (id) => {
    try {
        const response = await api.delete(`/checkout/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar venda:', error);
        throw new Error('Não foi possível deletar a venda');
    }
};

export const putCheckout = async (id, CheckoutData) => {
    try {
        const response = await api.put(`/checkout/${id}`, CheckoutData);
        return response.data;
    } catch (error) {
        console.error('Erro ao tentar atualizar venda:', error);
        throw new Error('Não foi possível atualizar a venda');
    }
};




// exemplo POST
// {
//   "cartId": 2,
//   "addressId": 19,
//   "clientId": 8,
//   "payments": [
//     {
//       "type": "CARD",
//       "cardId":15,
//       "amount": 139.8,
//       "saveCard": false
//     },
//     {
//       "type": "COUPON",
//       "couponCode": "TESTPROMO30",
//       "amount": 10.00
//     }
//   ]
// }
