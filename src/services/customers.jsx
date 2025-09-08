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
        console.error('Erro ao tentar atualizar cliente:', error);
        throw new Error('Não foi possível atualizar o cliente');
    }
};

export const getCustomerByEmail = async (email) => {
    try {
        // Assumindo que a API tem um endpoint para buscar cliente por e-mail
        // Ex: GET /costumers?email=teste@example.com
        const response = await api.get(`/costumers?email=${email}`);
        // A API pode retornar um array de clientes, então pegamos o primeiro
        if (response.data && response.data.length > 0) {
            return response.data[0];
        } else {
            return null; // Cliente não encontrado
        }
    } catch (error) {
        console.error('Erro ao buscar cliente por e-mail:', error);
        throw new Error('Não foi possível buscar o cliente por e-mail.');
    }
};


