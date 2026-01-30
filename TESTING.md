# Testing Guide for Vue Calculator

This document provides comprehensive instructions for running unit tests and end-to-end tests for the Vue Calculator application.

## Prerequisites

Before running tests, make sure you have all dependencies installed:

```bash
npm install
```

## Required Development Dependencies

You need to install the following development dependencies:

### For Unit Testing (Vitest)

```bash
npm install --save-dev vitest @vitejs/plugin-vue @vue/test-utils jsdom happy-dom
```

### For E2E Testing (Cypress)

```bash
npm install --save-dev cypress start-server-and-test
```

## Unit Tests with Vitest

Unit tests are written using Vitest and Vue Test Utils. They test individual components in isolation.

### Test Files

- `src/components/Calculator.spec.js` - Tests for Calculator component
- `src/components/Feedback.spec.js` - Tests for Feedback form component

### Running Unit Tests

Run all unit tests:

```bash
npm test
```

Run tests in watch mode (automatically re-run on file changes):

```bash
npm run test -- --watch
```

Run tests with UI interface:

```bash
npm run test:ui
```

Run tests with coverage report:

```bash
npm run test:coverage
```

### Calculator Component Tests

The Calculator tests cover:

- ✅ Number input and concatenation
- ✅ Operator handling (+, -, \*, /)
- ✅ Mathematical calculations
- ✅ Clear (C) and Clear Entry (CE) functions
- ✅ Calculation log functionality
- ✅ Error handling (division by zero, invalid expressions)
- ✅ Decimal number support
- ✅ Complex expressions
- ✅ UI rendering

### Feedback Form Component Tests

The Feedback form tests cover:

- ✅ Form validation (name, email, message)
- ✅ Email format validation
- ✅ Empty field validation
- ✅ Computed property `isFormValid`
- ✅ Submit button state (enabled/disabled)
- ✅ Form submission (success and error cases)
- ✅ LocalStorage integration (save/load name and email)
- ✅ Error handling for network failures
- ✅ Status messages display
- ✅ CSS error classes
- ✅ Navigation between pages

## End-to-End Tests with Cypress

E2E tests simulate real user interactions with the application running in a browser.

### Test Files

- `cypress/e2e/feedback-validation.cy.js` - Form validation scenarios
- `cypress/e2e/feedback-submission.cy.js` - Successful submission scenarios

### Running E2E Tests

**Important**: Before running E2E tests, you need to start both the Vue development server and the JSON server.

#### Option 1: Manual Setup (Recommended for Development)

Terminal 1 - Start Vue development server:

```bash
npm run serve
```

Terminal 2 - Start JSON server:

```bash
npm run json-server
```

Terminal 3 - Run Cypress tests:

```bash
npm run cypress:open    # Opens Cypress UI
# OR
npm run cypress:run     # Runs tests headlessly
```

#### Option 2: Automated Setup (For CI/CD)

This command automatically starts the server and runs tests:

```bash
npm run test:e2e        # Runs tests headlessly
# OR
npm run test:e2e:open   # Opens Cypress UI
```

Note: You'll still need to start the JSON server manually in a separate terminal for E2E tests to work properly.

### Feedback Validation Scenario Tests

Tests the requirement: "Submit button shall be disabled when form content is invalid"

Coverage:

- ✅ Initial state - submit button disabled with empty form
- ✅ Name field validation
  - Empty name shows error
  - Whitespace-only name shows error
  - Valid name clears error
- ✅ Email field validation
  - Empty email shows error
  - Invalid format shows error (missing @, domain, etc.)
  - Valid email format clears error
- ✅ Message field validation
  - Empty message shows error
  - Whitespace-only message shows error
  - Valid message clears error
- ✅ Submit button state
  - Disabled with partial form data
  - Enabled only when all fields valid
  - Disabled when valid field becomes invalid
- ✅ Error class application to invalid fields
- ✅ Multiple validation errors displayed simultaneously
- ✅ Accessibility (labels, input types)

### Feedback Submission Scenario Tests

Tests the requirement: "Contact form shows correct response from server when form contains valid data and Submit button is clicked"

Coverage:

- ✅ Successful form submission
  - Success message displayed
  - Correct data sent to server
  - Button shows "Sending..." during submission
  - Name and email preserved, message cleared
  - Data saved to localStorage
- ✅ Data persistence
  - Saved data loaded on page reload
  - Data persists across navigation
- ✅ Error handling
  - Server error (500) shows error message
  - Network failure shows error message
  - Form data preserved on failure
  - No localStorage update on failure
- ✅ Multiple submissions
  - Sequential submissions work correctly
  - Pre-filled data from previous submission
- ✅ User experience
  - Double-submit prevention
  - Visual feedback with success styling
  - Form remains functional after submission
- ✅ Server response validation
  - Correct status code (200)
  - Response contains submitted data

## Test Configuration Files

- `vitest.config.js` - Vitest configuration
- `vitest.setup.js` - Test setup (localStorage mock)
- `cypress.config.js` - Cypress configuration
- `cypress/support/commands.js` - Custom Cypress commands
- `cypress/support/e2e.js` - Cypress support file

## Custom Cypress Commands

The following custom commands are available in E2E tests:

```javascript
// Fill feedback form
cy.fillFeedbackForm(name, email, message);

// Check submit button state
cy.submitButtonShouldBeDisabled();
cy.submitButtonShouldBeEnabled();
```

## Running All Tests

To run both unit and E2E tests:

```bash
# Terminal 1: Start dev server
npm run serve

# Terminal 2: Start JSON server
npm run json-server

# Terminal 3: Run unit tests
npm test

# Terminal 4: Run E2E tests
npm run cypress:run
```

## Continuous Integration

For CI/CD pipelines, use:

```bash
# Run unit tests
npm test -- --run

# Run E2E tests (requires servers to be running)
npm run test:e2e
```

## Troubleshooting

### Vitest Issues

**Problem**: Tests fail with "Cannot find module '@/components/...'"
**Solution**: Make sure `vitest.config.js` has the correct path alias configuration.

**Problem**: localStorage is undefined
**Solution**: Ensure `vitest.setup.js` is properly configured in `vitest.config.js`.

### Cypress Issues

**Problem**: "ECONNREFUSED" errors
**Solution**: Make sure the dev server is running on `http://localhost:8080`.

**Problem**: API calls fail
**Solution**: Ensure JSON server is running on `http://localhost:3000`.

**Problem**: Tests timeout
**Solution**: Increase timeout in `cypress.config.js` or check if servers are responsive.

## Coverage Reports

Generate coverage reports for unit tests:

```bash
npm run test:coverage
```

Coverage reports will be generated in the `coverage/` directory. Open `coverage/index.html` in a browser to view detailed coverage information.

## Best Practices

1. **Run unit tests frequently** during development with watch mode
2. **Run E2E tests** before committing major changes
3. **Keep tests updated** when modifying component behavior
4. **Write descriptive test names** that explain what is being tested
5. **Use custom Cypress commands** to reduce code duplication
6. **Mock external dependencies** in unit tests
7. **Use real servers** in E2E tests for accurate validation

## Test Statistics

### Unit Tests

- Calculator component: 50+ test cases
- Feedback component: 70+ test cases
- Total unit tests: 120+ test cases

### E2E Tests

- Validation scenario: 30+ test cases
- Submission scenario: 40+ test cases
- Total E2E tests: 70+ test cases

## Support

For issues or questions about testing:

1. Check this documentation
2. Review test files for examples
3. Consult Vitest documentation: https://vitest.dev/
4. Consult Cypress documentation: https://docs.cypress.io/
