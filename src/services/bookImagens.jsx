
import { api } from "./api";

export const getImagesById = async (id) => {
    const response = await api.get(`/book/${encodeURIComponent(id)}/images`);
    return response.data;
    
}

export const getImages = async ()=> {
    const response = await api.get(`/bookImages/images`);
    return response.data;
    
}

