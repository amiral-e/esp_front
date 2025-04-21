describe('Sign Up Flow', () => {
  beforeEach(() => {
    // Visit the sign-up page
    cy.visit('/sign-up');
  });

  it('should display the sign-up form with all elements', () => {
    // Verify if all form elements are visible
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('#sign-up-button').should('be.visible');
    cy.get('#sign-in-link').should('have.text', 'Se connecter');
  });

  it.skip('should show error for invalid email format', () => {
    // Input invalid email format and submit
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('#sign-up-button').click();

    // Check for error message
    cy.get('#form-error-message').should('be.visible')
  });

  it.skip('should submit the form with valid data', () => {
    // Intercept the API request for the sign-up action
    /* cy.intercept('POST', '/api/auth/signup', {
      statusCode: 200,
      body: { message: 'Registration successful' },
    }).as('signUp'); */

    // Fill out the form with valid data
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('kemede6063@blcafe.fr');
    cy.get('input[name="password"]').type('password123');
    cy.get('#sign-up-button').click();

    // Check for the success response
    cy.get('#form-success-message').should('be.visible')
      .and('contain', 'Merci de vous être inscrit ! Veuillez vérifier votre e-mail pour obtenir un lien de vérification')
  });

  it('should redirect to login page when clicking "Se connecter"', () => {
    cy.get('#sign-in-link').click();

    cy.url().should('include', '/sign-in');
  });

  it('should show GitHub SSO button', () => {
    cy.get('#github-sso').should('be.visible');
  });
});
