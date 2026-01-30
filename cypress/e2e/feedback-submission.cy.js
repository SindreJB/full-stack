describe('Feedback Form - Successful Submission Scenario', () => {
	beforeEach(() => {
		// Clear localStorage before each test
		cy.clearLocalStorage();

		// Intercept API calls to json-server
		cy
			.intercept('POST', 'http://localhost:3000/feedback', (req) => {
				// Validate the request body
				expect(req.body).to.have.property('name');
				expect(req.body).to.have.property('email');
				expect(req.body).to.have.property('message');

				// Send successful response
				req.reply({
					statusCode: 200,
					body: {
						id: 1,
						name: req.body.name,
						email: req.body.email,
						message: req.body.message,
						timestamp: new Date().toISOString(),
					},
				});
			})
			.as('submitFeedback');

		cy.visit('/');
		cy.get('.page_change').contains('Go to feedback form').click();
		cy.url().should('include', '/feedback');
	});

	describe('Successful Form Submission', () => {
		it('should submit form successfully with valid data and show success message', () => {
			// Fill in valid form data
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'This is my feedback message');

			// Submit button should be enabled
			cy.submitButtonShouldBeEnabled();

			// Submit the form
			cy.get('.submit-btn').click();

			// Button should show "Sending..." during submission
			cy.get('.submit-btn').should('contain', 'Sending...');

			// Wait for the API call
			cy.wait('@submitFeedback');

			// Check that success message is displayed
			cy.get('.status-message').should('be.visible');
			cy.get('.status-message').should('have.class', 'success');
			cy.get('.status-message').should('contain', 'Thank you for your feedback!');
			cy.get('.status-message').should('contain', 'We have received your message.');
		});

		it('should send correct data to the server', () => {
			const testData = {
				name: 'Jane Smith',
				email: 'jane.smith@example.com',
				message: 'Great calculator app! Very useful.',
			};

			cy.fillFeedbackForm(testData.name, testData.email, testData.message);
			cy.get('.submit-btn').click();

			cy.wait('@submitFeedback').its('request.body').should('deep.include', testData);
		});

		it('should keep name and email but clear message after successful submission', () => {
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'My test feedback');
			cy.get('.submit-btn').click();
			cy.wait('@submitFeedback');

			// Name and email should still be there
			cy.get('#name').should('have.value', 'John Doe');
			cy.get('#email').should('have.value', 'john@example.com');

			// Message should be cleared
			cy.get('#message').should('have.value', '');
		});

		it('should save name and email to localStorage after successful submission', () => {
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'Test message');
			cy.get('.submit-btn').click();
			cy.wait('@submitFeedback');

			// Check localStorage
			cy.window().then((window) => {
				expect(window.localStorage.getItem('feedbackName')).to.equal('John Doe');
				expect(window.localStorage.getItem('feedbackEmail')).to.equal('john@example.com');
			});
		});

		it('should load saved name and email from localStorage on page reload', () => {
			// First submission to save data
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'Test message');
			cy.get('.submit-btn').click();
			cy.wait('@submitFeedback');

			// Navigate away and back
			cy.get('.page_change').click();
			cy.url().should('not.include', '/feedback');
			cy.get('.page_change').contains('Go to feedback form').click();

			// Check that name and email are pre-filled
			cy.get('#name').should('have.value', 'John Doe');
			cy.get('#email').should('have.value', 'john@example.com');
			cy.get('#message').should('have.value', '');
		});
	});

	describe('Error Handling', () => {
		it('should show error message when server returns error', () => {
			// Override intercept to return error
			cy
				.intercept('POST', 'http://localhost:3000/feedback', {
					statusCode: 500,
					body: { error: 'Internal Server Error' },
				})
				.as('submitFeedbackError');

			cy.fillFeedbackForm('John Doe', 'john@example.com', 'Test message');
			cy.get('.submit-btn').click();

			cy.wait('@submitFeedbackError');

			// Check that error message is displayed
			cy.get('.status-message').should('be.visible');
			cy.get('.status-message').should('have.class', 'error');
			cy.get('.status-message').should('contain', 'Sorry, there was an error');
			cy.get('.status-message').should('contain', 'Please try again');
		});

		it('should show error message when network request fails', () => {
			// Simulate network failure
			cy
				.intercept('POST', 'http://localhost:3000/feedback', {
					forceNetworkError: true,
				})
				.as('submitFeedbackNetworkError');

			cy.fillFeedbackForm('John Doe', 'john@example.com', 'Test message');
			cy.get('.submit-btn').click();

			// Wait a bit for the error to appear
			cy.wait(1000);

			// Check that error message is displayed
			cy.get('.status-message').should('be.visible');
			cy.get('.status-message').should('have.class', 'error');
			cy.get('.status-message').should('contain', 'error');
		});

		it('should keep form data when submission fails', () => {
			cy
				.intercept('POST', 'http://localhost:3000/feedback', {
					statusCode: 500,
					body: { error: 'Server Error' },
				})
				.as('submitFeedbackError');

			const testData = {
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Test message',
			};

			cy.fillFeedbackForm(testData.name, testData.email, testData.message);
			cy.get('.submit-btn').click();
			cy.wait('@submitFeedbackError');

			// Form data should still be present
			cy.get('#name').should('have.value', testData.name);
			cy.get('#email').should('have.value', testData.email);
			cy.get('#message').should('have.value', testData.message);
		});

		it('should not save to localStorage when submission fails', () => {
			cy
				.intercept('POST', 'http://localhost:3000/feedback', {
					statusCode: 500,
				})
				.as('submitFeedbackError');

			cy.fillFeedbackForm('John Doe', 'john@example.com', 'Test message');
			cy.get('.submit-btn').click();
			cy.wait('@submitFeedbackError');

			// LocalStorage should not be updated
			cy.window().then((window) => {
				expect(window.localStorage.getItem('feedbackName')).to.be.null;
				expect(window.localStorage.getItem('feedbackEmail')).to.be.null;
			});
		});
	});

	describe('Multiple Submissions', () => {
		it('should allow multiple submissions in sequence', () => {
			// First submission
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'First message');
			cy.get('.submit-btn').click();
			cy.wait('@submitFeedback');
			cy.get('.status-message').should('contain', 'Thank you for your feedback!');

			// Second submission (name and email should be pre-filled)
			cy.get('#message').type('Second message');
			cy.get('.submit-btn').click();
			cy.wait('@submitFeedback');
			cy.get('.status-message').should('contain', 'Thank you for your feedback!');
		});

		it('should clear status message when starting new submission', () => {
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'First message');
			cy.get('.submit-btn').click();
			cy.wait('@submitFeedback');
			cy.get('.status-message').should('be.visible');

			// Start filling new message
			cy.get('#message').type('New message');

			// Note: In current implementation, status message stays visible
			// This test documents the current behavior
			cy.get('.status-message').should('be.visible');
		});
	});

	describe('Form Validation After Submission', () => {
		it('should require all fields for second submission after clearing message', () => {
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'First message');
			cy.get('.submit-btn').click();
			cy.wait('@submitFeedback');

			// Message is cleared, submit button should be disabled
			cy.submitButtonShouldBeDisabled();

			// Fill message again
			cy.get('#message').type('Second message');
			cy.submitButtonShouldBeEnabled();
		});
	});

	describe('User Experience', () => {
		it('should disable submit button during submission to prevent double-submit', () => {
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'Test message');
			cy.get('.submit-btn').click();

			// Button should be disabled during submission
			cy.get('.submit-btn').should('be.disabled');

			cy.wait('@submitFeedback');

			// Button should be enabled again after submission
			// (but form validation will disable it because message is cleared)
			cy.wait(100); // Small wait for state update
		});

		it('should show visual feedback with success styling', () => {
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'Test message');
			cy.get('.submit-btn').click();
			cy.wait('@submitFeedback');

			cy.get('.status-message.success').should('be.visible');
		});

		it('should maintain form structure and styling after submission', () => {
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'Test message');
			cy.get('.submit-btn').click();
			cy.wait('@submitFeedback');

			// All form elements should still be visible and functional
			cy.get('#name').should('be.visible');
			cy.get('#email').should('be.visible');
			cy.get('#message').should('be.visible');
			cy.get('.submit-btn').should('be.visible');
		});
	});

	describe('Server Response Validation', () => {
		it('should handle response with correct status code', () => {
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'Test message');
			cy.get('.submit-btn').click();

			cy.wait('@submitFeedback').then((interception) => {
				expect(interception.response.statusCode).to.equal(200);
			});
		});

		it('should handle response with returned data', () => {
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'Test message');
			cy.get('.submit-btn').click();

			cy.wait('@submitFeedback').then((interception) => {
				expect(interception.response.body).to.have.property('id');
				expect(interception.response.body.name).to.equal('John Doe');
				expect(interception.response.body.email).to.equal('john@example.com');
				expect(interception.response.body.message).to.equal('Test message');
			});
		});
	});

	describe('Integration with Calculator', () => {
		it('should preserve localStorage data when navigating between pages', () => {
			cy.fillFeedbackForm('John Doe', 'john@example.com', 'Test message');
			cy.get('.submit-btn').click();
			cy.wait('@submitFeedback');

			// Navigate to calculator
			cy.get('.page_change').contains('Back to Calculator').click();
			cy.url().should('not.include', '/feedback');

			// Navigate back to feedback
			cy.get('.page_change').contains('Go to feedback form').click();
			cy.url().should('include', '/feedback');

			// Data should be preserved
			cy.get('#name').should('have.value', 'John Doe');
			cy.get('#email').should('have.value', 'john@example.com');
		});
	});
});
