<template>
	<div id="login">
		<h2>{{ isRegisterMode ? 'Register' : 'Login' }}</h2>
		<div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
		<div v-if="successMessage" class="success-message">{{ successMessage }}</div>
		<form class="login-form" @submit.prevent="isRegisterMode ? handleRegister() : handleLogin()">
			<div class="form-group">
				<label for="username">Username:</label>
				<input id="username" v-model="username" type="text" autocomplete="username" required />
			</div>
			<div class="form-group">
				<label for="password">Password:</label>
				<input id="password" v-model="password" type="password" autocomplete="current-password" required />
			</div>
			<button type="submit" class="login-btn" :disabled="isLoading">
				{{ isLoading ? (isRegisterMode ? 'Registering...' : 'Logging in...') : (isRegisterMode ? 'Register' : 'Login') }}
			</button>
		</form>
		<p class="toggle-text">
			{{ isRegisterMode ? 'Already have an account?' : "Don't have an account?" }}
			<button class="toggle-btn" type="button" @click="toggleMode">
				{{ isRegisterMode ? 'Login' : 'Register' }}
			</button>
		</p>
	</div>
</template>

<script>
import authService from '../utils/authService';
import { useUserStore } from '../stores/userStore';

export default {
	name: 'LoginView',
	data() {
		return {
			username: '',
			password: '',
			errorMessage: '',
			successMessage: '',
			isLoading: false,
			isRegisterMode: false,
		};
	},
	methods: {
		toggleMode() {
			this.isRegisterMode = !this.isRegisterMode;
			this.errorMessage = '';
			this.successMessage = '';
		},
		async handleLogin() {
			this.errorMessage = '';
			this.isLoading = true;
			try {
				const { token, user } = await authService.login({
					username: this.username,
					password: this.password,
				});
				const userStore = useUserStore();
				userStore.setAuth(token, user);
				this.$router.push('/');
			} catch (error) {
				const serverError = error?.response?.data?.message;
				this.errorMessage = serverError || 'Invalid username or password.';
			} finally {
				this.isLoading = false;
			}
		},
		async handleRegister() {
			this.errorMessage = '';
			this.successMessage = '';
			this.isLoading = true;
			try {
				await authService.register({
					username: this.username,
					password: this.password,
				});
				this.successMessage = 'Account created! You can now log in.';
				this.isRegisterMode = false;
				this.password = '';
			} catch (error) {
				const serverError = error?.response?.data?.message;
				this.errorMessage = serverError || 'Registration failed. Please try again.';
			} finally {
				this.isLoading = false;
			}
		},
	},
};
</script>

<style scoped>
#login {
	font-family: Arial, sans-serif;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 80vh;
}

.login-form {
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 320px;
	padding: 30px;
	background: #f5f5f5;
	border-radius: 8px;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.form-group label {
	font-weight: bold;
}

.form-group input {
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
	font-size: 14px;
}

.login-btn {
	padding: 10px;
	background-color: #2196f3;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 16px;
	font-weight: bold;
}

.login-btn:hover:not(:disabled) {
	background-color: #0b7dda;
}

.login-btn:disabled {
	background-color: #cccccc;
	cursor: not-allowed;
}

.error-message {
	margin-bottom: 16px;
	padding: 12px 20px;
	background-color: #f8d7da;
	color: #721c24;
	border: 1px solid #f5c6cb;
	border-radius: 4px;
	max-width: 320px;
	text-align: center;
}

.success-message {
	margin-bottom: 16px;
	padding: 12px 20px;
	background-color: #d4edda;
	color: #155724;
	border: 1px solid #c3e6cb;
	border-radius: 4px;
	max-width: 320px;
	text-align: center;
}

.toggle-text {
	margin-top: 16px;
	font-size: 14px;
	color: #555;
}

.toggle-btn {
	background: none;
	border: none;
	color: #2196f3;
	cursor: pointer;
	font-size: 14px;
	font-weight: bold;
	padding: 0;
	text-decoration: underline;
}

.toggle-btn:hover {
	color: #0b7dda;
}
</style>
