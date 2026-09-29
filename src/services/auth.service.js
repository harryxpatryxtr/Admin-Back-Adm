const bcrypt = require('bcrypt');
const { createHash, randomUUID, timingSafeEqual } = require('node:crypto');
const User = require('../models/User.model');
const tokenService = require('./token.service');
const { getConfig } = require('../config/environment');
const HttpError = require('../utils/http-error');

const PASSWORD_ROUNDS = 12;
const dummyPasswordHash = bcrypt.hash(randomUUID(), PASSWORD_ROUNDS);

const hashRefreshToken = (token) => createHash('sha256').update(token).digest('hex');

const safeUser = (user) => ({
  id: user.id || user._id.toString(),
  user: user.user || user.username,
  email: user.email,
  fullName: user.fullName,
});

const isSameHash = (storedHash, suppliedHash) => {
  if (!storedHash || storedHash.length !== suppliedHash.length) return false;
  return timingSafeEqual(Buffer.from(storedHash), Buffer.from(suppliedHash));
};

class AuthService {
  async register(data) {
    if (!getConfig().PUBLIC_REGISTRATION_ENABLED) {
      throw new HttpError(403, 'Public registration is disabled', { code: 'REGISTRATION_DISABLED' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { user: data.user }, { username: data.user }],
    });
    if (existingUser) {
      throw new HttpError(409, 'An account with these details already exists', { code: 'ACCOUNT_EXISTS' });
    }

    const user = await User.create({
      id: randomUUID(),
      user: data.user,
      email: data.email,
      password: await bcrypt.hash(data.password, PASSWORD_ROUNDS),
      firstName: data.firstName,
      paternalSurname: data.paternalSurname,
      maternalSurname: data.maternalSurname,
    });
    const tokens = await this.createSession(user);

    return {
      message: 'User registered successfully',
      ...tokens,
      user: safeUser(user),
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email })
      .select('+password +refreshTokenHash +username +isActive +lastName')
      .exec();

    if (!user) {
      await bcrypt.compare(password, await dummyPasswordHash);
      throw new HttpError(401, 'Invalid credentials', { code: 'INVALID_CREDENTIALS' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid || user.state !== 1 || user.isActive === false) {
      throw new HttpError(401, 'Invalid credentials', { code: 'INVALID_CREDENTIALS' });
    }

    const tokens = await this.createSession(user);
    return { message: 'Login successful', ...tokens, user: safeUser(user) };
  }

  async refreshToken({ refreshToken }) {
    let decoded;
    try {
      decoded = tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new HttpError(401, 'Invalid or expired refresh token', { code: 'INVALID_REFRESH_TOKEN' });
    }

    const user = await User.findById(decoded.userId)
      .select('+refreshTokenHash +username +isActive +lastName')
      .exec();
    const suppliedHash = hashRefreshToken(refreshToken);

    if (
      !user
      || user.state !== 1
      || user.isActive === false
      || !isSameHash(user.refreshTokenHash, suppliedHash)
    ) {
      throw new HttpError(401, 'Invalid or expired refresh token', { code: 'INVALID_REFRESH_TOKEN' });
    }

    const nextRefreshToken = tokenService.generateRefreshToken(user);
    const nextHash = hashRefreshToken(nextRefreshToken);
    const rotation = await User.updateOne(
      { _id: user._id, refreshTokenHash: suppliedHash },
      { $set: { refreshTokenHash: nextHash } },
    );
    if (rotation.modifiedCount !== 1) {
      throw new HttpError(401, 'Refresh token has already been used', { code: 'INVALID_REFRESH_TOKEN' });
    }

    return {
      accessToken: tokenService.generateToken(user),
      refreshToken: nextRefreshToken,
      tokenType: 'Bearer',
      user: safeUser(user),
    };
  }

  async logout(userId) {
    await User.updateOne({ _id: userId }, { $unset: { refreshTokenHash: 1 } });
    return { message: 'Logged out successfully' };
  }

  async createSession(user) {
    const accessToken = tokenService.generateToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);
    await User.updateOne(
      { _id: user._id },
      { $set: { refreshTokenHash: hashRefreshToken(refreshToken) } },
    );

    return { accessToken, refreshToken, tokenType: 'Bearer' };
  }
}

module.exports = new AuthService();
