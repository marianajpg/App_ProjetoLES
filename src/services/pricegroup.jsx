import { api } from "./api";

export const postPriceGroups = async (grupoPrecData) => {
    const { data } = await api.post('/price-groups', grupoPrecData);
    return data;
};


export const getPriceGroups = async () => {
    try{
    const response = await api.get('/price-groups');
    return response.data;
    } catch (error) {
        console.error('Erro ao consultar grupos de precificacao: ', error);
        throw new Error('Não foi possível consultar os grupos de precificacao');
    }
};