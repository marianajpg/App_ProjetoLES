/// <reference types="cypress" />

Cypress.Commands.add('getByDataCy', (value) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('loginAsColaborador', () => {
  cy.visit('http://localhost:5173/login');
  cy.get('input[type="radio"][value="colaborador"]').check({ force: true });
  cy.get('button[type="button"]').contains('ENTRAR').click();
  cy.url().should('include', '/consultar-cliente');
});

Cypress.Commands.add('navigateToConsultaLivros', () => {
  cy.visit('http://localhost:5173/consultar-livros');
  cy.url().should('include', '/consultar-livros');
});

Cypress.Commands.add('openCreateBookModal', () => {
  cy.get('.botao-criar').click();
  cy.get('.modal-container').should('be.visible');
});

Cypress.Commands.add('fillBookBasicInfo', (bookData = {}) => {
  const defaultData = {
    title: 'Livro Teste',
    author: 'Autor Teste',
    publisher: 'Editora Teste',
    year: '2024',
    edition: '1ª Edição',
    ISBN: '9781234567890',
    pages: '200',
    barcode: '1234567890123',
    price: '39.90'
  };
  
  const data = { ...defaultData, ...bookData };
  
  cy.get('input[name="title"]').type(data.title);
  cy.get('input[name="author"]').type(data.author);
  cy.get('input[name="publisher"]').type(data.publisher);
  cy.get('input[name="year"]').type(data.year);
  cy.get('input[name="edition"]').type(data.edition);
  cy.get('input[name="ISBN"]').type(data.ISBN);
  cy.get('input[name="pages"]').type(data.pages);
  cy.get('input[name="barcode"]').type(data.barcode);
  cy.get('input[name="price"]').type(data.price);
});

Cypress.Commands.add('selectCategoryByName', (categoryName) => {
  cy.get('.basic-multi-select').click();
  cy.get('.select__menu').should('be.visible');
  cy.get('.select__menu').contains(categoryName).click();
});


Cypress.Commands.add('applyCoupon', (couponCode, expectedDiscount) => {
  cy.getByDataCy('coupon-input').type(couponCode);
  cy.getByDataCy('apply-coupon-button').click();
  cy.contains('p', `Desconto: R$${expectedDiscount.toFixed(2)}`).should('be.visible');
});

Cypress.Commands.add('addNewCreditCard', (cardData) => {
  cy.getByDataCy('add-new-card-button').click();
  cy.getByDataCy('new-card-number-input').type(cardData.numero);
  cy.getByDataCy('new-card-name-input').type(cardData.nome);
  cy.getByDataCy('new-card-cvv-input').type(cardData.cvv);
  cy.getByDataCy('new-card-brand-select').select(cardData.bandeira);
  
  // Handle DatePicker for validade
  cy.getByDataCy('new-card-validade-datepicker').click();
  cy.get('.react-datepicker__month-select').select(new Date(cardData.validade).getMonth().toString());
  cy.get('.react-datepicker__year-select').select(new Date(cardData.validade).getFullYear().toString());
  cy.get('.react-datepicker__day--today').click(); // Select current day, assuming any day is fine
  cy.getByDataCy('add-card-button').click();
});

Cypress.Commands.add('finalizeCheckout', () => {
  cy.getByDataCy('finalize-checkout-button').click();
  cy.contains('Compra finalizada com sucesso!').should('be.visible');
});