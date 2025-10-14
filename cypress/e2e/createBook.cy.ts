describe('Fluxo de Criação de Livros', () => {
  beforeEach(() => {
    cy.fixture('book').then(function (data) {
      this.books = data.booksToCreate;
    });
    cy.loginAsColaborador();
  });

  it('Deve criar novos livros com sucesso', function () {
    cy.navigateToConsultaLivros();

    this.books.forEach((book: any) => {
      cy.openCreateBookModal();

      // Preenche o formulário com dados da fixture
      cy.fillBookBasicInfo(book);
      cy.get('input[name="price"]').clear().type(book.cost);
      cy.selectPriceGroupByName(book.pricegroup);

      cy.get('input[name="height"]').type(book.dimensions.height);
      cy.get('input[name="width"]').type(book.dimensions.width);
      cy.get('input[name="depth"]').type(book.dimensions.depth);
      cy.get('input[name="weight"]').type(book.dimensions.weight);

      book.category.forEach((cat: string) => {
        cy.selectCategoryByName(cat);
      });

      cy.get('textarea[name="synopsis"]').type(book.synopsis);

      // cy.get('button.add-image-btn').click();
      // cy.get('input[name="url"]').last().type('https://exemplo.com/capa.jpg');
      // cy.get('input[name="caption"]').last().type('Principal');

      cy.get('button[type="submit"]').contains('Salvar').click();

      // Aguarda um tempo para a atualização da tabela e recarrega a página
      cy.wait(2000);
      cy.reload();

      // Verifica se o novo livro aparece na lista
      cy.contains('h3', book.title).should('be.visible');
    });
  });

  it('Deve exibir mensagens de erro para campos obrigatórios', () => {
    cy.navigateToConsultaLivros();
    cy.openCreateBookModal();
    
    // Tenta submeter o formulário vazio
    cy.get('button[type="submit"]').contains('Salvar').click();

    // Verifica se as mensagens de erro são exibidas para os campos obrigatórios
    cy.get('input[name="title"]:invalid').should('exist');
    cy.get('input[name="author"]:invalid').should('exist');
    cy.get('input[name="price"]:invalid').should('exist');
    cy.get('select[name="pricegroupId"]:invalid').should('exist');
  });
});