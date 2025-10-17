export interface UserData {
  email: string;
}

export interface BookData {
  id: number;
  title: string;
  quantity: number;
}

export interface AddressData {
  id: number;
  residenceType: string;
  streetType: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  observations: string;
}

export interface CreditCardData {
  id: number;
  numero: string;
  validade: string;
  nomeImpresso: string;
  bandeira: string;
  cvv: string;
  percent: number;
}

export interface CouponData {
  code: string;
  value: number;
}

export interface CheckoutFixture {
  user: UserData;
  book: BookData[];
  address: AddressData;
  creditCard: CreditCardData[];
  coupon: CouponData;
}
