const assert = require('node:assert/strict');
const { test } = require('node:test');
const { validateConfig } = require('../src/config/environment');

test('startup configuration rejects missing and weak credentials', () => {
  const names = ['MONGODB_URI', 'JWT_SECRET', 'PORT', 'NODE_ENV', 'JWT_EXPIRE', 'JWT_REFRESH_EXPIRE', 'CORS_ORIGINS'];
  const original = Object.fromEntries(names.map((name) => [name, process.env[name]]));

  try {
    for (const name of names) delete process.env[name];
    assert.throws(() => validateConfig(), /MONGODB_URI/);

    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/test';
    process.env.JWT_SECRET = 'too-short';
    assert.throws(() => validateConfig(), /JWT_SECRET/);

    process.env.JWT_SECRET = 'this-test-secret-is-at-least-32-bytes-long';
    assert.equal(validateConfig().PORT, 3001);
  } finally {
    for (const [name, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});
