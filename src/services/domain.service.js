const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const tokenService = require('./token.service');

class DomainService {
  async register({ username, email, password, firstName, lastName, role }) {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword,firstName,lastName,role });
    const token = tokenService.generateToken({id: user._id, username: user.username, email, firstName, lastName, role});

    return {
      message: 'User registered successfully',
      token,
      user: { id: user._id, username, email, firstName, lastName, role }
    };
  }

  async update({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    console.log(user);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    console.log("Login attempt for email:", email);
    const token = tokenService.generateToken(user);

    return {
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    };
  }
   async getAll({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    console.log(user);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    console.log("Login attempt for email:", email);
    const token = tokenService.generateToken(user);

    return {
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    };
  }

  async getById({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    console.log(user);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    console.log("Login attempt for email:", email);
    const token = tokenService.generateToken(user);

    return {
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    };
  }
}

module.exports = new DomainService();