import { customersToDelete } from '../fixtures/happyCustomers.json';

describe('Delete customer', () => {
  customersToDelete.forEach((customer) => {
    it(`Deve deletar o cliente com ID ${customer.id} com sucesso`, () => {
      cy.loginAsColaborador();
      cy.visit('/consultar-cliente');

      cy.intercept('GET', '**/costumers').as('getCustomers');
      cy.intercept('DELETE', `**/costumers/${customer.id}`).as('deleteCustomer');

      cy.wait('@getCustomers');

      cy.get(`[data-cy=edit-customer-${customer.id}]`).closest('tr').find('button[title="Excluir cliente"]').click();

      cy.on('window:confirm', () => true);

      cy.wait('@deleteCustomer').its('response.statusCode').should('be.oneOf', [200, 204]);

      cy.on('window:alert', (text) => {
        expect(text).to.equal('Cliente excluído com sucesso!');
      });
    });
  });
});