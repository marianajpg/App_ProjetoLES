
import CheckoutListing from '../support/checkout/listing';
import { CheckoutFixture, UserData, BookData, AddressData, CreditCardData, CouponData } from '../support/checkout/interfaces';

import * as unhappyCheckoutScenarios from '../fixtures/unhappyCheckout.json';

describe('Fluxo de Checkout - Cenários de Erro', () => {


      it('Deve exibir erro ao tentar aplicar um cupom inválido', () => {
    const { user, book: booksData, coupon } = unhappyCheckoutScenarios.invalidCoupon;
    CheckoutListing.loginAsCustomer(user.email);
    cy.url().should('not.contain', '/login');

    booksData.forEach((book: BookData) => {
      CheckoutListing.addBookToCart(book.id, book.quantity);
    });

    CheckoutListing.goToCart();
    cy.contains('h1', 'Carrinho').should('be.visible');
    CheckoutListing.goToPaymentPage();
    cy.url().should('contain', '/pagamento');

    cy.get('[data-cy=coupon-input]').type(coupon.code);
    cy.get('[data-cy=apply-coupon-button]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Cupom inválido.');
    });
  });

        it('Deve exibir erro se o valor do pagamento não corresponder ao total do pedido', () => {
    const { user, book: booksData, address, creditCard } = unhappyCheckoutScenarios.mismatchedPayment;
    CheckoutListing.loginAsCustomer(user.email);
    cy.url().should('not.contain', '/login');

    booksData.forEach((book: BookData) => {
      CheckoutListing.addBookToCart(book.id, book.quantity);
    });

    CheckoutListing.goToCart();
    cy.contains('h1', 'Carrinho').should('be.visible');
    CheckoutListing.goToPaymentPage();
    cy.url().should('contain', '/pagamento');

    // Seleciona endereço e frete
    CheckoutListing.selectAddress(address);
    cy.wait(2000);
    CheckoutListing.selectFirstShippingOption();
    cy.wait(6000);

    // Seleciona o cartão de crédito e insere um valor incorreto
    CheckoutListing.selectCreditCard(creditCard[0]);
    cy.get(`[data-cy=card-amount-input-${creditCard[0].id}]`).should('be.visible').type(creditCard[0].amount);

    // Tenta finalizar a compra
    CheckoutListing.finalizeCheckout();

    // Verifica a mensagem de erro
    cy.on('window:alert', (str) => {
      expect(str).to.contains('O valor total pago com cartões');
    });
  });

      it('Deve exibir erro ao tentar cadastrar um novo endereço com campos obrigatórios faltando', () => {
    const { user, book: booksData, address } = unhappyCheckoutScenarios.incompleteAddress;
    CheckoutListing.loginAsCustomer(user.email);
    cy.url().should('not.contain', '/login');

    booksData.forEach((book: BookData) => {
      CheckoutListing.addBookToCart(book.id, book.quantity);
    });

    CheckoutListing.goToCart();
    cy.contains('h1', 'Carrinho').should('be.visible');
    CheckoutListing.goToPaymentPage();
    cy.url().should('contain', '/pagamento');

    cy.get('[data-cy=add-new-address-button]').click();

    // Preenche apenas alguns campos
    cy.get('[data-cy=new-address-zipcode-input]').type(address.zipCode);
    cy.get('[data-cy=new-address-street-input]').type(address.street);

    // Tenta adicionar o endereço
    cy.get('[data-cy=add-address-button]').click();

    // Verifica a mensagem de erro
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Falha ao adicionar o endereço. Verifique os campos.');
    });
  });

        it('Deve exibir erro ao tentar cadastrar um novo cartão com campos obrigatórios faltando', () => {
    const { user, book: booksData, creditCard } = unhappyCheckoutScenarios.incompleteCreditCard;
    CheckoutListing.loginAsCustomer(user.email);
    cy.url().should('not.contain', '/login');

    booksData.forEach((book: BookData) => {
      CheckoutListing.addBookToCart(book.id, book.quantity);
    });

    CheckoutListing.goToCart();
    cy.contains('h1', 'Carrinho').should('be.visible');
    CheckoutListing.goToPaymentPage();
    cy.url().should('contain', '/pagamento');

    cy.get('[data-cy=add-new-card-button]').click();

    // Preenche apenas alguns campos
    cy.get('[data-cy=new-card-number-input]').type(creditCard.numero);
    cy.get('[data-cy=new-card-name-input]').type(creditCard.name);
    cy.get('.date-picker-full-width').should('be.visible').click();
    cy.get('.react-datepicker__year-select').select('2030');
    cy.get('.react-datepicker__month-select').select('11');
    cy.get('.react-datepicker__day--001').click();
    // Tenta adicionar o cartão
    cy.get('[data-cy=add-card-button]').click();

    // Verifica a mensagem de erro
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Falha ao adicionar o cartão. Verifique os dados.');
    });
  });

        it('Deve exibir erro se o valor do pagamento com cartão for inferior a R$10,00 sem cupom', () => {
    const { user, book: booksData, address, creditCard } = unhappyCheckoutScenarios.belowMinimumCardAmount;
    CheckoutListing.loginAsCustomer(user.email);
    cy.url().should('not.contain', '/login');

    booksData.forEach((book: BookData) => {
      CheckoutListing.addBookToCart(book.id, book.quantity);
    });

    CheckoutListing.goToCart();
    cy.contains('h1', 'Carrinho').should('be.visible');
    CheckoutListing.goToPaymentPage();
    cy.url().should('contain', '/pagamento');

    // Seleciona endereço e frete
    CheckoutListing.selectAddress(address);
    cy.wait(2000);
    CheckoutListing.selectFirstShippingOption();
    cy.wait(6000);

    // Seleciona o cartão de crédito e insere um valor abaixo do mínimo
    CheckoutListing.selectCreditCard(creditCard[0]);
        cy.get(`[data-cy=card-amount-input-${creditCard[0].id}]`).should('be.visible').type(creditCard[0].amount);

    // Tenta finalizar a compra
    CheckoutListing.finalizeCheckout();

    // Verifica a mensagem de erro
    cy.on('window:alert', (str) => {
      expect(str).to.contains('O valor mínimo por cartão é R$10,00');
    });
  });

});
