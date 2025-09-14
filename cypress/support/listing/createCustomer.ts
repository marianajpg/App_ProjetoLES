import { PersonalData, EnderecoEntrega, Cartao, Botoes } from './elements';

class CreateCustomer {
  fillDadosPessoaisEEndereco(customerData: any) {
    cy.get(PersonalData.nomeCompleto).clear().type(customerData.name);
    cy.get(PersonalData.dataNascimento).clear().type(customerData.birthdaydate.slice(0, 10));
    cy.get(PersonalData.cpf).clear().type(customerData.cpf);
    cy.get(PersonalData.telefone).clear().type(customerData.phone);
    cy.get(PersonalData.genero).select(customerData.gender);

    const deliveryAddress = customerData.deliveryAddress[0];
    cy.get(EnderecoEntrega.cep).clear().type(deliveryAddress.zipCode);
    cy.get(EnderecoEntrega.numero).clear().type(deliveryAddress.number);
    cy.get(EnderecoEntrega.tipoEndereco).select(deliveryAddress.residenceType);
    cy.get(EnderecoEntrega.tipoLogradouro).select(deliveryAddress.streetType);
    cy.get(EnderecoEntrega.logradouro).clear().type(deliveryAddress.street);
    cy.get(EnderecoEntrega.complemento).clear().type(deliveryAddress.complement);
    cy.get(EnderecoEntrega.apelido).clear().type(deliveryAddress.observations);
    cy.get(EnderecoEntrega.bairro).clear().type(deliveryAddress.neighborhood);
    cy.get(EnderecoEntrega.cidade).clear().type(deliveryAddress.city);
    cy.get(EnderecoEntrega.uf).clear().type(deliveryAddress.state);

    cy.get(PersonalData.email).clear().type(customerData.email);
    cy.get(PersonalData.senha).clear().type(customerData.password);
    cy.get(PersonalData.confirmacaoSenha).clear().type(customerData.passwordConfirmation);
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
