const assert = require('node:assert/strict');
const { test } = require('node:test');
const createRateLimiter = require('../src/middlewares/rate-limit.middleware');

test('rate limiter rejects requests after the configured window budget', async () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 2 });
  const ctx = { ip: '192.0.2.10', headers: {}, set(name, value) { this.headers[name] = value; } };
  let continued = 0;
  const next = async () => { continued += 1; };

  await limiter(ctx, next);
  await limiter(ctx, next);
  await assert.rejects(limiter(ctx, next), (error) => error.status === 429);

  assert.equal(continued, 2);
  assert.equal(ctx.headers['Retry-After'], '60');
});
