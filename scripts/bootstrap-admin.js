require('dotenv').config();

const bcrypt = require('bcrypt');
const { randomUUID } = require('node:crypto');
const mongoose = require('mongoose');
const { validateConfig } = require('../src/config/environment');
const { connectDB } = require('../src/config/database');
const User = require('../src/models/User.model');
const Role = require('../src/models/Role.model');
const Permission = require('../src/models/Permission.model');
const PermissionRole = require('../src/models/PermissionRole.model');
const UserRole = require('../src/models/UserRole.model');

const permissionKeys = [
  'domain:create', 'domain:update', 'domain:read',
  'user-type:create', 'user-type:update', 'user-type:read',
  'document-type:create', 'document-type:update', 'document-type:read',
  'position:create', 'position:update', 'position:read',
  'permission:create', 'permission:update', 'permission:read',
  'role:create', 'role:update', 'role:read', 'role:permissions:update',
  'user:create', 'user:update', 'user:read', 'user:assign-role',
];

const bootstrapAdmin = async () => {
  const config = validateConfig();
  const username = process.env.BOOTSTRAP_ADMIN_USER?.trim();
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!username || !email || !password) {
    throw new Error('Set BOOTSTRAP_ADMIN_USER, BOOTSTRAP_ADMIN_EMAIL, and BOOTSTRAP_ADMIN_PASSWORD');
  }
  if (username.length < 3 || username.length > 30) {
    throw new Error('BOOTSTRAP_ADMIN_USER must be between 3 and 30 characters');
  }
  if ([...password].length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('BOOTSTRAP_ADMIN_PASSWORD must be 12-72 bytes');
  }

  await connectDB(config.MONGODB_URI);

  const role = await Role.findOne({ id: 'super-admin' }).exec();
  if (role) {
    const assignment = await UserRole.findOne({ role: role._id, state: 1 }).exec();
    if (assignment) {
      const linkedUser = await User.findById(assignment.user).select('+username').exec();
      if (linkedUser?.email !== email) {
        throw new Error('A super-admin account is already configured');
      }
    }
  }

  let admin = await User.findOne({ email }).select('+password +username +isActive').exec();
  if (admin) {
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword || (admin.user && admin.user !== username) || admin.state !== 1 || admin.isActive === false) {
      throw new Error('The supplied bootstrap credentials do not match the existing account');
    }
  } else {
    const existingUsername = await User.findOne({ $or: [{ user: username }, { username }] }).exec();
    if (existingUsername) {
      throw new Error('BOOTSTRAP_ADMIN_USER is already in use');
    }
    admin = await User.create({
      id: randomUUID(),
      user: username,
      email,
      password: await bcrypt.hash(password, 12),
      state: 1,
    });
  }

  const activeRole = await Role.findOneAndUpdate(
    { id: 'super-admin' },
    { $set: { name: 'Super Administrator', state: 1, userUpdate: admin._id }, $setOnInsert: { description: 'Initial administrator role' } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  ).exec();

  for (const key of permissionKeys) {
    const permission = await Permission.findOneAndUpdate(
      { id: key },
      { $set: { name: key, state: 1, userUpdate: admin._id }, $setOnInsert: { description: `Access: ${key}` } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    ).exec();

    await PermissionRole.findOneAndUpdate(
      { role: activeRole._id, permission: permission._id },
      {
        $set: { state: 1, userUpdate: admin._id },
        $setOnInsert: { id: randomUUID(), userCreated: admin._id },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    ).exec();
  }

  await UserRole.findOneAndUpdate(
    { user: admin._id, role: activeRole._id },
    {
      $set: { state: 1, userUpdate: admin._id },
      $setOnInsert: { id: randomUUID(), userCreated: admin._id },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  ).exec();

  console.log('Initial administrator configured successfully');
};

bootstrapAdmin()
  .catch((error) => {
    console.error('Administrator bootstrap failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
