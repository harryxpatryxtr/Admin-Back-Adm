const jwt = require('jsonwebtoken');
const { randomUUID } = require('node:crypto');
const { getConfig } = require('../config/environment');

const ISSUER = 'traza-admin-api';
const AUDIENCE = 'traza-admin-client';

const getSecret = () => {
  const { JWT_SECRET } = getConfig();
  if (!JWT_SECRET || Buffer.byteLength(JWT_SECRET) < 32) {
    throw new Error('JWT_SECRET must contain at least 32 bytes');
  }
  return JWT_SECRET;
};

const getUserId = (user) => {
  const userId = user?._id || user?.userId || user?.id;
  if (!userId) {
    throw new Error('A user ID is required to create a token');
  }
  return userId.toString();
};

class TokenService {
  generateToken(user) {
    const { JWT_EXPIRE } = getConfig();
    return jwt.sign(
      { userId: getUserId(user), tokenType: 'access', jti: randomUUID() },
      getSecret(),
      { expiresIn: JWT_EXPIRE, issuer: ISSUER, audience: AUDIENCE, algorithm: 'HS256' },
    );
  }

  generateRefreshToken(user) {
    const { JWT_REFRESH_EXPIRE } = getConfig();
    return jwt.sign(
      { userId: getUserId(user), tokenType: 'refresh', jti: randomUUID() },
      getSecret(),
      { expiresIn: JWT_REFRESH_EXPIRE, issuer: ISSUER, audience: AUDIENCE, algorithm: 'HS256' },
    );
  }

  verifyToken(token) {
    const decoded = jwt.verify(token, getSecret(), {
      algorithms: ['HS256'],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (decoded.tokenType !== 'access') {
      throw new Error('Invalid access token');
    }
    if (typeof decoded.userId !== 'string' || decoded.userId.length === 0) {
      throw new Error('Invalid access token subject');
    }
    return decoded;
  }

  verifyRefreshToken(token) {
    const decoded = jwt.verify(token, getSecret(), {
      algorithms: ['HS256'],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (decoded.tokenType !== 'refresh') {
      throw new Error('Invalid refresh token');
    }
    if (typeof decoded.userId !== 'string' || decoded.userId.length === 0) {
      throw new Error('Invalid refresh token subject');
    }
    return decoded;
  }
}

module.exports = new TokenService();
