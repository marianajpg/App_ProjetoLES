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

// Busca um cliente por e-mail (usa a rota backend /costumers/email/:email)
// Retorna o objeto do cliente ou null.
export const getCustomerByEmail = async (email) => {
  if (!email) return null;
  const response = await api.get(`/costumers/email/${encodeURIComponent(email)}`);
  return response.data;
};


