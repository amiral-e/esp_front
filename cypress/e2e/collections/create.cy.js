describe('Collection Creation', () => {
  const collectionName = 'Music VR Project'
  beforeEach(() => {
    cy.login(
      Cypress.env('testUser').email,
      Cypress.env('testUser').password
    )
  })

  it('can create a collection', () => {
    cy.visit('/protected/collections')


    /**
     * Create a new collection
     * 1. Click on the "Ingest Documents" button
     * 2. Type the collection name
     * 3. Select the description file
     * 4. Click on the "Create Collection" button
     * 5. Check if the collection was created
     */

    const collectionContent = 'music-vr-description.txt'

    cy.fixture(collectionContent, null).as('projectDescription')
    cy.get('#ingest-documents-button').click()
    cy.get('#new-collection-title').type(collectionName)
    cy.get('#new-collection-files').selectFile('@projectDescription')
    cy.get('#create-collection').click()

    cy.get('#collection-table-body > tr').contains(collectionName, { timeout: 10000 }).click()
    cy.get('#document-table-body').contains(collectionContent, { timeout: 10000 })
  })

})