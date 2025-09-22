import CreateCustomer from '../support/listing/createCustomer';
import { customersToCreate } from '../fixtures/happyCustomers.json';

describe('Happy create customer', () => {
  // Configura o event listener UMA VEZ no before each
  beforeEach(() => {
    cy.on('window:alert', (str) => {
      // Apenas log, sem expectativas complicadas
      Cypress.log({
        name: 'alert',
        message: str
      });
    });
  });

  customersToCreate.forEach((customerData) => {
    it(`Deve cadastrar um novo cliente com sucesso - ${customerData.name}`, () => {
      // Visita a página de cadastro
      cy.visit('/cadastro-cliente');

      // Intercepta a chamada POST para a API
      cy.intercept('POST', '**/costumers').as('createCustomer');

      // Preenche o formulário SEM envolver em promises
      CreateCustomer.fillDadosPessoaisEEndereco(customerData);

      if (customerData.billingAddress) {
        CreateCustomer.uncheckEnderecoCobrancaIgualEntrega();
        CreateCustomer.fillEnderecoCobranca(customerData.billingAddress);
      }

      CreateCustomer.navegarParaCartao();
      CreateCustomer.fillCartao(customerData.card);
      CreateCustomer.submeterCadastro();

      // Aguarda a resposta da API
      cy.wait('@createCustomer').its('response.statusCode').should('eq', 201);
      
      cy.url().should('include', '/');
    });
  });
});