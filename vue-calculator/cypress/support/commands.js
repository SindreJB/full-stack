// ***********************************************
// Custom commands for Cypress tests
// ***********************************************

// Command to fill out the feedback form
Cypress.Commands.add('fillFeedbackForm', (name, email, message) => {
	if (name !== null) cy.get('#name').clear().type(name);
	if (email !== null) cy.get('#email').clear().type(email);
	if (message !== null) cy.get('#message').clear().type(message);
});

// Command to check if submit button is disabled
Cypress.Commands.add('submitButtonShouldBeDisabled', () => {
	cy.get('.submit-btn').should('be.disabled');
});

// Command to check if submit button is enabled
Cypress.Commands.add('submitButtonShouldBeEnabled', () => {
	cy.get('.submit-btn').should('not.be.disabled');
});
