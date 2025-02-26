describe('Collection Deletion', () => {

  const collectionName = 'A Random Project'
  beforeEach(() => {
    cy.login(
      Cypress.env('testUser').email,
      Cypress.env('testUser').password
    )
  })

  it('can delete a collection', () => {
    cy.visit('/protected/collections')
    cy.get('#collection-table-body').contains(collectionName).click()
    cy.get('#delete-collection').click()
    cy.get('#collection-table-body').should('not.contain', collectionName)
  })

})