describe('Login', () => {
  beforeEach(() => {
    cy.visit('/sign-in')
  })

  it('should display the sign-in form with all elements', () => {
    // Verify if all form elements are visible
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('#sign-in-button').should('have.text', 'Se connecter ');
    cy.get('#forgot-password-link').should('have.text', 'Mot de passe oublié ?');
    cy.get('#sign-up-link').should('have.text', 'S\'inscrire');
  });

  it('should log in', () => {
    cy.login(Cypress.env('testUser').email, Cypress.env('testUser').password)
    cy.visit('/')
    cy.get('#sign-out').should('be.visible')
    cy.visit('/sign-in')
  })

  it('should not log in with wrong credentials', () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('#sign-in-button').click();

    cy.get('#form-error-message').should('be.visible')
      .and('contain', 'Invalid login credentials');
  });

  it('should redirect to sign-up page when clicking on the sign up link', () => {
    cy.get('#sign-up-link').click();
    cy.url().should('include', '/sign-up');
  });
})