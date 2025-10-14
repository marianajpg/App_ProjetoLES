import { api } from "./api";

export const getInventory = async () => {
     try{
    const response = await api.get('/inventory');
    return response.data;
    } catch (error) {
        console.error('Erro ao consultar estoques: ', error);
        throw new Error('Não foi possível consultar os estoque');
    }
};

// exemplo GET
//   {
//         "id": 4,
//         "quantity": 2,
//         "unitCost": "20.00",
//         "entryDate": "2025-09-30",
//         "invoiceNumber": "NF-0001",
//         "bookId": 4,
//         "supplierId": null,
//         "createdAt": "2025-10-06T22:11:56.358Z",
//         "updatedAt": "2025-10-06T22:11:56.358Z"
//     },