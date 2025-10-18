
import { api } from "./api";

export const getBooks = async () => {
     try{
    const response = await api.get('/book');
    return response.data;
    } catch (error) {
        console.error('Erro ao consultar livros: ', error);
        throw new Error('Não foi possível consultar os livros');
    }
};

export const getBookById = async (id) => {
  if (!id) return null;
  const response = await api.get(`/book/${encodeURIComponent(id)}`);
  return response.data;
};

export const createBook = async (bookData) => {
  try {
    const response = await api.post('/book', bookData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    throw error;
  }
};

export const putBook = async (id, bookData) => {
    try {
        const response = await api.put(`/book/${id}`,bookData);
        return response.data;
    } catch (error) {
        console.error('Erro ao tentar atualizar livro:', error);
        throw new Error('Não foi possível atualizar o livro');
    }
}



// exemplo de body POST
// {
//     "author": "Frank Herbert",
//     "category": [1],
//     "year": 1965,
//     "title": "Duna",
//     "publisher": "Ace Books",
//     "edition": "1ª edição (original)",In
//     "ISBN": "9780441013593",
//     "pages": 412,
//     "synopsis": "No planeta desértico Arrakis, Paul Atreides enfrenta intrigas políticas, religião e ecologia em uma luta pelo controle da 'melange'.",
//     "dimensions": { "height": 21.0, "width": 14.0, "depth": 4.0, "weight": 560 },
//     "pricegroup": 1,
//     "barcode": "9780441013593",
//     "cost": 25.00
//   }

// exemplo de body GET
//   {
//         "id": 7,
//         "author": "H.G. Wells",
//         "year": 1895,
//         "title": "A Máquina do Tempo",
//         "categories":[{"id":1,"name":"Romance Policial","description":"Narrativas de mistério, investigação e suspense criminal.","active":true,"created_at":"2025-10-06T01:09:56.909Z","updated_at":"2025-10-06T01:09:56.909Z"},
//         "publisher": "William Heinemann",
//         "edition": "1ª edição",
//         "ISBN": "9780451528551",
//         "pages": 118,
//         "synopsis": "Um cientista viaja milhares de anos no futuro e testemunha a evolução da humanidade em duas espécies distintas.",
//         "dimensions": {
//             "height": 19,
//             "width": 12,
//             "depth": 1.8,
//             "weight": 220
//         },
//         "barcode": "9780451528551",
//         "price": "20.70",
//         "status": "ACTIVE",
//         "inactivationReason": null,
//         "inactivationCategory": null,
//         "activationReason": null,
//         "created_at": "2025-10-06T01:12:52.552Z",
//         "updated_at": "2025-10-06T01:12:52.552Z",
//         "pricegroup": {
//             "id": 1,
//             "name": "Teste",
//             "description": "Grupo de preços para campanhas promocionais e liquidações.",
//             "margin": "0.1500",
//             "minAllowedMargin": "0.1000",
//             "maxAllowedDiscount": "0.5000",
//             "requiresManagerApprovalBelowMargin": false,
//             "active": true,
//             "created_at": "2025-10-06T01:09:36.781Z",
//             "updated_at": "2025-10-06T01:09:36.781Z"
//         }
//     },