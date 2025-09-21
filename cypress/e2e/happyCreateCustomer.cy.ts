import CreateCustomer from '../support/listing/createCustomer';
import { customersToCreate } from '../fixtures/customers.json';

describe('Happy create customer', () => {
  customersToCreate.forEach((customerData) => {
    it(`Deve cadastrar um novo cliente com sucesso - ${customerData.name}`, () => {
      // Visita a página de cadastro
      cy.visit('/cadastro-cliente');

      // Intercepta a chamada POST para a API de criação de cliente
      cy.intercept('POST', '**/costumers').as('createCustomer');

      // Preenche a primeira parte do formulário (Dados Pessoais e Endereço)
      CreateCustomer.fillDadosPessoaisEEndereco(customerData);

      if (customerData.billingAddress) {
          CreateCustomer.uncheckEnderecoCobrancaIgualEntrega();
          CreateCustomer.fillEnderecoCobranca(customerData.billingAddress);
      }

      // Avança para a próxima etapa
      CreateCustomer.navegarParaCartao();

      // Preenche os dados do cartão
      CreateCustomer.fillCartao(customerData.card);

      // Submete o formulário
      CreateCustomer.submeterCadastro();

      // Aguarda a chamada à API e verifica a resposta
      cy.wait('@createCustomer').then((interception) => {
        // Adicionamos um log para ver o objeto de interceptação no console do navegador
        console.log('Objeto de interceptação do Cypress:', interception);

        // É uma boa prática verificar se a resposta realmente existe
        if (interception && interception.response) {
          expect(interception.response.statusCode).to.equal(201);
          cy.log('Resposta da API:', interception.response.body);
        } else {
          // Se 'response' for undefined, o teste falhará com uma mensagem mais clara
          throw new Error('cy.wait("@createCustomer") não recebeu uma resposta do servidor. Verifique se a requisição foi enviada corretamente e se o servidor está respondendo.');
        }
      });

      // Verifica se o usuário foi redirecionado para a home
      cy.url().should('include', '/');

      // Adicionalmente, você pode verificar se uma mensagem de sucesso é exibida
      // cy.contains('Usuário e cartão cadastrados com sucesso!').should('be.visible');
    });
  });
});