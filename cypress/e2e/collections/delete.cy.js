describe('Collection Deletion', () => {

  const collectionName = 'Music-VR'
  beforeEach(() => {
    cy.login(
      Cypress.env('testUser').email,
      Cypress.env('testUser').password
    )

  })

  it('can delete a collection', () => {
    cy.visit('/protected/collections')
    cy.get(`#table-cell-${collectionName}`).click()
    cy.get(`#delete-collection-${collectionName}`).click()
    cy.get('#collections-table').should('not.contain', collectionName)
  })

})