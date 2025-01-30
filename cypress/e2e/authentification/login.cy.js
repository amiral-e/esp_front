describe('Login', () => {
  beforeEach(() => {
    cy.login(Cypress.env('testUser').email, Cypress.env('testUser').password)
  })

  it('should log in', () => {
    cy.visit('/protected/chat')
    cy.get('#user-greeting').contains(`Hey, ${Cypress.env('testUser').email}!`)
    cy.get('#sign-out-button').should('be.visible')
  })
  /* it('should login', () => {
    cy.visit('/sign-in')
    cy.get('input[name=email]').type('kemede6062@bflcafe.com')
    cy.get('input[name=password]').type('Samoten7778049@')
    cy.get('#sign-in-button').click()

    cy.get('#user-greeting').should('have.text', `Hey, ${'kemede6062@bflcafe.com'}!`)
    cy.get('#sign-out-button').should('be.visible')

  }) */



})