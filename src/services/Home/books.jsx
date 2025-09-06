import { IBook } from "../../interfaces/book";
import { api } from "../api";

export const getBooks = async (nome) => {
    const { data } = await api.post('/books', {
        nome,
    });
    return data;
};