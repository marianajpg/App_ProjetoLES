describe('Delete customer', () => {
  it('Deve deletar um cliente com sucesso', () => {
    cy.visit('/admin/customers');

    cy.intercept('GET', 'http://localhost:8000/customers', req => {
      delete req.headers['if-none-match'];
    }).as('getCustomers');

    cy.intercept('DELETE', 'http://localhost:8000/customers/*').as('deleteCustomerAPI');

    let initialCustomerCount: number;

    cy.wait('@getCustomers').then(({ response }) => {
      initialCustomerCount = response?.body.length;

      // Verifica se há clientes para deletar
      if (initialCustomerCount === 0) {
        cy.log('Nenhum cliente encontrado para deletar. O teste será ignorado.');
        return; // Sai do teste se não houver clientes
      }

      // Clica no botão de deletar do primeiro cliente da lista
      // ATENÇÃO: Ajuste este seletor para o botão de deletar real na sua UI
      cy.get('.index-styles__StyledTable-sc-843dcd6c-0 tbody tr').first().find('button').contains('Excluir').click();

      // Verifica se o modal de confirmação apareceu
      cy.contains('Tem certeza?').should('be.visible');

      // Clica no botão de confirmação no modal
      // ATENÇÃO: Ajuste este seletor para o botão de confirmação real na sua UI
      cy.get('button').contains('Sim').click(); // Ou 'Confirmar', dependendo do texto do seu botão

      // Espera a chamada da API de DELETE
      cy.wait('@deleteCustomerAPI').then(({ response }) => {
        expect(response.statusCode).to.be.oneOf([200, 204]); // 200 OK ou 204 No Content
      });

      // Espera a lista de clientes ser atualizada após a exclusão
      cy.wait('@getCustomers').then(({ response }) => {
        const newCustomerCount = response?.body.length;
        expect(newCustomerCount).to.be.lessThan(initialCustomerCount);
      });

      // Opcional: Verificar mensagem de sucesso
      cy.contains('Cliente deletado com sucesso!').should('be.visible');
    });
  });
});