import { api } from "./api";

export const postExchange = async (exchangesData) => {
    const { data } = await api.post('/exchanges', exchangesData);
    return data;
};

export const postAuthorizeExchanges = async (exchangesData, id) => {
    const { data } = await api.post(`/exchanges/${id}/authorize`, exchangesData);
    return data;
};

export const putExchangesConfirmation = async (id) => {
    const { data } = await api.put(`/exchanges/${id}`, {
  "returnToStock": true
});
    return data;
};

export const postReceiveExchange = async (id, itemsToRestock) => {
    const { data } = await api.post(`/exchanges/${id}/receive`, { itemsToRestock });
    return data;
};

export const getExchanges = async () => {
    try{
    const response = await api.get('/exchanges');
    return response.data;
    } catch (error) {
        console.error('Erro ao consultar troca: ', error);
        throw new Error('Não foi possível consultar as trocas');
    }
};


// exemplo de postexchanges
//{ "saleId": 16, "items": [ { "vendaItemId": 18, "quantidade": 1 } ], "motivo": "Livro veio com defeito" }

