describe('Forgot Password Flow', () => {
  beforeEach(() => {
    cy.visit('/forgot-password');
  });

  it('should display the forgot password form', () => {
    cy.get('h1').should('have.text', 'Réinitialiser le mot de passe');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('#reset-password-button').should('have.text', 'Réinitialiser le mot de passe');
    cy.get('#sign-in-link').should('have.text', 'Se connecter');
  });

  it('should show an error message for invalid email', () => {
    // Input invalid email and submit
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('#reset-password-button').click();

    // Check for error message
    cy.get('#form-error-message').should('be.visible')
      .and('contain', 'Impossible de réinitialiser le mot de passe');
  });

  it('should show success message for valid email', () => {
    // Input valid email and submit
    cy.get('input[name="email"]').type('valid-email@example.com');
    cy.get('#reset-password-button').click();

    // Check for success message or any notification indicating password reset initiation
    cy.get('#form-success-message').should('be.visible')
      .and('contain', 'Vérifiez votre email pour réinitialiser votre mot de passe');
  });

  it('should redirect to sign in page when clicking "Se connecter"', () => {
    cy.get('#sign-in-link').click();

    cy.url().should('include', '/sign-in');
  });
});
