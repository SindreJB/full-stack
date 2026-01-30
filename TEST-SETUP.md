# Quick Start - Installing Test Dependencies

Run this command to install all testing dependencies at once:

```bash
npm install --save-dev vitest @vitejs/plugin-vue @vue/test-utils jsdom happy-dom cypress start-server-and-test
```

Or install them separately:

## Vitest and Vue Testing Dependencies

```bash
npm install --save-dev vitest @vitejs/plugin-vue @vue/test-utils jsdom happy-dom
```

## Cypress and E2E Testing Dependencies

```bash
npm install --save-dev cypress start-server-and-test
```

## Verify Installation

Check that all dependencies are installed:

```bash
npm list vitest @vitejs/plugin-vue @vue/test-utils jsdom happy-dom cypress start-server-and-test
```

## Next Steps

1. Read [TESTING.md](./TESTING.md) for comprehensive testing guide
2. Run unit tests: `npm test`
3. Run E2E tests:
   - Start servers: `npm run serve` and `npm run json-server`
   - Open Cypress: `npm run cypress:open`
