/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    getByDataCy(value: string): Chainable<JQuery<HTMLElement>>;
    navigateToConsultaLivros(): Chainable<void>;
    openCreateBookModal(): Chainable<void>;
    fillBookBasicInfo(bookData: any): Chainable<void>;
    selectCategoryByName(categoryName: string): Chainable<void>;
    selectPriceGroupByName(groupName: string | number): Chainable<void>;
    loginAsColaborador(): Chainable<void>;
  }
}
