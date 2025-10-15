import { Checkout, Cart } from './elements';

class CheckoutListing {
  addBookToCart(bookId: number, quantity: number) {
    cy.visit(`/tela-produto/${bookId}`);
    if (quantity>1)
   { cy.get('[data-cy="product-quantity-input"]').clear().type(quantity.toString());}
    cy.get('[data-cy="add-to-cart-button"]').click();
  } 

  goToCart() {
    cy.visit('/carrinho');
  }

  goToPaymentPage() {
    cy.get(Cart.finalizePurchaseButton).should('not.have.class', 'disabled').click();
  }

  applyCoupon(couponCode: string, expectedDiscount: number) {
    cy.get(Checkout.couponInput).type(couponCode);
    cy.get(Checkout.applyCouponButton).click();
  }

  selectAddress(addressData: any) {
    cy.get(Checkout.addressSelect).select(addressData.id.toString());
  }

  addNewAddress(addressData: any) {
    cy.get(Checkout.addNewAddressButton).click();
    cy.get(Checkout.newAddress.observations).type(addressData.observations);
    cy.get(Checkout.newAddress.zipCode).type(addressData.zipCode);
    cy.get(Checkout.newAddress.street).type(addressData.street);
    cy.get(Checkout.newAddress.number).type(addressData.number);
    cy.get(Checkout.newAddress.neighborhood).type(addressData.neighborhood);
    cy.get(Checkout.newAddress.city).type(addressData.city);
    cy.get(Checkout.newAddress.state).type(addressData.state);
    cy.get(Checkout.newAddress.complement).type(addressData.complement);
    cy.get(Checkout.newAddress.residenceType).select(addressData.residenceType);
    cy.get(Checkout.newAddress.streetType).select(addressData.streetType);
    cy.get(Checkout.newAddress.saveButton).click();
  }

  // --- Credit Card Functions ---
  selectCreditCard(cardData: any) {
    cy.get(Checkout.savedCardsSelect).click();
    cy.contains(`•••• ${cardData.numero.slice(-4)}`).click();
  }

  // selectValueCard(quantity: any){
  //   cy.get(".card-amount-input").click();
  //   cy.get('.card-amount-input').clear().type(quantity.toString());

  // }

  addNewCreditCard(cardData: any) {
    cy.get(Checkout.addNewCardButton).click();
    cy.get(Checkout.newCard.number).type(cardData.numero);
    cy.get(Checkout.newCard.name).type(cardData.nomeImpresso);
    cy.get(Checkout.newCard.cvv).type(cardData.cvv);
    cy.get(Checkout.newCard.brand).select(cardData.bandeira);
    cy.get(Checkout.newCard.expiry).type(cardData.validade); // Simplified for now
    cy.get(Checkout.newCard.saveButton).click();
  }

   fillCardAmountWithTotal() {
      cy.get('.resumo-total p strong').invoke('text').then((totalText) => {

        const numericValue = totalText
         .replace('Total: R$', '')   
        .replace(',', '.');       
   
      const totalAmount = parseFloat(numericValue);

      cy.get('.card-amount-input').first().type(totalAmount.toString());
      });
    }

  selectShipping(shippingType: string) {
    cy.get(Checkout.shippingOption(shippingType)).check({ force: true });
  }

  finalizeCheckout() {
    cy.get(Checkout.finalizeCheckoutButton).click();
  }

  loginAsCustomer(email: string) {
    cy.visit('/login');
    cy.get('input[name="user-type"][value="cliente"]').check({ force: true });
    cy.get('.email-input').type(email);
    cy.get('button[type="button"]').contains('ENTRAR').click();
    cy.url().should('not.include', '/login');
  }
}

export default new CheckoutListing();