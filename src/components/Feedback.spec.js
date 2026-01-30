import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Feedback from '@/components/Feedback.vue';

// Mock fetch globally
global.fetch = vi.fn();

describe('Feedback.vue', () => {
	let wrapper;

	beforeEach(() => {
		// Reset mocks before each test
		vi.clearAllMocks();
		localStorage.clear();

		wrapper = mount(Feedback, {
			global: {
				mocks: {
					$router: {
						push: vi.fn(),
					},
				},
			},
		});
	});

	afterEach(() => {
		wrapper.unmount();
	});

	describe('Initial State', () => {
		it('should render feedback form with empty fields', () => {
			expect(wrapper.find('#name').element.value).toBe('');
			expect(wrapper.find('#email').element.value).toBe('');
			expect(wrapper.find('#message').element.value).toBe('');
		});

		it('should have submit button disabled initially', () => {
			const submitButton = wrapper.find('.submit-btn');
			expect(submitButton.element.disabled).toBe(true);
		});

		it('should not display status message initially', () => {
			expect(wrapper.vm.statusMessage).toBe('');
			expect(wrapper.find('.status-message').exists()).toBe(false);
		});

		it('should have no errors initially', () => {
			expect(wrapper.vm.errors.name).toBe('');
			expect(wrapper.vm.errors.email).toBe('');
			expect(wrapper.vm.errors.message).toBe('');
		});
	});

	describe('Form Validation - Name Field', () => {
		it('should show error when name is empty on blur', async () => {
			const nameInput = wrapper.find('#name');
			await nameInput.trigger('blur');
			expect(wrapper.vm.errors.name).toBe('Name cannot be empty');
			expect(wrapper.find('.error-text').text()).toBe('Name cannot be empty');
		});

		it('should clear error when valid name is entered', async () => {
			await wrapper.vm.$nextTick();
			await wrapper.setData({ feedback: { name: '', email: '', message: '' } });
			await wrapper.find('#name').trigger('blur');
			expect(wrapper.vm.errors.name).toBe('Name cannot be empty');

			await wrapper.setData({ feedback: { name: 'John Doe', email: '', message: '' } });
			await wrapper.find('#name').trigger('blur');
			expect(wrapper.vm.errors.name).toBe('');
		});

		it('should not allow whitespace-only names', async () => {
			await wrapper.setData({ feedback: { name: '   ', email: '', message: '' } });
			await wrapper.find('#name').trigger('blur');
			expect(wrapper.vm.errors.name).toBe('Name cannot be empty');
		});
	});

	describe('Form Validation - Email Field', () => {
		it('should show error when email is empty on blur', async () => {
			const emailInput = wrapper.find('#email');
			await emailInput.trigger('blur');
			expect(wrapper.vm.errors.email).toBe('Email cannot be empty');
		});

		it('should show error for invalid email format', async () => {
			await wrapper.setData({ feedback: { name: '', email: 'invalid-email', message: '' } });
			await wrapper.find('#email').trigger('blur');
			expect(wrapper.vm.errors.email).toBe('Please enter a valid email address');
		});

		it('should accept valid email format', async () => {
			await wrapper.setData({ feedback: { name: '', email: 'test@example.com', message: '' } });
			await wrapper.find('#email').trigger('blur');
			expect(wrapper.vm.errors.email).toBe('');
		});

		it('should validate various email formats', async () => {
			const validEmails = ['user@example.com', 'user.name@example.com', 'user+tag@example.co.uk'];

			for (const email of validEmails) {
				await wrapper.setData({ feedback: { name: '', email, message: '' } });
				expect(wrapper.vm.isValidEmail(email)).toBe(true);
			}
		});

		it('should reject invalid email formats', async () => {
			const invalidEmails = [
				'invalid',
				'invalid@',
				'@example.com',
				'invalid@.com',
				'invalid..email@example.com',
			];

			for (const email of invalidEmails) {
				await wrapper.setData({ feedback: { name: '', email, message: '' } });
				expect(wrapper.vm.isValidEmail(email)).toBe(false);
			}
		});
	});

	describe('Form Validation - Message Field', () => {
		it('should show error when message is empty on blur', async () => {
			const messageInput = wrapper.find('#message');
			await messageInput.trigger('blur');
			expect(wrapper.vm.errors.message).toBe('Message cannot be empty');
		});

		it('should clear error when valid message is entered', async () => {
			await wrapper.setData({ feedback: { name: '', email: '', message: '' } });
			await wrapper.find('#message').trigger('blur');
			expect(wrapper.vm.errors.message).toBe('Message cannot be empty');

			await wrapper.setData({ feedback: { name: '', email: '', message: 'This is a message' } });
			await wrapper.find('#message').trigger('blur');
			expect(wrapper.vm.errors.message).toBe('');
		});

		it('should not allow whitespace-only messages', async () => {
			await wrapper.setData({ feedback: { name: '', email: '', message: '   ' } });
			await wrapper.find('#message').trigger('blur');
			expect(wrapper.vm.errors.message).toBe('Message cannot be empty');
		});
	});

	describe('Form Validity Computed Property', () => {
		it('should be invalid when form is empty', () => {
			expect(wrapper.vm.isFormValid).toBe(false);
		});

		it('should be invalid when only name is filled', async () => {
			await wrapper.setData({ feedback: { name: 'John Doe', email: '', message: '' } });
			expect(wrapper.vm.isFormValid).toBe(false);
		});

		it('should be invalid when email format is wrong', async () => {
			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'invalid-email', message: 'Test message' },
			});
			expect(wrapper.vm.isFormValid).toBe(false);
		});

		it('should be valid when all fields are correctly filled', async () => {
			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
			});
			expect(wrapper.vm.isFormValid).toBe(true);
		});

		it('should be invalid if any field has errors', async () => {
			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
				errors: { name: 'Some error', email: '', message: '' },
			});
			expect(wrapper.vm.isFormValid).toBe(false);
		});
	});

	describe('Submit Button State', () => {
		it('should enable submit button when form is valid', async () => {
			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
			});
			await wrapper.vm.$nextTick();

			const submitButton = wrapper.find('.submit-btn');
			expect(submitButton.element.disabled).toBe(false);
		});

		it('should disable submit button when form is invalid', async () => {
			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'invalid', message: 'Test message' },
			});
			await wrapper.vm.$nextTick();

			const submitButton = wrapper.find('.submit-btn');
			expect(submitButton.element.disabled).toBe(true);
		});

		it('should disable submit button during submission', async () => {
			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
				isSubmitting: true,
			});
			await wrapper.vm.$nextTick();

			const submitButton = wrapper.find('.submit-btn');
			expect(submitButton.element.disabled).toBe(true);
		});

		it('should show "Sending..." text during submission', async () => {
			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
				isSubmitting: true,
			});
			await wrapper.vm.$nextTick();

			const submitButton = wrapper.find('.submit-btn');
			expect(submitButton.text()).toBe('Sending...');
		});
	});

	describe('Form Submission - Success', () => {
		it('should submit form with valid data', async () => {
			global.fetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: 1 }),
			});

			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
			});

			await wrapper.vm.submitFeedback();
			await flushPromises();

			expect(global.fetch).toHaveBeenCalledWith(
				'http://localhost:3000/feedback',
				expect.objectContaining({
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: 'John Doe',
						email: 'john@example.com',
						message: 'Test message',
					}),
				})
			);
		});

		it('should show success message after successful submission', async () => {
			global.fetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: 1 }),
			});

			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
			});

			await wrapper.vm.submitFeedback();
			await flushPromises();

			expect(wrapper.vm.statusMessage).toBe(
				'Thank you for your feedback! We have received your message.'
			);
			expect(wrapper.vm.statusType).toBe('success');
		});

		it('should save name and email to localStorage on success', async () => {
			global.fetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: 1 }),
			});

			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
			});

			await wrapper.vm.submitFeedback();
			await flushPromises();

			expect(localStorage.setItem).toHaveBeenCalledWith('feedbackName', 'John Doe');
			expect(localStorage.setItem).toHaveBeenCalledWith('feedbackEmail', 'john@example.com');
		});

		it('should clear only message field after successful submission', async () => {
			global.fetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: 1 }),
			});

			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
			});

			await wrapper.vm.submitFeedback();
			await flushPromises();

			expect(wrapper.vm.feedback.name).toBe('John Doe');
			expect(wrapper.vm.feedback.email).toBe('john@example.com');
			expect(wrapper.vm.feedback.message).toBe('');
		});

		it('should reset isSubmitting flag after submission', async () => {
			global.fetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: 1 }),
			});

			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
			});

			await wrapper.vm.submitFeedback();
			expect(wrapper.vm.isSubmitting).toBe(true);

			await flushPromises();
			expect(wrapper.vm.isSubmitting).toBe(false);
		});
	});

	describe('Form Submission - Error Handling', () => {
		it('should show error message when submission fails', async () => {
			global.fetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
			});

			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
			});

			await wrapper.vm.submitFeedback();
			await flushPromises();

			expect(wrapper.vm.statusMessage).toBe(
				'Sorry, there was an error submitting your feedback. Please try again.'
			);
			expect(wrapper.vm.statusType).toBe('error');
		});

		it('should handle network errors', async () => {
			global.fetch.mockRejectedValueOnce(new Error('Network error'));

			await wrapper.setData({
				feedback: { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
			});

			await wrapper.vm.submitFeedback();
			await flushPromises();

			expect(wrapper.vm.statusMessage).toBe(
				'Sorry, there was an error submitting your feedback. Please try again.'
			);
			expect(wrapper.vm.statusType).toBe('error');
		});

		it('should not submit if form is invalid', async () => {
			await wrapper.setData({
				feedback: { name: '', email: 'john@example.com', message: 'Test message' },
			});

			await wrapper.vm.submitFeedback();

			expect(global.fetch).not.toHaveBeenCalled();
		});
	});

	describe('LocalStorage Integration', () => {
		it('should load saved name from localStorage on mount', () => {
			localStorage.getItem.mockImplementation((key) => {
				if (key === 'feedbackName') return 'Saved Name';
				return null;
			});

			const newWrapper = mount(Feedback, {
				global: {
					mocks: {
						$router: { push: vi.fn() },
					},
				},
			});

			expect(newWrapper.vm.feedback.name).toBe('Saved Name');
			newWrapper.unmount();
		});

		it('should load saved email from localStorage on mount', () => {
			localStorage.getItem.mockImplementation((key) => {
				if (key === 'feedbackEmail') return 'saved@example.com';
				return null;
			});

			const newWrapper = mount(Feedback, {
				global: {
					mocks: {
						$router: { push: vi.fn() },
					},
				},
			});

			expect(newWrapper.vm.feedback.email).toBe('saved@example.com');
			newWrapper.unmount();
		});

		it('should handle missing localStorage data gracefully', () => {
			localStorage.getItem.mockReturnValue(null);

			const newWrapper = mount(Feedback, {
				global: {
					mocks: {
						$router: { push: vi.fn() },
					},
				},
			});

			expect(newWrapper.vm.feedback.name).toBe('');
			expect(newWrapper.vm.feedback.email).toBe('');
			newWrapper.unmount();
		});
	});

	describe('Navigation', () => {
		it('should navigate to calculator when back button is clicked', async () => {
			const pushSpy = wrapper.vm.$router.push;
			await wrapper.find('.page_change').trigger('click');
			expect(pushSpy).toHaveBeenCalledWith('/');
		});
	});

	describe('CSS Classes', () => {
		it('should apply error class to invalid name input', async () => {
			await wrapper.setData({
				feedback: { name: '', email: '', message: '' },
				errors: { name: 'Name cannot be empty', email: '', message: '' },
			});
			await wrapper.vm.$nextTick();

			const nameInput = wrapper.find('#name');
			expect(nameInput.classes()).toContain('error');
		});

		it('should apply error class to invalid email input', async () => {
			await wrapper.setData({
				feedback: { name: '', email: '', message: '' },
				errors: { name: '', email: 'Email cannot be empty', message: '' },
			});
			await wrapper.vm.$nextTick();

			const emailInput = wrapper.find('#email');
			expect(emailInput.classes()).toContain('error');
		});

		it('should show success status message with correct class', async () => {
			await wrapper.setData({
				statusMessage: 'Success!',
				statusType: 'success',
			});
			await wrapper.vm.$nextTick();

			const statusDiv = wrapper.find('.status-message');
			expect(statusDiv.exists()).toBe(true);
			expect(statusDiv.classes()).toContain('success');
		});

		it('should show error status message with correct class', async () => {
			await wrapper.setData({
				statusMessage: 'Error!',
				statusType: 'error',
			});
			await wrapper.vm.$nextTick();

			const statusDiv = wrapper.find('.status-message');
			expect(statusDiv.exists()).toBe(true);
			expect(statusDiv.classes()).toContain('error');
		});
	});

	describe('UI Rendering', () => {
		it('should render all form fields', () => {
			expect(wrapper.find('#name').exists()).toBe(true);
			expect(wrapper.find('#email').exists()).toBe(true);
			expect(wrapper.find('#message').exists()).toBe(true);
		});

		it('should render labels for all fields', () => {
			expect(wrapper.find('label[for="name"]').exists()).toBe(true);
			expect(wrapper.find('label[for="email"]').exists()).toBe(true);
			expect(wrapper.find('label[for="message"]').exists()).toBe(true);
		});

		it('should render submit button', () => {
			expect(wrapper.find('.submit-btn').exists()).toBe(true);
		});

		it('should render back button', () => {
			expect(wrapper.find('.page_change').exists()).toBe(true);
			expect(wrapper.find('.page_change').text()).toBe('Back to Calculator');
		});
	});
});
