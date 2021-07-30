describe('Create Page', () => {
  it('Should create point when selecting a destination', () => {
    cy.visit('/create');

    // Type into search box
    cy.findByRole('combobox', {name: /locations/i}).type('Claremont');
    cy.findByRole('listbox').within(() => {
      cy.findByText(/no results/i).should('not.exist');
      cy.findAllByRole('option', {name: /Claremont/i})
        .first()
        .click();
    });

    cy.findByRole('listbox').should('not.exist');

    cy.findByRole('main').within(() => {
      cy.findByRole('button', {name: /add point/i}).click();
      cy.findAllByTestId('point').should('have.length', 1);
    });
  });
});
