import { api } from "./api";

export const postCreditcards = async (creditcardsData) => {
    const { data } = await api.post('/creditcards', creditcardsData);
    return data;
};


export const getCreditcards = async () => {
    try{
    const response = await api.get('/creditcards');
    return response.data;
    } catch (error) {
        console.error('Erro ao consultar cartões: ', error);
        throw new Error('Não foi possível consultar os cartões');
    }
};

export const deleteCreditcards = async (id) => {
    try {
        const response = await api.delete(`/creditcards/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar cartão:', error);
        throw new Error('Não foi possível deletar o cartão');
    }
};

export const putCreditcards = async (id, creditcardsData) => {
    try {
        const response = await api.put(`/creditcards/${id}`, creditcardsData);
        return response.data;
    } catch (error) {
        console.error('Erro ao tentar atualizar cartão:', error);
        throw new Error('Não foi possível atualizar o cartão');
    }
};

export const getCreditcardsByEmail = async (email) => {
  if (!email) return null;
  const response = await api.get(`/creditcards/email/${encodeURIComponent(email)}`);
  return response.data;
};


// exemplo POST
// {
//   "costumerId": 8,
//   "cardNumber": "555555555555555",
//       "cardHolderName": "ANA CAROLINA SILVA2",
//       "cardExpirationDate": "2030-12-31",
//       "cardCVV": "789",
//       "cardBrand": "VISA",
//       "preferredCard": false
// }
