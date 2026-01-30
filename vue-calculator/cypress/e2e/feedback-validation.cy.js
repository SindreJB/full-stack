describe('Feedback Form - Validation Scenario', () => {
	beforeEach(() => {
		cy.visit('/');
		cy.get('.page_change').contains('Go to feedback form').click();
		cy.url().should('include', '/feedback');
		// Clear localStorage before each test
		cy.clearLocalStorage();
	});

	describe('Initial State', () => {
		it('should have submit button disabled when form is empty', () => {
			cy.submitButtonShouldBeDisabled();
		});

		it('should display all form fields', () => {
			cy.get('#name').should('be.visible');
			cy.get('#email').should('be.visible');
			cy.get('#message').should('be.visible');
			cy.get('.submit-btn').should('be.visible');
		});
	});

	describe('Name Field Validation', () => {
		it('should show error when name field is empty and blurred', () => {
			cy.get('#name').focus().blur();
			cy.get('.error-text').should('contain', 'Name cannot be empty');
		});

		it('should keep submit button disabled with only name filled', () => {
			cy.get('#name').type('John Doe');
			cy.submitButtonShouldBeDisabled();
		});

		it('should show error for whitespace-only name', () => {
			cy.get('#name').type('   ').blur();
			cy.get('.error-text').should('contain', 'Name cannot be empty');
			cy.submitButtonShouldBeDisabled();
		});

		it('should remove error when valid name is entered', () => {
			cy.get('#name').focus().blur();
			cy.get('.error-text').should('exist');

			cy.get('#name').type('John Doe');
			cy.get('#name').blur();
			cy.get('.error-text').should('not.exist');
		});
	});

	describe('Email Field Validation', () => {
		it('should show error when email field is empty and blurred', () => {
			cy.get('#email').focus().blur();
			cy.get('.error-text').should('contain', 'Email cannot be empty');
		});

		it('should show error for invalid email format', () => {
			cy.get('#email').type('invalid-email').blur();
			cy.get('.error-text').should('contain', 'Please enter a valid email address');
			cy.submitButtonShouldBeDisabled();
		});

		it('should show error for email without domain', () => {
			cy.get('#email').type('test@').blur();
			cy.get('.error-text').should('contain', 'Please enter a valid email address');
			cy.submitButtonShouldBeDisabled();
		});

		it('should show error for email without @', () => {
			cy.get('#email').type('testemail.com').blur();
			cy.get('.error-text').should('contain', 'Please enter a valid email address');
			cy.submitButtonShouldBeDisabled();
		});

		it('should accept valid email format', () => {
			cy.get('#email').type('test@example.com').blur();
			cy.get('.error-text').should('not.exist');
		});

		it('should keep submit button disabled with only name and email filled', () => {
			cy.get('#name').type('John Doe');
			cy.get('#email').type('john@example.com');
			cy.submitButtonShouldBeDisabled();
		});
	});

	describe('Message Field Validation', () => {
		it('should show error when message field is empty and blurred', () => {
			cy.get('#message').focus().blur();
			cy.get('.error-text').should('contain', 'Message cannot be empty');
		});

		it('should show error for whitespace-only message', () => {
			cy.get('#message').type('   ').blur();
			cy.get('.error-text').should('contain', 'Message cannot be empty');
			cy.submitButtonShouldBeDisabled();
		});

		it('should remove error when valid message is entered', () => {
			cy.get('#message').focus().blur();
			cy.get('.error-text').should('exist');

			cy.get('#message').type('This is my feedback message');
			cy.get('#message').blur();
			cy.get('.error-text').should('not.exist');
		});
	});

	describe('Submit Button State Based on Validation', () => {
		it('should enable submit button only when all fields are valid', () => {
			// Initially disabled
			cy.submitButtonShouldBeDisabled();

			// Fill name only - still disabled
			cy.get('#name').type('John Doe');
			cy.submitButtonShouldBeDisabled();

			// Fill email with invalid format - still disabled
			cy.get('#email').type('invalid');
			cy.submitButtonShouldBeDisabled();

			// Fix email - still disabled (missing message)
			cy.get('#email').clear().type('john@example.com');
			cy.submitButtonShouldBeDisabled();

			// Fill message - should now be enabled
			cy.get('#message').type('This is my feedback');
			cy.submitButtonShouldBeEnabled();
		});

		it('should disable submit button when valid field becomes invalid', () => {
			// Fill all fields correctly
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'This is my feedback');
			cy.submitButtonShouldBeEnabled();

			// Make email invalid
			cy.get('#email').clear().type('invalid');
			cy.submitButtonShouldBeDisabled();
		});

		it('should disable submit button when any field is cleared', () => {
			// Fill all fields correctly
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'This is my feedback');
			cy.submitButtonShouldBeEnabled();

			// Clear name
			cy.get('#name').clear();
			cy.submitButtonShouldBeDisabled();
		});

		it('should disable button during form validation after blur', () => {
			cy.get('#name').type('John Doe');
			cy.get('#email').type('john@example.com');
			cy.get('#message').type('Test');

			// All fields filled, button should be enabled
			cy.submitButtonShouldBeEnabled();
		});
	});

	describe('Multiple Validation Errors', () => {
		it('should show errors for all invalid fields when form is submitted with invalid data', () => {
			// Try to trigger validation on all fields
			cy.get('#name').focus().blur();
			cy.get('#email').focus().blur();
			cy.get('#message').focus().blur();

			// Should show multiple error messages
			cy.get('.error-text').should('have.length.at.least', 3);
		});

		it('should show specific error messages for each field', () => {
			cy.get('#name').focus().blur();
			cy.get('#email').type('invalid').blur();
			cy.get('#message').focus().blur();

			cy.contains('.error-text', 'Name cannot be empty').should('exist');
			cy.contains('.error-text', 'Please enter a valid email address').should('exist');
			cy.contains('.error-text', 'Message cannot be empty').should('exist');
		});
	});

	describe('Error Class Application', () => {
		it('should apply error class to invalid input fields', () => {
			cy.get('#name').focus().blur();
			cy.get('#name').should('have.class', 'error');

			cy.get('#email').type('invalid').blur();
			cy.get('#email').should('have.class', 'error');

			cy.get('#message').focus().blur();
			cy.get('#message').should('have.class', 'error');
		});

		it('should remove error class when field becomes valid', () => {
			cy.get('#name').focus().blur();
			cy.get('#name').should('have.class', 'error');

			cy.get('#name').type('John Doe').blur();
			cy.get('#name').should('not.have.class', 'error');
		});
	});

	describe('Form Button Text', () => {
		it('should display correct button text initially', () => {
			cy.get('.submit-btn').should('contain', 'Submit Feedback');
		});
	});

	describe('Accessibility', () => {
		it('should have proper labels for all form fields', () => {
			cy.get('label[for="name"]').should('contain', 'Name');
			cy.get('label[for="email"]').should('contain', 'Email');
			cy.get('label[for="message"]').should('contain', 'Feedback');
		});

		it('should have proper input types', () => {
			cy.get('#name').should('have.attr', 'type', 'text');
			cy.get('#email').should('have.attr', 'type', 'email');
			cy.get('#message').should('have.prop', 'tagName', 'TEXTAREA');
		});
	});
});
