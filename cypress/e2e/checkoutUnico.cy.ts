import CheckoutListing from '../support/checkout/listing';
import { CheckoutFixture, UserData, BookData, AddressData, CreditCardData, CouponData } from '../support/checkout/interfaces';

describe('Fluxo de Checkout Completo', () => {
  let userData: UserData;
  let booksData: BookData[]; 
  let addressData: AddressData;
  let creditCardData: CreditCardData;
  let couponData: CouponData;

  beforeEach(() => {
    cy.fixture('checkout').then((data: CheckoutFixture) => {
      userData = data.user;
      booksData = data.book; 
      addressData = data.address;
      creditCardData = data.creditCard;
      couponData = data.coupon;
    });
  });

  it('Deve realizar um checkout completo com sucesso', () => {
    CheckoutListing.loginAsCustomer(userData.email);

    // 1. Escolher livros e adicionar ao carrinho (em loop)
    booksData.forEach(book => {
      CheckoutListing.addBookToCart(book.id, book.quantity);
    });

    // 2. Ir para o carrinho e depois para a página de Pagamento
    CheckoutListing.goToCart();
   
    CheckoutListing.goToPaymentPage();

    // 3. Inserir cupom (se houver)
    CheckoutListing.applyCoupon(couponData.code, couponData.value);
    

    // 4. Escolher ou adicionar endereço
    if (addressData.id) {
      CheckoutListing.selectAddress(addressData);
    } else {
      CheckoutListing.addNewAddress(addressData);
    }

    // 5. Escolher ou adicionar forma de pagamento
    if (creditCardData.id) {
      CheckoutListing.selectCreditCard(creditCardData);
    } else {
      CheckoutListing.addNewCreditCard(creditCardData);
    }

    CheckoutListing.fillCardAmountWithTotal();

    // 6. Escolher o frete
    // CheckoutListing.selectShipping('padrao'); // Frete Padrão

    // 7. Finalizar Compra
    CheckoutListing.finalizeCheckout();
    cy.visit('/meus-pedidos');
  });
});

