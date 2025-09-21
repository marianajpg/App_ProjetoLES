declare global {
  namespace Cypress {
    interface Chainable {
      loginAsColaborador(): Chainable<void>
    }
  }
}

export {};