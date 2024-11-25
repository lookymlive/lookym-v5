import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI not found in environment variables');
    
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
}

async function listUsers() {
  const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    role: String,
  }));

  const users = await UserModel.find({}, 'name email role');
  console.log('\nCurrent Users:');
  users.forEach(user => {
    console.log(`- ${user.email} (${user.role || 'user'})`);
  });
}

async function makeAdmin(email: string) {
  const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    role: String,
  }));

  const user = await UserModel.findOne({ email });
  if (!user) {
    console.log(`❌ User with email ${email} not found`);
    return;
  }

  user.role = 'admin';
  await user.save();
  console.log(`✅ Successfully made ${email} an admin!`);
}

async function main() {
  const isConnected = await connectDB();
  if (!isConnected) return;

  // List all users
  await listUsers();

  // If an email was provided as an argument, make that user an admin
  const emailToPromote = process.argv[2];
  if (emailToPromote) {
    await makeAdmin(emailToPromote);
    await listUsers(); // Show updated list
  }

  await mongoose.disconnect();
  console.log('\n✅ Disconnected from MongoDB');
}

main().catch(console.error);
