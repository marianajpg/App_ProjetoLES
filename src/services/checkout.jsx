import { api } from "./api";

export const postCheckout = async (checkoutData) => {
    const { data } = await api.post('/checkout', checkoutData);
    return data;
};


export const getCheckout = async () => {
    try{
    const response = await api.get('/checkout');
    return response.data;
    } catch (error) {
        console.error('Erro ao consultar venda: ', error);
        throw new Error('Não foi possível consultar as vendas');
    }
};

export const deleteCheckout = async (id) => {
    try {
        const response = await api.delete(`/checkout/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar venda:', error);
        throw new Error('Não foi possível deletar a venda');
    }
};

export const putCheckout = async (id, CheckoutData) => {
    try {
        const response = await api.put(`/checkout/${id}`, CheckoutData);
        return response.data;
    } catch (error) {
        console.error('Erro ao tentar atualizar venda:', error);
        throw new Error('Não foi possível atualizar a venda');
    }
};




// exemplo POST
// {
//   "cartId": 2,
//   "addressId": 19,
//   "clientId": 8,
//   "payments": [
//     {
//       "type": "CARD",
//       "cardId":15,
//       "amount": 139.8,
//       "saveCard": false
//     },
//     {
//       "type": "COUPON",
//       "couponCode": "TESTPROMO30",
//       "amount": 10.00
//     }
//   ]
// }


// exemplo GET
// [
//     {
//         "id": 35,
//         "status": "APPROVED",
//         "clientId": 1,
//         "total": 331.32,
//         "appliedDiscount": 0,
//         "couponUsedId": null,
//         "freightValue": 44.42,
//         "trackingCode": null,
//         "created_at": "2025-10-15T23:13:44.227Z",
//         "updated_at": "2025-10-15T23:13:44.391Z",
//         "deliveryAddress": {
//             "id": 8,
//             "type": "DELIVERY",
//             "residenceType": "RESIDENCIAL",
//             "streetType": "RUA",
//             "street": "Rua Nova Teste",
//             "number": "456",
//             "complement": "Casa",
//             "neighborhood": "Bairro Novo",
//             "city": "Cidade Nova",
//             "state": "RJ",
//             "zipCode": "98765-432",
//             "observations": "Casa Nova",
//             "created_at": "2025-10-15T16:54:16.456Z",
//             "updated_at": "2025-10-15T16:54:16.456Z"
//         },
//         "payments": [
//             {
//                 "id": 78,
//                 "type": "CARD",
//                 "value": "66.26",
//                 "cardId": 5,
//                 "couponId": null,
//                 "status": "APPROVED",
//                 "created_at": "2025-10-15T23:13:44.227Z",
//                 "updated_at": "2025-10-15T23:13:44.227Z"
//             },
//             {
//                 "id": 79,
//                 "type": "CARD",
//                 "value": "265.06",
//                 "cardId": 4,
//                 "couponId": null,
//                 "status": "APPROVED",
//                 "created_at": "2025-10-15T23:13:44.227Z",
//                 "updated_at": "2025-10-15T23:13:44.227Z"
//             }
//         ],
//         "items": [
//             {
//                 "id": 85,
//                 "bookId": 10,
//                 "quantity": 2,
//                 "unitPrice": 57.38,
//                 "book": {
//                     "id": 10,
//                     "title": "As Aventuras de Sherlock Holmes",
//                     "author": "Arthur Conan Doyle",
//                     "ISBN": "9788571647758",
//                     "price": 57.38,
//                     "dimensions": {
//                         "height": 21,
//                         "width": 14,
//                         "depth": 2.5,
//                         "weight": 0
//                     },
//                     "images": [
//                         {
//                             "id": 36,
//                             "url": "https://m.media-amazon.com/images/I/41MPC3OfuVL._SY445_SX342_ML2_.jpg",
//                             "caption": "Principal",
//                             "created_at": "2025-10-14T14:09:20.046Z",
//                             "updated_at": "2025-10-14T14:09:20.046Z"
//                         },
//                         {
//                             "id": 37,
//                             "url": "https://m.media-amazon.com/images/I/91--Fekz9fL._SY425_.jpg",
//                             "caption": "Aberto",
//                             "created_at": "2025-10-14T14:09:20.078Z",
//                             "updated_at": "2025-10-14T14:09:20.078Z"
//                         }
//                     ]
//                 }
//             },
//             {
//                 "id": 86,
//                 "bookId": 15,
//                 "quantity": 3,
//                 "unitPrice": 57.38,
//                 "book": {
//                     "id": 15,
//                     "title": "Assim Falou Zaratustra",
//                     "author": "Friedrich Nietzsche",
//                     "ISBN": "9788533620517",
//                     "price": 57.38,
//                     "dimensions": {
//                         "height": 22,
//                         "width": 15,
//                         "depth": 2.5,
//                         "weight": 480
//                     },
//                     "images": [
//                         {
//                             "id": 49,
//                             "url": "https://m.media-amazon.com/images/I/81ML1XLkV6L._SY466_.jpg",
//                             "caption": "Principal",
//                             "created_at": "2025-10-14T14:31:24.867Z",
//                             "updated_at": "2025-10-14T14:35:10.544Z"
//                         },
//                         {
//                             "id": 50,
//                             "url": "https://m.media-amazon.com/images/I/81HwLoYD4SL._SL1500_.jpg",
//                             "caption": "Aberto",
//                             "created_at": "2025-10-14T14:31:24.918Z",
//                             "updated_at": "2025-10-14T14:35:10.558Z"
//                         }
//                     ]
//                 }
//             }
//         ]
//     },