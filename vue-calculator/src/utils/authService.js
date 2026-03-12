import axios from 'axios';

const TOKEN_KEY = 'jwt_token';
const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8081';

/**
 * Decode the JWT payload without verifying the signature.
 * @param {string} token
 * @returns {import('../models/interfaces').JWTPayload|null}
 */
function decodePayload(token) {
	try {
		// JWT uses Base64url (RFC 4648 §5) without padding; restore standard Base64 padding before atob()
		const base64url = token.split('.')[1];
		const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
		const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
		return JSON.parse(atob(padded));
	} catch {
		return null;
	}
}

/**
 * Check whether the stored JWT token is expired.
 * @returns {boolean}
 */
function isTokenExpired() {
	const token = getToken();
	if (!token) return true;
	const payload = decodePayload(token);
	if (!payload?.exp) return true;
	// exp is in seconds; Date.now() is in milliseconds
	return payload.exp * 1000 < Date.now();
}

/**
 * Log in with username and password.
 * @param {import('../models/interfaces').LoginRequest} credentials
 * @returns {Promise<import('../models/interfaces').LoginResponse>}
 */
async function login(credentials) {
	const response = await axios.post(`${apiBaseUrl}/api/auth/login`, credentials);
	const { token } = response.data;
	sessionStorage.setItem(TOKEN_KEY, token);
	return { token, user: null };
}

/**
 * Remove the stored JWT and clear session.
 */
function logout() {
	sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * Retrieve the stored JWT token.
 * @returns {string|null}
 */
function getToken() {
	return sessionStorage.getItem(TOKEN_KEY);
}

/**
 * Check whether a valid (non-expired) JWT token is currently stored.
 * @returns {boolean}
 */
function isAuthenticated() {
	return getToken() !== null && !isTokenExpired();
}

/**
 * Register Axios interceptors:
 * - Request: attach Authorization header
 * - Response: on 401, clear session and redirect to /login
 * @param {import('vue-router').Router} router
 */
function setupAxiosInterceptors(router) {
	axios.interceptors.request.use((config) => {
		const token = getToken();
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	});

	axios.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response?.status === 401) {
				logout();
				router.push({ name: 'Login' });
			}
			return Promise.reject(error);
		},
	);
}

/**
 * Register a new user.
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<void>}
 */
async function register(credentials) {
	await axios.post(`${apiBaseUrl}/api/auth/register`, credentials);
}

export default { login, logout, getToken, isAuthenticated, isTokenExpired, setupAxiosInterceptors, register };

