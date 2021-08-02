describe('Create Page', () => {
  beforeEach(() => {
    cy.visit('/create');
  });

  it('Should create point when selecting a searched destination', () => {
    // checks buttons should be disabled
    cy.findByRole('button', {name: 'redo'}).should('be.disabled');
    cy.findByRole('button', {name: 'undo'}).should('be.disabled');
    cy.findByRole('button', {name: 'clear'}).should('be.disabled');

    // Type into search box
    cy.findByRole('combobox', {name: /locations/i}).type('claremont');
    cy.findByRole('listbox', {timeout: 8000}).within(() => {
      cy.findByText(/no results/i).should('not.exist');
      cy.findAllByRole('option').first().click();
    });

    cy.findByRole('listbox').should('not.exist');

    cy.findByRole('main').within(() => {
      cy.findByRole('button', {name: /add point/i}).click();
      cy.findAllByTestId('point', {timeout: 8000}).should('have.length', 1);

      cy.findByRole('button', {name: 'redo'}).should('be.disabled');
      cy.findByRole('button', {name: 'undo'}).should('not.be.disabled');
      cy.findByRole('button', {name: 'clear'}).should('not.be.disabled');

      cy.findByRole('button', {name: 'clear'}).click();
      cy.findAllByTestId('point').should('have.length', 0);
    });
  });

  it('should use geolocation to find user', () => {
    cy.findByRole('button', {name: /geolcation/i}).click();
    cy.findByTestId('user-marker', {timeout: 10000}).should('exist');
  });
});
