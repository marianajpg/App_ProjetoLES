describe('Visit home', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.iwRnxw').click();
    cy.get('#email').type('edurss1000@gmail.com');
    cy.get('#password').type('Aa12345@');
    cy.get('.styles__StyledButton-sc-2bfded38-0').click();
    cy.wait(1000);
  });

  it('Visit home', () => {
    cy.get('[alt="Logo"]').should('be.visible');
  });

  it('Add a product to the cart, edit product amount', () => {
    cy.get(':nth-child(1) > .styles__ImageContainer-sc-e3996d12-1').click();
    cy.wait(1000);
    cy.get('.styles__StyledButton-sc-2bfded38-0').click();
    cy.get('.styles__ModalFooterButton-sc-44f45534-1').click();
    cy.get('.styles__ActionsContainer-sc-1a070e7a-1 > :nth-child(1)').click();
    cy.wait(1000);
    cy.get(
      ':nth-child(1) > .styles__ValueContainer-sc-5a670e31-6 > .styles__BookQtdContainer-sc-5a670e31-5 > [alt="PlusCartIcon"]',
    ).click();
    cy.get(
      ':nth-child(1) > .styles__ValueContainer-sc-5a670e31-6 > .styles__BookQtdContainer-sc-5a670e31-5 > [alt="PlusCartIcon"]',
    ).click();
    cy.get(
      ':nth-child(1) > .styles__ValueContainer-sc-5a670e31-6 > .styles__BookQtdContainer-sc-5a670e31-5 > [alt="PlusCartIcon"]',
    ).click();
    cy.get(
      ':nth-child(1) > .styles__ValueContainer-sc-5a670e31-6 > .styles__BookQtdContainer-sc-5a670e31-5 > [alt="MinusCartIcon"]',
    ).click();
    cy.get(
      ':nth-child(1) > .styles__ValueContainer-sc-5a670e31-6 > .styles__BookQtdContainer-sc-5a670e31-5 > [alt="MinusCartIcon"]',
    ).click();
    cy.get(
      ':nth-child(1) > .styles__ValueContainer-sc-5a670e31-6 > .styles__BookQtdContainer-sc-5a670e31-5 > [alt="MinusCartIcon"]',
    ).click();
  });

  it('Add a product to the cart, remove product from cart', () => {
    cy.get(':nth-child(2) > .styles__ImageContainer-sc-e3996d12-1').click();
    cy.wait(1000);
    cy.get('.styles__StyledButton-sc-2bfded38-0').click();
    cy.get('.styles__ModalFooterButton-sc-44f45534-1').click();
    cy.get('.styles__ActionsContainer-sc-1a070e7a-1 > :nth-child(1)').click();
    cy.wait(1000);
    cy.get(
      ':nth-child(2) > .styles__ValueContainer-sc-5a670e31-6 > .styles__BookQtdContainer-sc-5a670e31-5 > [alt="MinusCartIcon"]',
    ).click();
  });

  it('Finish shopping', () => {
    cy.get('.styles__ActionsContainer-sc-1a070e7a-1 > :nth-child(1)').click();
    cy.wait(1000);
    cy.get('.iwRnxw').click();
    cy.wait(1000);
    cy.get(':nth-child(1) > .styles__OptionContainer-sc-d2eae3ee-10').click();
    cy.get(':nth-child(2) > .styles__OptionContainer-sc-d2eae3ee-10').click();
    cy.get('.iwRnxw').click();
    cy.get(
      '.styles__CardsContainer-sc-d2eae3ee-8 > :nth-child(2) > :nth-child(1)',
    ).click();
    cy.get('.iwRnxw').click();
    cy.wait(1000);
    cy.get('.iwRnxw').click();
    cy.get(
      '.styles__ModalFooterContainer-sc-44f45534-0 > :nth-child(2)',
    ).click();
  });

  it('Add a product to the cart, and finish shopping using a coupon', () => {
    cy.get(':nth-child(1) > .styles__ImageContainer-sc-e3996d12-1').click();
    cy.wait(1000);
    cy.get('.styles__StyledButton-sc-2bfded38-0').click();
    cy.get('.styles__ModalFooterButton-sc-44f45534-1').click();
    cy.get('.styles__ActionsContainer-sc-1a070e7a-1 > :nth-child(1)').click();
    cy.wait(1000);
    cy.get('.iwRnxw').click();
    cy.wait(1000);
    cy.get(':nth-child(1) > .styles__OptionContainer-sc-d2eae3ee-10').click();
    cy.get(':nth-child(2) > .styles__OptionContainer-sc-d2eae3ee-10').click();
    cy.get('.iwRnxw').click();
    cy.get(
      '.styles__CardsContainer-sc-d2eae3ee-8 > :nth-child(2) > :nth-child(1)',
    ).click();
    cy.get('.styles__CoupomInput-sc-d2eae3ee-23').type('5OFF');
    cy.get(
      '.styles__CoupomContainer-sc-d2eae3ee-22 > .styles__StyledButton-sc-2bfded38-0',
    ).click();
    cy.wait(1000);
    cy.contains('R$ 5,00').should('be.visible');
    cy.get('.iwRnxw').click();
    cy.wait(1000);
    cy.contains('-R$ 5,00').should('be.visible');
    cy.get('.iwRnxw').click();
    cy.get(
      '.styles__ModalFooterContainer-sc-44f45534-0 > :nth-child(2)',
    ).click();
  });

  it('Add a product to the cart, and finish shopping using 2 cards and a coupon', () => {
    cy.get(':nth-child(1) > .styles__ImageContainer-sc-e3996d12-1').click();
    cy.wait(1000);
    cy.get('.styles__StyledButton-sc-2bfded38-0').click();
    cy.get('.styles__ModalFooterButton-sc-44f45534-1').click();
    cy.get('.styles__ActionsContainer-sc-1a070e7a-1 > :nth-child(1)').click();
    cy.wait(1000);
    cy.get('.iwRnxw').click();
    cy.wait(1000);
    cy.get(':nth-child(1) > .styles__OptionContainer-sc-d2eae3ee-10').click();
    cy.get(':nth-child(2) > .styles__OptionContainer-sc-d2eae3ee-10').click();
    cy.get('.iwRnxw').click();
    cy.wait(1000);
    cy.get(
      '.styles__CardsContainer-sc-d2eae3ee-8 > :nth-child(2) > :nth-child(1)',
    ).click();
    cy.get(
      '.styles__CardsContainer-sc-d2eae3ee-8 > :nth-child(2) > :nth-child(2)',
    ).click();
    cy.get('.styles__CoupomInput-sc-d2eae3ee-23').type('5OFF');
    cy.get(
      '.styles__CoupomContainer-sc-d2eae3ee-22 > .styles__StyledButton-sc-2bfded38-0',
    ).click();
    cy.wait(1000);
    cy.contains('R$ 5,00').should('be.visible');
    cy.get('.iwRnxw').click();
    cy.wait(1000);
    cy.contains('-R$ 5,00').should('be.visible');
    cy.get('.iwRnxw').click();
    cy.get(
      '.styles__ModalFooterContainer-sc-44f45534-0 > :nth-child(2)',
    ).click();
  });
});
