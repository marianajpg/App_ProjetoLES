import { api } from "./api";

export const postCupom = async (cupomData) => {
    const { data } = await api.post('/coupons', cupomData);
    return data;
};


export const getCupom = async () => {
    try{
    const response = await api.get('/coupons');
    return response.data;
    } catch (error) {
        console.error('Erro ao consultar cupons: ', error);
        throw new Error('Não foi possível consultar os cupons');
    }
};


// exemplo post
// {
//   "code": "TESTPROMO30",
//   "value": 30.00,
//   "type": "PROMO",
//   "validity": "2026-12-31", Um mes após a autorização da troca
//   "minPurchaseValue": 0
// }
