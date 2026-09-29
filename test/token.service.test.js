const assert = require('node:assert/strict');
const { test } = require('node:test');

process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-hmac';
const tokenService = require('../src/services/token.service');

test('access and refresh tokens are purpose-separated', () => {
  const user = { _id: '507f1f77bcf86cd799439011', email: 'admin@example.com' };
  const accessToken = tokenService.generateToken(user);
  const refreshToken = tokenService.generateRefreshToken(user);

  assert.equal(tokenService.verifyToken(accessToken).userId, user._id);
  assert.equal(tokenService.verifyRefreshToken(refreshToken).userId, user._id);
  assert.notEqual(tokenService.generateRefreshToken(user), refreshToken);
  assert.throws(() => tokenService.verifyToken(refreshToken));
  assert.throws(() => tokenService.verifyRefreshToken(accessToken));
});
