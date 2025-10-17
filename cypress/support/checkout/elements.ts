export const Checkout = {
  // Coupon
  couponInput: '[data-cy="coupon-input"]',
  applyCouponButton: '[data-cy="apply-coupon-button"]',

  // Address
  addressSelect: '[data-cy="address-select"]',
  addNewAddressButton: '[data-cy="add-new-address-button"]',
  newAddress: {
    observations: '[data-cy="new-address-observations-input"]',
    zipCode: '[data-cy="new-address-zipcode-input"]',
    street: '[data-cy="new-address-street-input"]',
    number: '[data-cy="new-address-number-input"]',
    neighborhood: '[data-cy="new-address-neighborhood-input"]',
    city: '[data-cy="new-address-city-input"]',
    state: '[data-cy="new-address-state-input"]',
    complement: '[data-cy="new-address-complement-input"]',
    residenceType: '[data-cy="new-address-residence-type-select"]',
    streetType: '[data-cy="new-address-street-type-select"]',
    saveButton: '[data-cy="add-address-button"]',
  },

  // Credit Card
  savedCardsSelect: '.select__input-container',
  addNewCardButton: '[data-cy="add-new-card-button"]',
  newCard: {
    number: '[data-cy="new-card-number-input"]',
    name: '[data-cy="new-card-name-input"]',
    expiry: 'input[placeholder="Validade (MM/AAAA)"]',
    cvv: '[data-cy="new-card-cvv-input"]',
    brand: '[data-cy="new-card-brand-select"]',
    saveButton: '[data-cy="add-card-button"]',
  },
  
  // Shipping
  shippingOption: (shippingType: string) => `input[name="frete"][value="${shippingType}"]`,

  // Finalize
  finalizeCheckoutButton: '[data-cy="finalize-checkout-button"]',
};

export const Cart = {
    finalizePurchaseButton: '[data-cy="finalize-purchase-button"]',
}