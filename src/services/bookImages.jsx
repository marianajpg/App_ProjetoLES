
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
    const { data } = await api.post(`/bookImages/book/${encodeURIComponent(id)}}/images`, imageData);
    return data;
};


// exemplo POST
// {
//   "url": "https://m.media-amazon.com/images/I/41j-TZkEUtL.jpg",
//   "caption": "Aberto"  Principal = capa, Aberto = miniatura
// }

