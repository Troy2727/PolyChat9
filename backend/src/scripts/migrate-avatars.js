import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { generateRandomAvatar } from '../lib/firebase-storage.js';

// Load environment variables
dotenv.config();

/**
 * Migration script to update existing users with the new avatar system
 * This script will:
 * 1. Move existing profilePic URLs to randomAvatarUrl if they are random avatars
 * 2. Move existing profilePic URLs to avatarUrl if they are uploaded photos
 * 3. Generate new random avatars for users without any avatar
 */
async function migrateAvatars() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      const updateData = {};
      let needsUpdate = false;

      // Check if user already has the new fields populated
      if (user.randomAvatarUrl && user.avatarUrl !== undefined) {
        console.log(`Skipping user ${user.email} - already migrated`);
        skippedCount++;
        continue;
      }

      // Handle existing profilePic
      if (user.profilePic) {
        if (user.profilePic.includes('avatar.iran.liara.run')) {
          // It's a random avatar
          updateData.randomAvatarUrl = user.profilePic;
          updateData.avatarUrl = '';
        } else {
          // It's likely an uploaded photo or external avatar
          updateData.avatarUrl = user.profilePic;
          updateData.randomAvatarUrl = generateRandomAvatar();
        }
        needsUpdate = true;
      } else {
        // No existing profilePic, generate random avatar
        updateData.randomAvatarUrl = generateRandomAvatar();
        updateData.avatarUrl = '';
        updateData.profilePic = updateData.randomAvatarUrl; // For backward compatibility
        needsUpdate = true;
      }

      if (needsUpdate) {
        await User.findByIdAndUpdate(user._id, updateData);
        console.log(`Migrated user: ${user.email}`);
        migratedCount++;
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Total users: ${users.length}`);
    console.log(`Migrated: ${migratedCount}`);
    console.log(`Skipped: ${skippedCount}`);

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateAvatars();
}

export default migrateAvatars;
