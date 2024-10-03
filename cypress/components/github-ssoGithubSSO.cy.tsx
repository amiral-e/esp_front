import React from 'react'
import { GithubSSO } from '@/components/github-sso'

describe('<GithubSSO />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<GithubSSO />)
  })
})
