import CreateCustomer from '../support/listing/createCustomer';
import { customersToCreate } from '../fixtures/customers.json';
import { Botoes } from '../support/listing/elements';

describe('Unhappy create customer path', () => {
  beforeEach(() => {
    cy.visit('/cadastro-cliente');
  });

  it('Tentar avançar sem preencher dados pessoais e de endereço', () => {
    cy.get(Botoes.proximo).click();
    CreateCustomer.validatePersonalAndAddressDataErrors();
  });

  it('Tentar cadastrar com senhas que não coincidem', () => {
    const customerData = {
      name: 'Teste Senha',
      email: 'teste.senha@email.com',
      password: 'Senha123',
      passwordConfirmation: 'Senha321', // Senha diferente
      cpf: '111.111.111-11',
      phone: '11999999999',
      birthdaydate: '1990-01-01',
      gender: 'F',
      deliveryAddress: [{
        residenceType: 'RESIDENCIAL',
        streetType: 'RUA',
        street: 'Rua Teste',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Bairro Exemplo',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000',
        observations: 'Casa'
      }],
    };

    CreateCustomer.fillDadosPessoaisEEndereco(customerData);
    cy.get(Botoes.proximo).click();
    // Tenta submeter o formulário (mesmo que o botão de cadastro esteja na próxima aba, o erro de senha pode aparecer antes)
    cy.get(Botoes.cadastrar).click(); // Clica no botão de cadastrar (que estará visível na aba de cartão)
    CreateCustomer.validatePasswordMismatchError();
  });

  it('Tentar cadastrar sem preencher os dados do cartão', () => {
    const customerData = customersToCreate[0]; // Usar um cliente válido para preencher a primeira aba
    customerData.password = 'Senha@123';
    customerData.confPassword = 'Senha@123';

    CreateCustomer.fillDadosPessoaisEEndereco(customerData);
    cy.get(Botoes.proximo).click(); // Avança para a aba do cartão

    // Tenta submeter sem preencher os dados do cartão
    cy.get(Botoes.cadastrar).click();
    // Asserções para erros de validação do cartão
    // ATENÇÃO: Você precisará adicionar as mensagens de erro reais do seu formulário para os campos do cartão
    cy.contains('Número do Cartão é obrigatório').should('be.visible');
    cy.contains('Nome no Cartão é obrigatório').should('be.visible');
    cy.contains('Validade (MM/AA) é obrigatório').should('be.visible');
    cy.contains('CVV é obrigatório').should('be.visible');
    cy.contains('Selecione a Bandeira').should('be.visible'); // Ou a mensagem de erro para bandeira
  });
});