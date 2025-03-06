describe('Login', () => {
  it('should log in', () => {
    cy.login(Cypress.env('testUser').email, Cypress.env('testUser').password)
    cy.visit('/protected/chat')
    cy.get('#sign-out-button').should('be.visible')
  })

  it('should not log in with wrong credentials', () => {
    cy.visit('/sign-in')
    cy.get('input[name=email]').type('fakeUser')
    cy.get('input[name=password]').type('fakePassword')
    cy.get('#sign-in-button').click()
    cy.url().should('include', 'error')
  })
})