import EditCustomer from '../support/details/editCustomer';
import { customersToEdit } from '../fixtures/happyCustomers.json';

describe('Edit personal data', () => {
  customersToEdit.forEach((customerData) => {
    const targetCustomerId = customerData.id;

    beforeEach(() => {
      cy.loginAsColaborador();
      cy.intercept('GET', '**/costumers').as('getCustomers');
      cy.intercept('PUT', `**/costumers/${targetCustomerId}`).as('putCustomer');
      cy.visit('/consultar-cliente');
      cy.wait('@getCustomers');
    });

    it(`Deve editar o endereço de entrega do cliente com ID ${targetCustomerId}`, () => {

      cy.get(`[data-cy=edit-customer-${targetCustomerId}]`).click();
      cy.url().should('include', `/consultar-cliente/editar-cliente/${targetCustomerId}`);
      EditCustomer.fillDeliveryAddress(customerData.deliveryAddress[0]);

      cy.on('window:alert', (text) => {
        expect(text).to.equal('Cliente atualizado com sucesso!');
      });

      EditCustomer.submitForm();

      cy.wait('@putCustomer').then(({ request, response }) => {
        if (response) {
          cy.log('API Response:', JSON.stringify(response));
          expect(response.statusCode).to.be.oneOf([200, 204]);
          
          interface Address {
            id: number;
          }
          const updatedAddress = request.body.deliveryAddress.find((addr: Address) => addr.id === customerData.deliveryAddress[0].id);
          expect(updatedAddress).to.not.be.undefined;
          // expect(updatedAddress.observations).to.equal(customerData.deliveryAddress[0].observations);
          expect(updatedAddress.street).to.equal(customerData.deliveryAddress[0].street);
        } else {
          throw new Error('A requisição PUT não recebeu uma resposta do servidor.');
        }
      });
    });
  });
});
