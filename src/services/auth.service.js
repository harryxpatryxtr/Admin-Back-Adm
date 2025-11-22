const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const tokenService = require('./token.service');

class AuthService {
  async register({ username, email, password }) {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    const token = tokenService.generateToken(user);

    return {
      message: 'User registered successfully',
      token,
      user: { id: user._id, username, email }
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = tokenService.generateToken(user);

    return {
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    };
  }
}

module.exports = new AuthService();