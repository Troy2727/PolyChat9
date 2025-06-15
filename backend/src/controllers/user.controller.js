import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Search users
export async function searchUsers(req, res) {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;

    if (!q || q.trim().length === 0) {
      return res.status(200).json([]);
    }

    const searchRegex = new RegExp(q.trim(), "i");

    const users = await User.find({
      _id: { $ne: currentUserId }, // Exclude current user
      $or: [
        { fullName: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { bio: { $regex: searchRegex } },
      ],
    })
      .select("fullName profilePic bio location nativeLanguage learningLanguage")
      .limit(20);

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in searchUsers controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUserProfile(req, res) {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    const user = await User.findById(id)
      .select("fullName email profilePic avatarUrl randomAvatarUrl bio location nativeLanguage learningLanguage createdAt friends communities")
      .populate({
        path: "threads",
        populate: [
          {
            path: "author",
            select: "fullName profilePic avatarUrl randomAvatarUrl nativeLanguage learningLanguage",
          },
          {
            path: "community",
            select: "name username image",
          },
        ],
        options: { sort: { createdAt: -1 } },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current user is friends with this user
    const isFriend = user.friends.includes(currentUserId);

    // Check if there's a pending friend request
    const pendingRequest = await FriendRequest.findOne({
      sender: currentUserId,
      recipient: id,
      status: "pending",
    });

    const userProfile = {
      ...user.toObject(),
      isFriend,
      hasPendingRequest: !!pendingRequest,
      threadCount: user.threads?.length || 0,
      friendCount: user.friends?.length || 0,
      communityCount: user.communities?.length || 0,
    };

    // Remove sensitive information
    delete userProfile.email;
    delete userProfile.friends;
    delete userProfile.communities;

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error in getUserProfile controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
