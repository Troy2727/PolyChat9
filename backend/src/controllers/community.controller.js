import Community from "../models/Community.js";
import User from "../models/User.js";
import Thread from "../models/Thread.js";

// Get communities with search
export async function getCommunities(req, res) {
  try {
    const { q = "", page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Add search functionality
    if (q.trim()) {
      const searchRegex = new RegExp(q.trim(), "i");
      query = {
        $or: [
          { name: { $regex: searchRegex } },
          { username: { $regex: searchRegex } },
          { bio: { $regex: searchRegex } },
          { tags: { $in: [searchRegex] } },
        ],
      };
    }

    const communities = await Community.find(query)
      .populate("createdBy", "fullName profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Add member count and check if current user is a member
    const enrichedCommunities = communities.map(community => {
      const communityObj = community.toObject();
      communityObj.memberCount = community.members.length;
      communityObj.threadCount = community.threads.length;
      communityObj.isMember = community.members.includes(req.user.id);
      return communityObj;
    });

    res.status(200).json(enrichedCommunities);
  } catch (error) {
    console.error("Error in getCommunities controller:", error.message);
    // Return empty array instead of error for now
    res.status(200).json([]);
  }
}

// Get single community
export async function getCommunity(req, res) {
  try {
    const { id } = req.params;

    const community = await Community.findById(id)
      .populate("createdBy", "fullName profilePic")
      .populate("members", "fullName profilePic")
      .populate({
        path: "threads",
        populate: {
          path: "author",
          select: "fullName profilePic",
        },
        options: { sort: { createdAt: -1 } },
      });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const communityObj = community.toObject();
    communityObj.memberCount = community.members.length;
    communityObj.threadCount = community.threads.length;
    communityObj.isMember = community.members.includes(req.user.id);

    res.status(200).json(communityObj);
  } catch (error) {
    console.error("Error in getCommunity controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Create new community
export async function createCommunity(req, res) {
  try {
    const { name, username, bio, image, tags = [], isPrivate = false } = req.body;

    if (!name || !username) {
      return res.status(400).json({ message: "Name and username are required" });
    }

    // Check if username is already taken
    const existingCommunity = await Community.findOne({ username: username.toLowerCase() });
    if (existingCommunity) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const newCommunity = new Community({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      bio: bio?.trim(),
      image,
      tags: Array.isArray(tags) ? tags.map(tag => tag.toLowerCase().trim()) : [],
      isPrivate,
      createdBy: req.user.id,
      members: [req.user.id], // Creator is automatically a member
    });

    const savedCommunity = await newCommunity.save();

    // Add community to user's communities array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { communities: savedCommunity._id },
    });

    // Populate the saved community before returning
    const populatedCommunity = await Community.findById(savedCommunity._id)
      .populate("createdBy", "fullName profilePic");

    const communityObj = populatedCommunity.toObject();
    communityObj.memberCount = populatedCommunity.members.length;
    communityObj.threadCount = 0;
    communityObj.isMember = true;

    res.status(201).json(communityObj);
  } catch (error) {
    console.error("Error in createCommunity controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Join community
export async function joinCommunity(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if user is already a member
    if (community.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member of this community" });
    }

    // Add user to community members
    community.members.push(userId);
    await community.save();

    // Add community to user's communities array
    await User.findByIdAndUpdate(userId, {
      $push: { communities: community._id },
    });

    res.status(200).json({ message: "Successfully joined the community" });
  } catch (error) {
    console.error("Error in joinCommunity controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Leave community
export async function leaveCommunity(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log(`Leave community request: userId=${userId}, communityId=${id}`);

    const community = await Community.findById(id);
    if (!community) {
      console.log("Community not found");
      return res.status(404).json({ message: "Community not found" });
    }

    console.log(`Community found: ${community.name}, members: ${community.members.length}, createdBy: ${community.createdBy}`);

    // Check if user is a member
    if (!community.members.includes(userId)) {
      console.log("User is not a member of this community");
      return res.status(400).json({ message: "You are not a member of this community" });
    }

    // Prevent creator from leaving their own community
    if (community.createdBy.toString() === userId) {
      console.log("Creator cannot leave their own community");
      return res.status(400).json({ message: "Community creators cannot leave their own community" });
    }

    // Remove user from community members
    community.members = community.members.filter(memberId => memberId.toString() !== userId);
    await community.save();

    // Remove community from user's communities array
    await User.findByIdAndUpdate(userId, {
      $pull: { communities: community._id },
    });

    res.status(200).json({ message: "Successfully left the community" });
  } catch (error) {
    console.error("Error in leaveCommunity controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update community
export async function updateCommunity(req, res) {
  try {
    const { id } = req.params;
    const { name, bio, tags, isPrivate } = req.body;
    const userId = req.user.id;

    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if user is the creator
    if (community.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only the community creator can update the community" });
    }

    // Update community fields
    if (name) community.name = name.trim();
    if (bio !== undefined) community.bio = bio.trim();
    if (tags) community.tags = Array.isArray(tags) ? tags.map(tag => tag.toLowerCase().trim()) : [];
    if (isPrivate !== undefined) community.isPrivate = isPrivate;

    await community.save();

    // Populate the updated community
    const populatedCommunity = await Community.findById(id)
      .populate("createdBy", "fullName profilePic")
      .populate("members", "fullName profilePic");

    const communityObj = populatedCommunity.toObject();
    communityObj.memberCount = populatedCommunity.members.length;
    communityObj.threadCount = populatedCommunity.threads.length;
    communityObj.isMember = populatedCommunity.members.includes(userId);

    res.status(200).json(communityObj);
  } catch (error) {
    console.error("Error in updateCommunity controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete community
export async function deleteCommunity(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if user is the creator
    if (community.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only the community creator can delete the community" });
    }

    // Delete all threads in the community
    await Thread.deleteMany({ community: id });

    // Remove community from all users' communities array
    await User.updateMany(
      { communities: id },
      { $pull: { communities: id } }
    );

    // Delete the community
    await Community.findByIdAndDelete(id);

    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCommunity controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Remove member from community
export async function removeMemberFromCommunity(req, res) {
  try {
    const { id } = req.params;
    const { memberId } = req.body;
    const userId = req.user.id;

    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if user is the creator
    if (community.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only the community creator can remove members" });
    }

    // Check if member exists in community
    if (!community.members.includes(memberId)) {
      return res.status(400).json({ message: "User is not a member of this community" });
    }

    // Prevent removing the creator
    if (community.createdBy.toString() === memberId) {
      return res.status(400).json({ message: "Cannot remove the community creator" });
    }

    // Remove member from community
    community.members = community.members.filter(member => member.toString() !== memberId);
    await community.save();

    // Remove community from user's communities array
    await User.findByIdAndUpdate(memberId, {
      $pull: { communities: community._id },
    });

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error in removeMemberFromCommunity controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
