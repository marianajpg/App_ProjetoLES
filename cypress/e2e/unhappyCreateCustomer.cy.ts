import CreateCustomer from '../support/listing/createCustomer';
import { customersToCreate } from '../fixtures/unhappyCustomers.json';
import { Botoes, Cartao } from '../support/listing/elements';

describe('Unhappy create customer path', () => {
  const baseCustomer = customersToCreate[0];

  beforeEach(() => {
    cy.visit('/cadastro-cliente');
  });

  it('Tentar avançar sem preencher dados pessoais e de endereço', () => {
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Por favor, preencha os seguintes campos obrigatórios:');
    });
    cy.get(Botoes.proximo).click();
  });

  it('Tentar cadastrar com senhas que não coincidem', () => {
    const customerComSenhaErrada = {
      ...baseCustomer,
      password: 'Senha123',
      passwordConfirmation: 'Senha321', // Senha diferente
    };

    cy.on('window:alert', (text) => {
      expect(text).to.equal('As senhas não coincidem. Por favor, verifique.');
    });

    CreateCustomer.fillDadosPessoaisEEndereco(customerComSenhaErrada);
    CreateCustomer.navegarParaCartao();
    CreateCustomer.fillCartao(customerComSenhaErrada.card);
    CreateCustomer.submeterCadastro();
  });

  it('Tentar cadastrar sem preencher os dados do cartão', () => {

    CreateCustomer.fillDadosPessoaisEEndereco(baseCustomer);
    CreateCustomer.navegarParaCartao();

    CreateCustomer.submeterCadastro();

    cy.get(Cartao.numeroCartao).should('have.prop', 'validity').and('have.property', 'valid', false);
    cy.get(Cartao.nomeImpresso).should('have.prop', 'validity').and('have.property', 'valid', false);
    cy.get(Cartao.validade).should('have.prop', 'validity').and('have.property', 'valid', false);
    cy.get(Cartao.cvv).should('have.prop', 'validity').and('have.property', 'valid', false);
    cy.get(Cartao.bandeira).should('have.prop', 'validity').and('have.property', 'valid', false);
  });
});