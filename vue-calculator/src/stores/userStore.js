import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
	state: () => ({
		/** @type {string|null} */
		JWTtoken: sessionStorage.getItem('jwt_token') || null,
		/** @type {import('../models/interfaces').User|null} */
		loggedInUser: null,
	}),
	actions: {
		/**
		 * Persist auth state after a successful login.
		 * @param {string} token
		 * @param {import('../models/interfaces').User} user
		 */
		setAuth(token, user) {
			this.JWTtoken = token;
			this.loggedInUser = user;
		},
		/**
		 * Clear auth state on logout.
		 */
		clearAuth() {
			this.JWTtoken = null;
			this.loggedInUser = null;
		},
	},
});
