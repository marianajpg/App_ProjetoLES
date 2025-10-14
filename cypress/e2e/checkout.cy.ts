interface UserData {
  email: string;
}

interface BookData {
  id: number;
  title: string;
  quantity: number;
}

interface AddressData {
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

interface CreditCardData {
  numero: string;
  validade: string;
  nome: string;
  bandeira: string;
  cvv: string;
}

interface CouponData {
  code: string;
  value: number;
}

interface CheckoutFixture {
  user: UserData;
  book: BookData;
  address: AddressData;
  creditCard: CreditCardData;
  coupon: CouponData;
}

describe('Fluxo de Checkout Completo', () => {
  let userData: UserData;
  let bookData: BookData;
  let addressData: AddressData;
  let creditCardData: CreditCardData;
  let couponData: CouponData;

  beforeEach(() => {
    cy.fixture('checkout').then((data: CheckoutFixture) => {
      userData = data.user;
      bookData = data.book;
      addressData = data.address;
      creditCardData = data.creditCard;
      couponData = data.coupon;
    });
    cy.loginAsCustomer(userData.email);
  });

  it('Deve realizar um checkout completo com sucesso', () => {
    // 1. Escolher livros e adicionar ao carrinho
    cy.addBookToCart(Number(bookData.id), Number(bookData.quantity));

    // 2. Ir para o carrinho
    cy.getByDataCy('finalize-purchase-button').click();

    // 3. Ir para a página de Pagamento
    cy.url().should('include', '/pagamento');

    // 4. Inserir cupom (se houver)
    cy.applyCoupon(couponData.code, couponData.value);

    // 5. Escolher o endereço (assumindo que já existe um endereço cadastrado para o usuário)
    cy.selectAddress(addressData.id);

    // 6. Escolher a forma de pagamento (adicionar um novo cartão)
    cy.addNewCreditCard(creditCardData);

    // 7. Escolher o frete
    cy.selectShipping('padrao'); // Frete Padrão

    // 8. Finalizar Compra
    cy.finalizeCheckout();
    cy.url().should('include', '/meusprodutos');
  });
});
