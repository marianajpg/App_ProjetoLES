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
      // Click the edit button for the specific customer
      cy.get(`[data-cy=edit-customer-${targetCustomerId}]`).click();

      // Check if the URL is correct
      cy.url().should('include', `/consultar-cliente/editar-cliente/${targetCustomerId}`);

      // Fill the form with only the delivery address fields that need to be updated
      EditCustomer.fillDeliveryAddress(customerData.deliveryAddress[0]);

      // Set up alert listener
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Cliente atualizado com sucesso!');
      });

      // Submit the form
      EditCustomer.submitForm();

      // Assertions
      cy.wait('@putCustomer').then(({ request, response }) => {
        if (response) {
          cy.log('API Response:', JSON.stringify(response));
          expect(response.statusCode).to.be.oneOf([200, 204]);
          
          // Find the updated address in the request body
          interface Address {
            id: number;
          }
          const updatedAddress = request.body.deliveryAddress.find((addr: Address) => addr.id === customerData.deliveryAddress[0].id);
          expect(updatedAddress).to.not.be.undefined;
          expect(updatedAddress.observations).to.equal(customerData.deliveryAddress[0].observations);
          expect(updatedAddress.street).to.equal(customerData.deliveryAddress[0].street);
        } else {
          throw new Error('A requisição PUT não recebeu uma resposta do servidor.');
        }
      });
    });
  });
});
