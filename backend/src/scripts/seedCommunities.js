import mongoose from "mongoose";
import dotenv from "dotenv";
import Community from "../models/Community.js";
import User from "../models/User.js";

dotenv.config();

const sampleCommunities = [
  {
    name: "Spanish Language Exchange",
    username: "spanish-exchange",
    bio: "Connect with native Spanish speakers and learners. Practice conversation, share cultural insights, and improve your Spanish skills together!",
    tags: ["spanish", "language-exchange", "conversation", "culture"],
    isPrivate: false,
  },
  {
    name: "French Learning Hub",
    username: "french-hub",
    bio: "Bonjour! Join our French learning community for beginners to advanced speakers. Share resources, practice pronunciation, and explore French culture.",
    tags: ["french", "learning", "pronunciation", "culture"],
    isPrivate: false,
  },
  {
    name: "Japanese Study Group",
    username: "japanese-study",
    bio: "こんにちは! Learn Japanese with fellow enthusiasts. From hiragana to kanji, from anime to business Japanese - all levels welcome!",
    tags: ["japanese", "kanji", "hiragana", "anime", "business"],
    isPrivate: false,
  },
  {
    name: "English Conversation Club",
    username: "english-conversation",
    bio: "Improve your English speaking skills in a friendly environment. Practice everyday conversations, business English, and academic discussions.",
    tags: ["english", "conversation", "business", "academic"],
    isPrivate: false,
  },
  {
    name: "German Language Learners",
    username: "german-learners",
    bio: "Guten Tag! Master German grammar, expand vocabulary, and practice speaking with native speakers and fellow learners.",
    tags: ["german", "grammar", "vocabulary", "speaking"],
    isPrivate: false,
  },
  {
    name: "Italian Culture & Language",
    username: "italian-culture",
    bio: "Ciao! Immerse yourself in Italian language and culture. Learn about food, art, history while improving your Italian skills.",
    tags: ["italian", "culture", "food", "art", "history"],
    isPrivate: false,
  },
  {
    name: "Mandarin Chinese Circle",
    username: "mandarin-circle",
    bio: "你好! Practice Mandarin Chinese with native speakers. Focus on tones, characters, and real-life conversations.",
    tags: ["mandarin", "chinese", "tones", "characters"],
    isPrivate: false,
  },
  {
    name: "Portuguese Speakers United",
    username: "portuguese-united",
    bio: "Olá! Connect with Portuguese speakers from Brazil, Portugal, and around the world. Share experiences and improve together.",
    tags: ["portuguese", "brazil", "portugal", "culture"],
    isPrivate: false,
  },
  {
    name: "Korean Language Exchange",
    username: "korean-exchange",
    bio: "안녕하세요! Learn Korean language and culture. From K-pop to business Korean, practice with native speakers and enthusiasts.",
    tags: ["korean", "k-pop", "culture", "business"],
    isPrivate: false,
  },
  {
    name: "Arabic Learning Community",
    username: "arabic-learning",
    bio: "مرحبا! Explore the beautiful Arabic language. Practice Modern Standard Arabic and various dialects with native speakers.",
    tags: ["arabic", "dialects", "culture", "calligraphy"],
    isPrivate: false,
  }
];

async function seedCommunities() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find the first user to be the creator (you can modify this logic)
    const firstUser = await User.findOne().sort({ createdAt: 1 });
    if (!firstUser) {
      console.log("No users found. Please create a user first.");
      process.exit(1);
    }

    console.log(`Using user ${firstUser.fullName} as community creator`);

    // Clear existing communities (optional)
    await Community.deleteMany({});
    console.log("Cleared existing communities");

    // Create communities
    const createdCommunities = [];
    for (const communityData of sampleCommunities) {
      const community = new Community({
        ...communityData,
        createdBy: firstUser._id,
        members: [firstUser._id], // Creator is automatically a member
      });

      const savedCommunity = await community.save();
      createdCommunities.push(savedCommunity);
      console.log(`Created community: ${community.name}`);
    }

    // Update user's communities array
    await User.findByIdAndUpdate(firstUser._id, {
      $push: { communities: { $each: createdCommunities.map(c => c._id) } },
    });

    console.log(`\n✅ Successfully created ${createdCommunities.length} communities!`);
    console.log("Communities created:");
    createdCommunities.forEach(c => {
      console.log(`- ${c.name} (@${c.username})`);
    });

  } catch (error) {
    console.error("Error seeding communities:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the seed function
seedCommunities();
