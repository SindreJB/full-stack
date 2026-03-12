<template>
	<div id="app">
		<div>
			<h2>Feedback Form</h2>
			<div class="page_change_container">
				<button class="page_change" @click="goToCalculator">Back to Calculator</button>
			</div>

			<!-- Status message -->
			<div v-if="statusMessage" :class="['status-message', statusType]">
				{{ statusMessage }}
			</div>

			<div class="feedback-form">
				<form @submit.prevent="submitFeedback">
					<div class="form-group">
						<label for="name">Name:</label>
						<input
							type="text"
							id="name"
							v-model="feedback.name"
							@blur="validateName"
							:class="{ error: errors.name }"
						/>
						<span v-if="errors.name" class="error-text">{{ errors.name }}</span>
					</div>
					<div class="form-group">
						<label for="email">Email:</label>
						<input
							type="email"
							id="email"
							v-model="feedback.email"
							@blur="validateEmail"
							:class="{ error: errors.email }"
						/>
						<span v-if="errors.email" class="error-text">{{ errors.email }}</span>
					</div>
					<div class="form-group">
						<label for="message">Feedback:</label>
						<textarea
							id="message"
							v-model="feedback.message"
							rows="5"
							@blur="validateMessage"
							:class="{ error: errors.message }"
						></textarea>
						<span v-if="errors.message" class="error-text">{{ errors.message }}</span>
					</div>
					<button type="submit" class="submit-btn" :disabled="!isFormValid || isSubmitting">
						{{ isSubmitting ? 'Sending...' : 'Submit Feedback' }}
					</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'FeedbackForm',
	data() {
		return {
			feedback: {
				name: '',
				email: '',
				message: '',
			},
			errors: {
				name: '',
				email: '',
				message: '',
			},
			statusMessage: '',
			statusType: '', // 'success' or 'error'
			isSubmitting: false,
		};
	},
	computed: {
		isFormValid() {
			return (
				this.feedback.name.trim() !== '' &&
				this.feedback.email.trim() !== '' &&
				this.isValidEmail(this.feedback.email) &&
				this.feedback.message.trim() !== '' &&
				!this.errors.name &&
				!this.errors.email &&
				!this.errors.message
			);
		},
	},
	mounted() {
		// Load saved name and email from localStorage
		const savedName = localStorage.getItem('feedbackName');
		const savedEmail = localStorage.getItem('feedbackEmail');

		if (savedName) {
			this.feedback.name = savedName;
		}
		if (savedEmail) {
			this.feedback.email = savedEmail;
		}
	},
	methods: {
		validateName() {
			if (this.feedback.name.trim() === '') {
				this.errors.name = 'Name cannot be empty';
			} else {
				this.errors.name = '';
			}
		},
		validateEmail() {
			if (this.feedback.email.trim() === '') {
				this.errors.email = 'Email cannot be empty';
			} else if (!this.isValidEmail(this.feedback.email)) {
				this.errors.email = 'Please enter a valid email address';
			} else {
				this.errors.email = '';
			}
		},
		validateMessage() {
			if (this.feedback.message.trim() === '') {
				this.errors.message = 'Message cannot be empty';
			} else {
				this.errors.message = '';
			}
		},
		isValidEmail(email) {
			const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
			// Check for consecutive dots
			if (/\.\./.test(email)) {
				return false;
			}
			// Check for dot immediately after @
			if (/@\./.test(email)) {
				return false;
			}
			return emailRegex.test(email);
		},
		async submitFeedback() {
			// Validate all fields
			this.validateName();
			this.validateEmail();
			this.validateMessage();

			if (!this.isFormValid) {
				return;
			}

			this.isSubmitting = true;
			this.statusMessage = '';

			// Wait for DOM to update with isSubmitting state
			await this.$nextTick();

			// Perform async submission in background
			this.performSubmission();
		},
		async performSubmission() {
			try {
				// Send to json-server backend
				const response = await fetch('http://localhost:3000/feedback', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(this.feedback),
				});

				if (response.ok) {
					this.statusMessage = 'Thank you for your feedback! We have received your message.';
					this.statusType = 'success';

					// Save name and email to localStorage
					localStorage.setItem('feedbackName', this.feedback.name);
					localStorage.setItem('feedbackEmail', this.feedback.email);

					// Reset only the message field
					this.feedback.message = '';
				} else {
					throw new Error('Failed to submit feedback');
				}
			} catch (error) {
				this.statusMessage = 'Sorry, there was an error submitting your feedback. Please try again.';
				this.statusType = 'error';
				console.error('Error submitting feedback:', error);
			} finally {
				this.isSubmitting = false;
			}
		},
		goToCalculator() {
			this.$router.push('/');
		},
	},
};
</script>

<style scoped>
#app {
	font-family: Arial, sans-serif;
	text-align: center;
	background-color: hsl(0, 0%, 100%);
	color: black;
	min-height: 80vh;
	justify-content: center;
	align-items: center;
	display: grid;
	padding: 20px;
}

.feedback-form {
	max-width: 500px;
	margin: 20px auto;
	padding: 20px;
	background: #f5f5f5;
	border-radius: 8px;
}

.form-group {
	margin-bottom: 20px;
	text-align: center;
	align-items: center;
}

.form-group label {
	display: block;
	margin-bottom: 5px;
	font-weight: bold;
	justify-content: center;
}

.form-group input,
.form-group textarea {
	width: 400px;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
	font-size: 14px;
	justify-content: center;
}

.form-group input.error,
.form-group textarea.error {
	border-color: #f44336;
}

.error-text {
	display: block;
	color: #f44336;
	font-size: 12px;
	margin-top: 5px;
}

.status-message {
	padding: 15px;
	margin: 20px auto;
	max-width: 500px;
	border-radius: 4px;
	font-weight: bold;
}

.status-message.success {
	background-color: #d4edda;
	color: #155724;
	border: 1px solid #c3e6cb;
}

.status-message.error {
	background-color: #f8d7da;
	color: #721c24;
	border: 1px solid #f5c6cb;
}

.submit-btn {
	background-color: #4caf50;
	color: white;
	padding: 10px 20px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 16px;
	transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
	background-color: #45a049;
}

.submit-btn:disabled {
	background-color: #cccccc;
	cursor: not-allowed;
	opacity: 0.6;
}

.page_change_container {
	margin: 20px 0;
}

.page_change {
	padding: 10px 20px;
	background-color: #2196f3;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
}

.page_change:hover {
	background-color: #0b7dda;
}
</style>