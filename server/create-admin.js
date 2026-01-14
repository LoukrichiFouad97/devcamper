import mongoose from 'mongoose';
import { config } from './config/config.js';
import { User } from './models/user.model.js';

async function resetAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.db.url);
    console.log('Connected to MongoDB');

    // Delete existing admin
    await User.deleteOne({ email: 'admin@gmail.com' });
    console.log('Deleted existing admin user');

    // Create new admin user (password will be hashed automatically by schema)
    const adminUser = await User.create({
      name: 'Admin Account',
      email: 'admin@gmail.com',
      password: '123456',  // Will be hashed by schema pre-save hook
      role: 'admin',
      provider: 'local',
      isEmailConfirmed: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password: 123456');
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAdmin();
