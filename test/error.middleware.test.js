const assert = require('node:assert/strict');
const { test } = require('node:test');
const errorMiddleware = require('../src/middlewares/error.middleware');
const HttpError = require('../src/utils/http-error');

const createContext = () => ({
  state: {},
  headers: {},
  method: 'GET',
  path: '/test',
  set(name, value) { this.headers[name] = value; },
});

test('known HTTP errors retain their status and include a request ID', async () => {
  const ctx = createContext();

  await errorMiddleware(ctx, async () => {
    throw new HttpError(403, 'Insufficient permissions', { code: 'FORBIDDEN' });
  });

  assert.equal(ctx.status, 403);
  assert.equal(ctx.body.code, 'FORBIDDEN');
  assert.equal(ctx.headers['X-Request-Id'], ctx.body.requestId);
});

test('internal error details are not sent in the response', async () => {
  const ctx = createContext();
  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    await errorMiddleware(ctx, async () => {
      throw new Error('private database connection detail');
    });
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(ctx.status, 500);
  assert.equal(ctx.body.error, 'Internal server error');
  assert.equal(JSON.stringify(ctx.body).includes('private database'), false);
});
