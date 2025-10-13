import {api} from "./api"

export const postItemCart = async (id, itemData) => {
    const {data} = await api.post(`/cart/${id}/items`, itemData) 
    return data
}

export const putItemCart = async (id,itemId, itemData) => {
    const {data} = await api.put(`/cart/${id}/items/${itemId}`, {quantity: itemData}) 
    return data
}

export const deleteItemCart = async (id, itemId) => {
    try {
        const response = await api.delete(`/cart/${id}/items/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar item:', error);
        throw new Error('Não foi possível deletar o item');
    }
}


// exemplo PUT
// {
//   "quantity": 4
// }


// exemplo POST
// {
//   "itemId": 1,
//   "quantity": 4,
//   "price": 32
// }
