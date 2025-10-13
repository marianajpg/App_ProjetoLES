import { api } from "./api";

export const postCategory = async (CategoryData) => {
    const { data } = await api.post('/category', CategoryData);
    return data;
};


export const getCategory = async () => {
    try{
    const response = await api.get('/category');
    return response.data;
    } catch (error) {
        console.error('Erro ao consultar categorias: ', error);
        throw new Error('Não foi possível consultar as categorias');
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/category/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        throw new Error('Não foi possível deletar a categoria');
    }
};

export const putCategory = async (id, CategoryData) => {
    try {
        const response = await api.put(`/category/${id}`, CategoryData);
        return response.data;
    } catch (error) {
        console.error('Erro ao tentar atualizar categoria:', error);
        throw new Error('Não foi possível atualizar a categoria');
    }
}


//exemplo GET
    // {
    //     "id": 1,
    //     "name": "Romance Policial",
    //     "description": "Narrativas de mistério, investigação e suspense criminal.",
    //     "active": true,
    //     "created_at": "2025-10-06T01:09:56.909Z",
    //     "updated_at": "2025-10-06T01:09:56.909Z"
    // }

// exemplo POST
// {
//     "name": "Romance Policial",
//     "description": "Narrativas de mistério, investigação e suspense criminal.",
//     "active": true
//   }