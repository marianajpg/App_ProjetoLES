import { api } from "./api";

export const getAddressById = async (id) => {
    const response = await api.get(`/address/${encodeURIComponent(id)}`);
    return response.data;
    
}

export const getAddress = async ()=> {
    const response = await api.get(`/address`);
    return response.data;
    
}

export const postAddress = async (addressData) => {
    const { data } = await api.post(`/address`, addressData);
    return data;
};

export const deleteAddress = async (id) => {
    const response = await api.delete(`/address/${id}`);
    return response.data;
};

export const putAddress = async (id, addressData) => {
    const response = await api.put(`/address/${id}`, addressData);
    return response.data;
};




// exemplo POST
// {
//   "costumerId": 1,
//   "type": "DELIVERY",
//   "residenceType": "Apartamento",
//   "streetType": "Rua",
//   "street": "das Flores",
//   "number": "123",
//   "complement": "Bloco B, Apt 202",
//   "neighborhood": "Jardim Primavera",
//   "city": "São Paulo",
//   "state": "SP",
//   "zipCode": "01234-567",
//   "observations": "Próximo ao parque central"
// }


// exemplo de GET by id
// [
//     {
//         "id": 1,
//         "type": "BILLING",
//         "residenceType": "RESIDENCIAL",
//         "streetType": "RUA",
//         "street": "8601 Vineland Ave",
//         "number": "23",
//         "complement": "",
//         "neighborhood": "rvsevfsev",
//         "city": "orlando",
//         "state": "SP",
//         "zipCode": "07500-000",
//         "observations": "teste",
//         "created_at": "2025-10-06T00:02:44.370Z",
//         "updated_at": "2025-10-06T00:02:44.370Z"
//     },
//     {
//         "id": 2,
//         "type": "DELIVERY",
//         "residenceType": "RESIDENCIAL",
//         "streetType": "RUA",
//         "street": "8601 Vineland Ave",
//         "number": "23",
//         "complement": "",
//         "neighborhood": "rvsevfsev",
//         "city": "orlando",
//         "state": "SP",
//         "zipCode": "07500-000",
//         "observations": "teste",
//         "created_at": "2025-10-06T00:02:44.374Z",
//         "updated_at": "2025-10-06T00:02:44.374Z"
//     }
// ]
