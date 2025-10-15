import CheckoutListing from '../support/checkout/listing';
import { CheckoutFixture, UserData, BookData, AddressData, CreditCardData, CouponData } from '../support/checkout/interfaces';

// 1. Importa os dados diretamente do arquivo JSON.
// Isso é síncrono e mais simples que usar cy.fixture para múltiplos testes.
import * as checkoutScenarios from '../fixtures/checkout.json';

describe('Fluxo de Checkout Completo - Orientado a Dados', () => {

  // 2. Itera sobre a lista de checkouts do arquivo importado.
  // Para cada cenário, um novo teste 'it(...)' será criado.
  checkoutScenarios.checkouts.forEach((checkout: any, index: number) => {

    it(`Cenário #${index + 1}: Deve realizar um checkout completo para o usuário ${checkout.user.email}`, () => {
      
      // 3. Os dados de 'checkout' já estão disponíveis diretamente, sem precisar de alias ou beforeEach.
      const { user, book: booksData, address, creditCard, coupon } = checkout;

      CheckoutListing.loginAsCustomer(user.email);
      cy.url().should('not.contain', '/login'); // Assertiva: verifica se o login teve sucesso

      // Adicionar livros ao carrinho
      booksData.forEach((book: BookData) => {
        CheckoutListing.addBookToCart(book.id, book.quantity);
      });
      
      // Ir para o carrinho e pagamento
      CheckoutListing.goToCart();
      cy.contains('h1', 'Carrinho').should('be.visible'); // Assertiva: verifica se está na página do carrinho

      CheckoutListing.goToPaymentPage();
      cy.url().should('contain', '/pagamento'); // Assertiva: verifica se está na página de pagamento

      // Aplicar cupom, se existir
      
      if (coupon && coupon.code) {
        CheckoutListing.applyCoupon(coupon.code, coupon.value);
        // cy.get('.coupon-success-message').should('be.visible'); // Exemplo de assertiva
      }

      // Escolher ou adicionar endereço
      if (address.id) {
        CheckoutListing.selectAddress(address);
      } else {
        CheckoutListing.addNewAddress(address);
      }
      cy.wait(2000);
      CheckoutListing.selectFirstShippingOption();
      cy.wait(1000);
      // Escolher ou adicionar forma de pagamento

      creditCard.forEach((card: CreditCardData) => {
      if (card.id) {
        CheckoutListing.selectCreditCard(card);
      } else {
        CheckoutListing.addNewCreditCard(card);
      }
      });
      CheckoutListing.fillCardAmountWithTotal(creditCard);

      
      // Finalizar Compra
      CheckoutListing.finalizeCheckout();
      cy.visit('/perfil');


      // Assertiva Opcional: Verificar se o carrinho está vazio após a compra
      // cy.visit('/carrinho');
      // cy.contains('Seu carrinho está vazio').should('be.visible');
    });
  });
});