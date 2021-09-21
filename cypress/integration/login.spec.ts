// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../support/index.d.ts" />

describe('login', () => {
  it('logs a user in', () => {
    cy.login();
    cy.visit('/');
    cy.wait('@session');
    cy.findByRole('link', {name: /sign out/i}).should('exist');
  });
});
