describe('Fluxo de Edição de Livros', () => {
  beforeEach(() => {
    cy.fixture('book-to-edit').then(function (data) {
      this.books = data.booksWithImages;
    });
    cy.loginAsColaborador();
  });

  it('Deve editar um livro para adicionar imagens', function () {
    cy.navigateToConsultaLivros();

    this.books.forEach((book: any) => {
      if (book.images.length > 0) {
        // Encontra o livro na lista e clica no card
        cy.contains('h3', book.title).parents('.card').click();

        // Adiciona as imagens
        book.images.forEach((image: any) => {
          cy.get('button.add-image-btn').click();
          cy.get('input[name="url"]').last().type(image.url);
          cy.get('input[name="caption"]').last().type(image.caption);
        });

        // Salva as alterações
        cy.get('button[type="submit"]').contains('Salvar').click();


        // Volta para a lista de livros
        cy.navigateToConsultaLivros();
      }
    });
  });
});