
import { api } from "./api";

export const getBooks = async (customerData) => {
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




// exemplo de body
//   {
//         "id": 7,
//         "author": "H.G. Wells",
//         "year": 1895,
//         "title": "A Máquina do Tempo",
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