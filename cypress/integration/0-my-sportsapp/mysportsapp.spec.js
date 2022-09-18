describe('The sportsapp main page', () => {
    it('loads successfully', () => {
        cy.visit('http://localhost:3000')

        cy.get('#main-nav')
            .should('be.visible')
            .within(() => {
                cy.get('text')
                    .should('contain.text', "Pinaclebet")
            })
    })
})