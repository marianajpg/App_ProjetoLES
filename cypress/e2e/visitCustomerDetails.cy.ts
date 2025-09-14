describe('Visit customer details', () => {
  it('Visit customer details', () => {
    cy.visit('/admin/customers');
    cy.intercept('GET', 'http://localhost:8000/customers').as('getCustomers');
    cy.intercept('GET', 'http://localhost:8000/customers/*').as('getCustomer');

    cy.wait('@getCustomers');
    cy.get('.index-styles__StyledTable-sc-843dcd6c-0 > :nth-child(2)').should(
      'be.visible',
    );
    cy.get(
      ':nth-child(2) > .lists-styles__StyledRowBodyActions-sc-f0e62f7e-3 > .index-styles__StyledLink-sc-bfe3845a-0',
    ).click();
    cy.url().should('include', '/customer/');
    cy.wait('@getCustomer');
  });
});
