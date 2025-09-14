describe('Visit home', () => {
  it('Visit home', () => {
    cy.intercept('GET', 'http://localhost:3000/costumers').as('getCustomers');
    cy.visit('/admin/customers');
    cy.wait('@getCustomers');
  });
});
