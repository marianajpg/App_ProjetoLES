describe('Funcionalidade de Troca de Status de Pedido', () => {
  beforeEach(() => {
    // Intercepta a chamada de login e garante que o usuário seja autenticado como colaborador
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          name: 'Colaborador',
          email: 'colaborador@example.com',
          role: 'colaborador',
        },
        token: 'fake-token',
      },
    }).as('loginRequest');

    // Intercepta a chamada para obter os pedidos
    cy.intercept('GET', '**/checkout', {
      statusCode: 200,
      fixture: 'pedidos.json', // Mock de dados para os pedidos
    }).as('getPedidos');

    // Visita a página de login e preenche o formulário
    cy.visit('/login');
    cy.get('input[name="email"]').type('colaborador@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Espera o login ser bem-sucedido e navega para a consulta de pedidos
    cy.wait('@loginRequest');
    cy.visit('/colaborador/consultar-pedidos');
    cy.wait('@getPedidos');
  });

  it('Deve exibir os botões de troca de status e permitir a atualização do status do pedido', () => {
    // Verifica se a tabela de pedidos está visível
    cy.get('.tabela-pedidos').should('be.visible');

    // Encontra um pedido com status "PROCESSING" e clica no botão para alterar para "IN_TRANSIT"
    cy.contains('tr', 'PROCESSING').within(() => {
      cy.get('.status-button').should('be.visible').and('contain', 'Em Trânsito').click();
    });

    // Intercepta a chamada de atualização de status
    cy.intercept('PUT', '**/sales/**', {
      statusCode: 200,
      body: { message: 'Status atualizado com sucesso' },
    }).as('updateStatus');

    // Espera a chamada de atualização e verifica se o status foi atualizado na interface
    cy.wait('@updateStatus');
    cy.contains('tr', 'IN_TRANSIT').should('be.visible');
  });
});
