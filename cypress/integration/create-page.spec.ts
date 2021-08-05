import {
  isPermissionAllowed,
  isPermissionBlocked,
} from 'cypress-browser-permissions';

describe('Create Page', () => {
  beforeEach(() => {
    cy.visit('/create');
  });

  it('Create point when selecting a searched destination', () => {
    // checks buttons should be disabled
    cy.findByRole('button', {name: 'redo'}).should('be.disabled');
    cy.findByRole('button', {name: 'undo'}).should('be.disabled');
    cy.findByRole('button', {name: 'clear'}).should('be.disabled');

    // Type into search box
    cy.findByRole('combobox', {name: /locations/i}).type('claremont');
    cy.findByRole('listbox', {timeout: 10000}).within(() => {
      cy.findByText(/no results/i).should('not.exist');
      cy.findAllByRole('option').first().click();
    });

    cy.findByRole('listbox').should('not.exist');

    cy.findByRole('main').within(() => {
      cy.findByRole('button', {name: /add point/i, timeout: 10000}).click();
      cy.findAllByTestId('point', {timeout: 10000}).should('have.length', 1);

      cy.findByRole('button', {name: 'redo'}).should('be.disabled');
      cy.findByRole('button', {name: 'undo'}).should('not.be.disabled');
      cy.findByRole('button', {name: 'clear'}).should('not.be.disabled');

      cy.findByRole('button', {name: 'clear'}).click();
      cy.findAllByTestId('point').should('have.length', 0);
    });
  });
});

describe('geolocation', () => {
  describe('is allowed', () => {
    beforeEach(() => {
      cy.visit('/create', {
        onBeforeLoad(win) {
          const latitude = 41.38879;
          const longitude = 2.15899;
          cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake(
            cb => {
              return cb({coords: {latitude, longitude}});
            },
          );
        },
      });
    });

    it('Renders marker when geolocation is found', () => {
      expect(isPermissionAllowed('geolocation')).to.be.true;

      cy.findByRole('button', {name: /locate/i}).click();
      cy.findByTestId('user-marker').should('exist');
    });
  });

  describe('is blocked', () => {
    beforeEach(() => {
      cy.visit('/create', {
        onBeforeLoad(win) {
          cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake(
            (success, error) => {
              return error({});
            },
          );
        },
      });

      Cypress.env({
        browserPermissions: {
          geolocation: 'block',
        },
      });
    });

    after(() => {
      Cypress.env({
        browserPermissions: {
          geolocation: 'allow',
        },
      });
    });

    it('Shows error notification when geolocation is blocked', () => {
      expect(isPermissionBlocked('geolocation')).to.be.true;
      cy.findByRole('button', {name: /locate/i}).click();
      cy.findByTestId('toast');
    });
  });
});
