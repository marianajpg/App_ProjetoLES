/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    getByDataCy(value: string): Chainable<JQuery<HTMLElement>>;
    navigateToConsultaLivros(): Chainable<void>;
    openCreateBookModal(): Chainable<void>;
    fillBookBasicInfo(bookData: any): Chainable<void>;
    selectCategoryByName(categoryName: string): Chainable<void>;
    selectPriceGroupByName(groupName: string | number): Chainable<void>;
    loginAsCustomer(email: string): Chainable<void>;
    addBookToCart(bookId: number, quantity: number): Chainable<void>;
    applyCoupon(couponCode: string, expectedDiscount: number): Chainable<void>;
    selectAddress(addressId: number): Chainable<void>;
    addNewCreditCard(cardData: CreditCardData): Chainable<void>;
    selectShipping(shippingOption: string): Chainable<void>;
    finalizeCheckout(): Chainable<void>;
    loginAsColaborador(): Chainable<void>;
  }
}
