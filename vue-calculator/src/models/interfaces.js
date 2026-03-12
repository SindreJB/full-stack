/**
 * @typedef {Object} User
 * @property {number|string} id
 * @property {string} username
 * @property {string} email
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {User} user
 */

/**
 * @typedef {Object} JWTPayload
 * @property {string} sub   - Subject (user id)
 * @property {number} iat   - Issued at (Unix timestamp)
 * @property {number} exp   - Expiry (Unix timestamp)
 */
