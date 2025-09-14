import CreateCustomer from '../support/listing/createCustomer';

describe('Happy create customer', () => {
  // Dados de teste que correspondem à estrutura do seu formulário e API
  const mockCustomer = {
    name: 'João da Silva',
    email: 'joao.silva@teste.com',
    password: 'Senha@123',
    passwordConfirmation: 'Senha@123',
    cpf: '123.456.789-00',
    phone: '11987654321',
    birthdaydate: '1990-01-01',
    gender: 'M', // 'F' para Feminino, 'M' para Masculino
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
    card: {
        cardNumber: '1111222233334444',
        cardHolderName: 'Joao D Silva',
        cardExpirationDate: '12/28',
        cardCVV: '123',
        cardBrand: 'VISA',
    }
  };

  beforeEach(() => {
    // Visita a página de cadastro
    cy.visit('/cadastro-cliente');

    // Intercepta a chamada POST para a API de criação de cliente
    cy.intercept('POST', '**/customers').as('createCustomer');
  });

  it('Deve cadastrar um novo cliente com sucesso', () => {
    // Preenche a primeira parte do formulário (Dados Pessoais e Endereço)
    CreateCustomer.fillDadosPessoaisEEndereco(mockCustomer);

    // Avança para a próxima etapa
    CreateCustomer.navegarParaCartao();

    // Preenche os dados do cartão
    CreateCustomer.fillCartao(mockCustomer.card);

    // Submete o formulário
    CreateCustomer.submeterCadastro();

    // Aguarda a chamada à API e verifica a resposta
    cy.wait('@createCustomer').then(({ response }) => {
      expect(response.statusCode).to.equal(201); // Verifica se o status code é 201 (Created)
      cy.log('Resposta da API:', response.body);
    });

    // Verifica se o usuário foi redirecionado para a home
    cy.url().should('include', '/');

    // Adicionalmente, você pode verificar se uma mensagem de sucesso é exibida
    // cy.contains('Usuário e cartão cadastrados com sucesso!').should('be.visible');
  });
});