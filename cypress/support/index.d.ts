// load the global Cypress types
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login user and provide session
     * @example cy.login()
     */
    login(): Chainable<unknown>;
  }
}
