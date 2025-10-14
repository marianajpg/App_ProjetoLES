import { api } from "./api";

export const postShipping = async (shippingData) => {
    const { data } = await api.post('/shipping', shippingData);
    return data;
};

export const postCalculateShipping = async (shippingData) => {
    const { data } = await api.post('/shipping/calculate', shippingData);
    return data;
};


//exemplo de post shipping
// {
//   "saleId": 1,
//   "freightValue": 12.50,
//   "carrier": "Transportadora X",
//   "serviceName": "Express",
//   "trackingCode": null
// }


//exemplo body Calculate
// {
  
//   "toPostalCode": "08970000",
//   "cartItems": [
//     {
//       "bookId": 1,
//       "quantity": 1,
//       "dimensions": { "height": 10, "width": 15, "depth": 2, "weight": 0.5 },
//       "price": 49.9
//     }
//   ]
// }

//exemplo body retorno calculate
// {
//     "services": [
//         {
//             "id": 1,
//             "name": "PAC",
//             "price": "20.22",
//             "custom_price": "20.22",
//             "discount": "0.00",
//             "currency": "R$",
//             "delivery_time": 7,
//             "delivery_range": {
//                 "min": 6,
//                 "max": 7
//             },
//             "custom_delivery_time": 7,
//             "custom_delivery_range": {
//                 "min": 6,
//                 "max": 7
//             },
//             "packages": [
//                 {
//                     "price": "20.22",
//                     "discount": "0.00",
//                     "format": "box",
//                     "dimensions": {
//                         "height": 2,
//                         "width": 10,
//                         "length": 15
//                     },
//                     "weight": "0.50",
//                     "insurance_value": "49.90",
//                     "products": [
//                         {
//                             "id": "1",
//                             "quantity": 1
//                         }
//                     ]
//                 }
//             ],
//             "additional_services": {
//                 "receipt": false,
//                 "own_hand": false,
//                 "collect": false
//             },
//             "company": {
//                 "id": 1,
//                 "name": "Correios",
//                 "picture": "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png"
//             }
//         },
//         {
//             "id": 2,
//             "name": "SEDEX",
//             "price": "23.14",
//             "custom_price": "23.14",
//             "discount": "0.00",
//             "currency": "R$",
//             "delivery_time": 2,
//             "delivery_range": {
//                 "min": 1,
//                 "max": 2
//             },
//             "custom_delivery_time": 2,
//             "custom_delivery_range": {
//                 "min": 1,
//                 "max": 2
//             },
//             "packages": [
//                 {
//                     "price": "23.14",
//                     "discount": "0.00",
//                     "format": "box",
//                     "dimensions": {
//                         "height": 2,
//                         "width": 10,
//                         "length": 15
//                     },
//                     "weight": "0.50",
//                     "insurance_value": "49.90",
//                     "products": [
//                         {
//                             "id": "1",
//                             "quantity": 1
//                         }
//                     ]
//                 }
//             ],
//             "additional_services": {
//                 "receipt": false,
//                 "own_hand": false,
//                 "collect": false
//             },
//             "company": {
//                 "id": 1,
//                 "name": "Correios",
//                 "picture": "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png"
//             }
//         },
//         {
//             "id": 3,
//             "name": ".Package",
//             "price": "17.52",
//             "custom_price": "17.52",
//             "discount": "0.00",
//             "currency": "R$",
//             "delivery_time": 5,
//             "delivery_range": {
//                 "min": 4,
//                 "max": 5
//             },
//             "custom_delivery_time": 5,
//             "custom_delivery_range": {
//                 "min": 4,
//                 "max": 5
//             },
//             "packages": [
//                 {
//                     "format": "box",
//                     "dimensions": {
//                         "height": 2,
//                         "width": 10,
//                         "length": 15
//                     },
//                     "weight": "0.50",
//                     "insurance_value": "49.90",
//                     "products": [
//                         {
//                             "id": "1",
//                             "quantity": 1
//                         }
//                     ]
//                 }
//             ],
//             "additional_services": {
//                 "receipt": false,
//                 "own_hand": false,
//                 "collect": false
//             },
//             "company": {
//                 "id": 2,
//                 "name": "Jadlog",
//                 "picture": "https://sandbox.melhorenvio.com.br/images/shipping-companies/jadlog.png"
//             }
//         },
//         {
//             "id": 4,
//             "name": ".Com",
//             "price": "16.08",
//             "custom_price": "16.08",
//             "discount": "0.00",
//             "currency": "R$",
//             "delivery_time": 4,
//             "delivery_range": {
//                 "min": 3,
//                 "max": 4
//             },
//             "custom_delivery_time": 4,
//             "custom_delivery_range": {
//                 "min": 3,
//                 "max": 4
//             },
//             "packages": [
//                 {
//                     "format": "box",
//                     "dimensions": {
//                         "height": 2,
//                         "width": 10,
//                         "length": 15
//                     },
//                     "weight": "0.50",
//                     "insurance_value": "49.90",
//                     "products": [
//                         {
//                             "id": "1",
//                             "quantity": 1
//                         }
//                     ]
//                 }
//             ],
//             "additional_services": {
//                 "receipt": false,
//                 "own_hand": false,
//                 "collect": false
//             },
//             "company": {
//                 "id": 2,
//                 "name": "Jadlog",
//                 "picture": "https://sandbox.melhorenvio.com.br/images/shipping-companies/jadlog.png"
//             }
//         },
//         {
//             "id": 17,
//             "name": "Mini Envios",
//             "error": "Peso ultrapassa o limite máximo de 0,30kg.",
//             "company": {
//                 "id": 1,
//                 "name": "Correios",
//                 "picture": "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png"
//             }
//         }
//     ],
//     "lowestPrice": 0,
//     "raw": [
//         {
//             "id": 1,
//             "name": "PAC",
//             "price": "20.22",
//             "custom_price": "20.22",
//             "discount": "0.00",
//             "currency": "R$",
//             "delivery_time": 7,
//             "delivery_range": {
//                 "min": 6,
//                 "max": 7
//             },
//             "custom_delivery_time": 7,
//             "custom_delivery_range": {
//                 "min": 6,
//                 "max": 7
//             },
//             "packages": [
//                 {
//                     "price": "20.22",
//                     "discount": "0.00",
//                     "format": "box",
//                     "dimensions": {
//                         "height": 2,
//                         "width": 10,
//                         "length": 15
//                     },
//                     "weight": "0.50",
//                     "insurance_value": "49.90",
//                     "products": [
//                         {
//                             "id": "1",
//                             "quantity": 1
//                         }
//                     ]
//                 }
//             ],
//             "additional_services": {
//                 "receipt": false,
//                 "own_hand": false,
//                 "collect": false
//             },
//             "company": {
//                 "id": 1,
//                 "name": "Correios",
//                 "picture": "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png"
//             }
//         },
//         {
//             "id": 2,
//             "name": "SEDEX",
//             "price": "23.14",
//             "custom_price": "23.14",
//             "discount": "0.00",
//             "currency": "R$",
//             "delivery_time": 2,
//             "delivery_range": {
//                 "min": 1,
//                 "max": 2
//             },
//             "custom_delivery_time": 2,
//             "custom_delivery_range": {
//                 "min": 1,
//                 "max": 2
//             },
//             "packages": [
//                 {
//                     "price": "23.14",
//                     "discount": "0.00",
//                     "format": "box",
//                     "dimensions": {
//                         "height": 2,
//                         "width": 10,
//                         "length": 15
//                     },
//                     "weight": "0.50",
//                     "insurance_value": "49.90",
//                     "products": [
//                         {
//                             "id": "1",
//                             "quantity": 1
//                         }
//                     ]
//                 }
//             ],
//             "additional_services": {
//                 "receipt": false,
//                 "own_hand": false,
//                 "collect": false
//             },
//             "company": {
//                 "id": 1,
//                 "name": "Correios",
//                 "picture": "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png"
//             }
//         },
//         {
//             "id": 3,
//             "name": ".Package",
//             "price": "17.52",
//             "custom_price": "17.52",
//             "discount": "0.00",
//             "currency": "R$",
//             "delivery_time": 5,
//             "delivery_range": {
//                 "min": 4,
//                 "max": 5
//             },
//             "custom_delivery_time": 5,
//             "custom_delivery_range": {
//                 "min": 4,
//                 "max": 5
//             },
//             "packages": [
//                 {
//                     "format": "box",
//                     "dimensions": {
//                         "height": 2,
//                         "width": 10,
//                         "length": 15
//                     },
//                     "weight": "0.50",
//                     "insurance_value": "49.90",
//                     "products": [
//                         {
//                             "id": "1",
//                             "quantity": 1
//                         }
//                     ]
//                 }
//             ],
//             "additional_services": {
//                 "receipt": false,
//                 "own_hand": false,
//                 "collect": false
//             },
//             "company": {
//                 "id": 2,
//                 "name": "Jadlog",
//                 "picture": "https://sandbox.melhorenvio.com.br/images/shipping-companies/jadlog.png"
//             }
//         },
//         {
//             "id": 4,
//             "name": ".Com",
//             "price": "16.08",
//             "custom_price": "16.08",
//             "discount": "0.00",
//             "currency": "R$",
//             "delivery_time": 4,
//             "delivery_range": {
//                 "min": 3,
//                 "max": 4
//             },
//             "custom_delivery_time": 4,
//             "custom_delivery_range": {
//                 "min": 3,
//                 "max": 4
//             },
//             "packages": [
//                 {
//                     "format": "box",
//                     "dimensions": {
//                         "height": 2,
//                         "width": 10,
//                         "length": 15
//                     },
//                     "weight": "0.50",
//                     "insurance_value": "49.90",
//                     "products": [
//                         {
//                             "id": "1",
//                             "quantity": 1
//                         }
//                     ]
//                 }
//             ],
//             "additional_services": {
//                 "receipt": false,
//                 "own_hand": false,
//                 "collect": false
//             },
//             "company": {
//                 "id": 2,
//                 "name": "Jadlog",
//                 "picture": "https://sandbox.melhorenvio.com.br/images/shipping-companies/jadlog.png"
//             }
//         },
//         {
//             "id": 17,
//             "name": "Mini Envios",
//             "error": "Peso ultrapassa o limite máximo de 0,30kg.",
//             "company": {
//                 "id": 1,
//                 "name": "Correios",
//                 "picture": "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png"
//             }
//         }
//     ]
// }