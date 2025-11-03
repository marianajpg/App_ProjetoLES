import CheckoutListing from '../support/checkout/listing';
import { CheckoutFixture, UserData, BookData, AddressData, CreditCardData, CouponData } from '../support/checkout/interfaces';

import * as checkoutScenarios from '../fixtures/checkout.json';

describe('Fluxo de Checkout Completo - Orientado a Dados', () => {


  checkoutScenarios.checkouts.forEach((checkout: any, index: number) => {

    it(`Cenário #${index + 1}: Deve realizar um checkout completo para o usuário ${checkout.user.email}`, () => {
      
      const { user, book: booksData, address, creditCard, coupon } = checkout;

      CheckoutListing.loginAsCustomer(user.email);
      cy.url().should('not.contain', '/login'); 


      booksData.forEach((book: BookData) => {
        CheckoutListing.addBookToCart(book.id, book.quantity);
      });
      

      CheckoutListing.goToCart();
      cy.contains('h1', 'Carrinho').should('be.visible'); 

      CheckoutListing.goToPaymentPage();
      cy.url().should('contain', '/pagamento'); 

      
      if (coupon && coupon.code) {
        CheckoutListing.applyCoupon(coupon.code, coupon.value);
        // cy.get('.coupon-success-message').should('be.visible'); 
      }


      if (address.id) {
        CheckoutListing.selectAddress(address);
      } else {
        CheckoutListing.addNewAddress(address);
      }
      cy.wait(2000);
      CheckoutListing.selectFirstShippingOption();
      cy.wait(6000);


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
      // cy.visit('/perfil');


      // Assertiva Opcional: Verificar se o carrinho está vazio após a compra
      // cy.visit('/carrinho');
      // cy.contains('Seu carrinho está vazio').should('be.visible');
    });
  });
});