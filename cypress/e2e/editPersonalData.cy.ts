import EditCustomer from '../support/details/editCustomer';
describe('Edit personal data', () => {
  let customersToUpdate;

  beforeEach(() => {
    // Carrega os dados do arquivo de fixture
    cy.fixture('customers').then((customers) => {
      customersToUpdate = customers.customersToUpdate;
    });

    // Visita a página de listagem de clientes (assumindo que é onde o botão de edição está)
    cy.visit('/admin/customers');

    // Intercepta a requisição GET para obter os clientes
    cy.intercept('GET', 'http://localhost:8000/customers', req => {
      delete req.headers['if-none-match'];
    }).as('getCustomers');

    // Intercepta a requisição PUT para atualizar o cliente
    cy.intercept('PUT', 'http://localhost:8000/customers/*').as('putCustomer');

    // Espera pelos clientes serem carregados
    cy.wait('@getCustomers');

    // Clica no botão de editar do primeiro cliente da lista (ajuste o seletor conforme necessário)
    // Este seletor é um exemplo e pode precisar ser ajustado para o seu HTML real
    cy.get('.index-styles__StyledTable-sc-843dcd6c-0 tbody tr').first().find('a[href*="/admin/customers/"]').click();

    // Intercepta a requisição GET para obter os detalhes do cliente específico
    cy.intercept('GET', 'http://localhost:8000/customers/*', req => {
      delete req.headers['if-none-match'];
    }).as('getCustomerDetails');

    cy.wait('@getCustomerDetails');
  });

  it('Deve editar os dados pessoais de um cliente com sucesso', () => {
    // Preenche o formulário de edição com os novos dados
    EditCustomer.fillPersonalData(customersToUpdate);

    // Submete o formulário
    EditCustomer.submitPersonalData();

    // Verifica se a requisição PUT foi feita com sucesso
    cy.wait('@putCustomer').then(({ request, response }) => {
      expect(response.statusCode).to.equal(200); // Ou 204, dependendo da sua API
      expect(request.body.name).to.equal(customersToUpdate.name);
      // Adicione mais asserções para verificar outros campos atualizados
    });

    // Verifica se uma mensagem de sucesso é exibida (se aplicável)
    cy.contains('Cliente atualizado com sucesso!').should('be.visible');
  });
});
