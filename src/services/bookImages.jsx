
import { api } from "./api";

export const getImagesById = async (id) => {
    const response = await api.get(`/bookImages/book/${encodeURIComponent(id)}/images`);
    return response.data;
    
}

export const getImages = async ()=> {
    const response = await api.get(`/bookImages/images`);
    return response.data;
    
}

export const postImageBook = async (id, imageData) => {
    const { data } = await api.post(`/bookImages/book/${encodeURIComponent(id)}/images`, imageData);
    return data;
};

export const deleteImageBook = async (id) => {
    try {
        const response = await api.delete(`/bookImages/images/${encodeURIComponent(id)}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar imagem:', error);
        throw new Error('Não foi possível deletar a imagem');
    }
};

export const putImageBook = async (id, imageBookData) => {
    try {
        const response = await api.put(`/bookImages/images/${encodeURIComponent(id)}`, imageBookData);
        return response.data;
    } catch (error) {
        console.error('Erro ao tentar atualizar imagem:', error);
        throw new Error('Não foi possível atualizar a imagem');
    }
}




// exemplo POST
// {
//   "url": "https://m.media-amazon.com/images/I/41j-TZkEUtL.jpg",
//   "caption": "Aberto"  Principal = capa, Aberto = miniatura
// }

