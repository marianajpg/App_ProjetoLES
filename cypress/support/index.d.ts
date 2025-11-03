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

    // Custom commands for exchange process
    requestExchangeAPI(saleId: number, items: { vendaItemId: number, quantidade: number }[], reason: string): Chainable<any>;
    authorizeExchangeAPI(exchangeId: number): Chainable<any>;
    confirmExchangeAPI(exchangeId: number): Chainable<any>;
    receiveExchangeAPI(exchangeId: number, itemsToRestock: any[]): Chainable<any>;
  }
}