describe('login', () => {
  it('logs a user in', () => {
    cy.intercept('/api/auth/session', {fixture: 'session.json'});

    cy.visit('/');
  });
});
