describe('Collection Creation', () => {
  beforeEach(() => {
    cy.login(
      Cypress.env('testUser').email,
      Cypress.env('testUser').password
    )
  })

  /**
   * Create a new collection
   * 1. Click on the "Ingest Documents" button
   * 2. Type the collection name
   * 3. Select the description file
   * 4. Click on the "Create Collection" button
   * 5. Check if the collection was created
   */
  it('can create a collection', () => {
    const collectionName = 'Music-VR'
    const collectionContent = 'music-vr-description.txt'

    cy.visit('/protected/collections')


    cy.fixture(collectionContent, null).as('projectDescription')
    cy.get('#ingest-documents-button').click()
    cy.get('#new-collection-title').type(collectionName)
    cy.get('#new-collection-files').selectFile('@projectDescription')
    cy.get('#create-collection').click()

    cy.get(`#table-cell-${collectionName}`).click()
    cy.get('#collection-documents').contains(collectionContent, { timeout: 10000 })
  })


  /**
   * Create a new collection without a file
   * 1. Click on the "Ingest Documents" button
   * 2. Type the collection name
   * 3. Click on the "Create Collection" button
   * 4. Check if the error message is displayed
   */
  it('should not create a collection without a file', () => {
    const collectionName = 'No File Collection'

    cy.visit('/protected/collections')
    cy.get('#ingest-documents-button').click()
    cy.get('#new-collection-title').type(collectionName)
    cy.get('#create-collection').click()

    cy.get('#collections-table').should('not.contain', collectionName)
  })

})