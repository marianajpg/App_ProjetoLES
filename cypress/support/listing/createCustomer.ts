import { PersonalData, EnderecoEntrega, EnderecoCobranca, Cartao, Botoes } from './elements';

class CreateCustomer {
  fillDadosPessoaisEEndereco(customerData: any) {
    cy.get(PersonalData.nomeCompleto).should('be.enabled').clear().type(customerData.name);
    cy.get(PersonalData.dataNascimento).should('be.enabled').clear().type(customerData.birthdaydate.slice(0, 10));
    cy.get('body').click(0,0);
    cy.get(PersonalData.cpf).should('be.enabled').clear().type(customerData.cpf);
    cy.get(PersonalData.telefone).should('be.enabled').clear().type(customerData.phone);
    cy.get(PersonalData.genero).should('be.enabled').select(customerData.gender);

    const deliveryAddress = customerData.deliveryAddress[0];
    cy.get(EnderecoEntrega.cep).should('be.enabled').clear().type(deliveryAddress.zipCode);
    cy.get(EnderecoEntrega.numero).should('be.enabled').clear().type(deliveryAddress.number);
    cy.get(EnderecoEntrega.tipoEndereco).should('be.enabled').select(deliveryAddress.residenceType);
    cy.get(EnderecoEntrega.tipoLogradouro).should('be.enabled').select(deliveryAddress.streetType);
    cy.get(EnderecoEntrega.logradouro).should('be.enabled').clear().type(deliveryAddress.street);
    cy.get(EnderecoEntrega.complemento).should('be.enabled').clear().type(deliveryAddress.complement);
    cy.get(EnderecoEntrega.apelido).should('be.enabled').clear().type(deliveryAddress.observations);
    cy.get(EnderecoEntrega.bairro).should('be.enabled').clear().type(deliveryAddress.neighborhood);
    cy.get(EnderecoEntrega.cidade).should('be.enabled').clear().type(deliveryAddress.city);
    cy.get(EnderecoEntrega.uf).should('be.enabled').clear().type(deliveryAddress.state);

    cy.get(PersonalData.email).should('be.enabled').clear().type(customerData.email);
    cy.get(PersonalData.senha).should('be.enabled').clear().type(customerData.password);
    cy.get(PersonalData.confirmacaoSenha).should('be.enabled').clear().type(customerData.passwordConfirmation);
  }

  uncheckEnderecoCobrancaIgualEntrega() {
    cy.get(PersonalData.enderecoCobrancaIgualEntrega).parent('label').click();
  }

  fillEnderecoCobranca(billingAddress: any) {
    const address = billingAddress[0];
    cy.get(EnderecoCobranca.cep).clear().type(address.zipCode);
    cy.get(EnderecoCobranca.numero).clear().type(address.number);
    cy.get(EnderecoCobranca.tipoEndereco).select(address.residenceType);
    cy.get(EnderecoCobranca.tipoLogradouro).select(address.streetType);
    cy.get(EnderecoCobranca.logradouro).clear().type(address.street);
    cy.get(EnderecoCobranca.complemento).clear().type(address.complement);
    cy.get(EnderecoCobranca.apelido).clear().type(address.observations);
    cy.get(EnderecoCobranca.bairro).clear().type(address.neighborhood);
    cy.get(EnderecoCobranca.cidade).clear().type(address.city);
    cy.get(EnderecoCobranca.uf).clear().type(address.state);
  }

  fillCartao(cardData: any) {
    cy.get(Cartao.numeroCartao).clear().type(cardData.cardNumber);
    cy.get(Cartao.nomeImpresso).clear().type(cardData.cardHolderName);
    cy.get(Cartao.validade).clear().type(cardData.cardExpirationDate);
    cy.get(Cartao.cvv).clear().type(cardData.cardCVV);
    cy.get(Cartao.bandeira).select(cardData.cardBrand);
  }

  navegarParaCartao() {
    cy.get(Botoes.proximo).click();
  }

  submeterCadastro() {
    cy.get(Botoes.cadastrar).click();
  }

  validatePersonalAndAddressDataErrors() {
    cy.contains('Por favor, preencha os seguintes campos obrigatórios:').should('be.visible');
    cy.contains('- Nome Completo').should('be.visible');
    cy.contains('- Apelido de Entrega').should('be.visible');
    cy.contains('- CPF').should('be.visible');
    cy.contains('- Telefone').should('be.visible');
    cy.contains('- CEP de Entrega').should('be.visible');
    cy.contains('- Número de Entrega').should('be.visible');
    cy.contains('- Endereço de Entrega').should('be.visible');
    cy.contains('- Bairro de Entrega').should('be.visible');
    cy.contains('- Cidade de Entrega').should('be.visible');
    cy.contains('- UF de Entrega').should('be.visible');
  }

  validatePasswordMismatchError() {
    cy.contains('As senhas não coincidem. Por favor, verifique.').should('be.visible');
  }

  validateCardDataErrors() {
    cy.contains('Número do Cartão é obrigatório').should('be.visible'); // Exemplo, ajuste conforme suas mensagens
    cy.contains('Nome no Cartão é obrigatório').should('be.visible'); // Exemplo
  }
}

export default new CreateCustomer();
