import { api } from "./api";

export const postCustomer = async (customerData) => {
    const { data } = await api.post('/costumers', customerData);
    return data;
};


export const getCustomer = async () => {
    try{
    const response = await api.get('/costumers');
    return response.data;
    } catch (error) {
        console.error('Erro ao consultar clientes: ', error);
        throw new Error('Não foi possível consultar os clientes');
    }
};

export const deleteCustomer = async (id) => {
    try {
        const response = await api.delete(`/costumers/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        throw new Error('Não foi possível deletar o cliente');
    }
};

export const putCustomer = async (id, customerData) => {
    try {
        const response = await api.put(`/costumers/${id}`, customerData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw new Error('Não foi possível atualizar o cliente');
    }
};


