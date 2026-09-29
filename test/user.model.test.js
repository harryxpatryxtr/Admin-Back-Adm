const assert = require('node:assert/strict');
const { test } = require('node:test');
const User = require('../src/models/User.model');

test('user serialization never exposes password or refresh-token hash', () => {
  const user = new User({
    id: 'user-id',
    user: 'test-user',
    email: 'test@example.com',
    password: 'a-long-password-hash-value',
    refreshTokenHash: 'private-refresh-hash',
  });

  const serialized = user.toJSON();
  const publicRecord = user.toPublicJSON();

  assert.equal(Object.hasOwn(serialized, 'password'), false);
  assert.equal(Object.hasOwn(serialized, 'refreshTokenHash'), false);
  assert.equal(Object.hasOwn(publicRecord, 'password'), false);
  assert.equal(Object.hasOwn(publicRecord, 'refreshTokenHash'), false);
});
