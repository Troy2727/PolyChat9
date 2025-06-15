import Thread from "../models/Thread.js";
import User from "../models/User.js";
import Community from "../models/Community.js";

// Get threads with filtering
export async function getThreads(req, res) {
  try {
    const { filter = "all", page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = { parentId: null, isDeleted: false }; // Only top-level threads

    // Apply filters
    if (filter === "following") {
      const user = await User.findById(req.user.id).populate("friends");
      const followingIds = user.friends.map(friend => friend._id);
      followingIds.push(req.user.id); // Include user's own threads
      query.author = { $in: followingIds };
    }

    const threads = await Thread.find(query)
      .populate({
        path: "author",
        select: "fullName profilePic _id nativeLanguage learningLanguage",
      })
      .populate({
        path: "community",
        select: "name username image _id",
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          select: "fullName profilePic _id nativeLanguage learningLanguage",
        },
      })
      .populate({
        path: "likes",
        select: "fullName _id",
      })
      .populate({
        path: "reposts",
        select: "fullName _id",
      })
      .populate({
        path: "upvotes",
        select: "fullName _id",
      })
      .populate({
        path: "downvotes",
        select: "fullName _id",
      })
      .populate({
        path: "bookmarks",
        select: "fullName _id",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json(threads);
  } catch (error) {
    console.error("Error in getThreads controller:", error.message);
    // Return empty array instead of error for now
    res.status(200).json([]);
  }
}

// Get single thread by ID
export async function getThread(req, res) {
  try {
    const { id } = req.params;

    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        select: "fullName profilePic _id nativeLanguage learningLanguage",
      })
      .populate({
        path: "community",
        select: "name username image _id",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            select: "fullName profilePic _id nativeLanguage learningLanguage",
          },
          {
            path: "children",
            populate: {
              path: "author",
              select: "fullName profilePic _id nativeLanguage learningLanguage",
            },
          },
        ],
      })
      .populate({
        path: "likes",
        select: "fullName _id",
      })
      .populate({
        path: "reposts",
        select: "fullName _id",
      })
      .populate({
        path: "upvotes",
        select: "fullName _id",
      })
      .populate({
        path: "downvotes",
        select: "fullName _id",
      })
      .populate({
        path: "bookmarks",
        select: "fullName _id",
      });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    res.status(200).json(thread);
  } catch (error) {
    console.error("Error in getThread controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Create new thread
export async function createThread(req, res) {
  try {
    const { content, images = [], communityId = null } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Content is required" });
    }

    const newThread = new Thread({
      content: content.trim(),
      author: req.user.id,
      images,
      community: communityId,
    });

    const savedThread = await newThread.save();

    // Update user's threads array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { threads: savedThread._id },
    });

    // Update community's threads array if applicable
    if (communityId) {
      await Community.findByIdAndUpdate(communityId, {
        $push: { threads: savedThread._id },
      });
    }

    // Populate the saved thread before returning
    const populatedThread = await Thread.findById(savedThread._id)
      .populate({
        path: "author",
        select: "fullName profilePic _id",
      })
      .populate({
        path: "community",
        select: "name username image _id",
      });

    res.status(201).json(populatedThread);
  } catch (error) {
    console.error("Error in createThread controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Add comment to thread
export async function addComment(req, res) {
  try {
    const { id: threadId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Find the original thread
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    // Create the comment thread
    const commentThread = new Thread({
      content: content.trim(),
      author: req.user.id,
      parentId: threadId,
    });

    const savedComment = await commentThread.save();

    // Add comment to original thread's children
    originalThread.children.push(savedComment._id);
    await originalThread.save();

    // Populate the saved comment before returning
    const populatedComment = await Thread.findById(savedComment._id)
      .populate({
        path: "author",
        select: "fullName profilePic _id",
      });

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error in addComment controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Like/Unlike thread
export async function likeThread(req, res) {
  try {
    const { id: threadId } = req.params;
    const userId = req.user.id;

    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const isLiked = thread.likes.includes(userId);

    if (isLiked) {
      // Unlike the thread
      thread.likes = thread.likes.filter(id => id.toString() !== userId);
    } else {
      // Like the thread
      thread.likes.push(userId);
    }

    await thread.save();

    // Populate the updated thread
    const populatedThread = await Thread.findById(threadId)
      .populate({
        path: "author",
        select: "fullName profilePic _id nativeLanguage learningLanguage",
      })
      .populate({
        path: "likes",
        select: "fullName _id",
      })
      .populate({
        path: "reposts",
        select: "fullName _id",
      });

    res.status(200).json({
      message: isLiked ? "Thread unliked" : "Thread liked",
      thread: populatedThread,
    });
  } catch (error) {
    console.error("Error in likeThread controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Repost/Unrepost thread
export async function repostThread(req, res) {
  try {
    const { id: threadId } = req.params;
    const userId = req.user.id;

    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    // Check if user is trying to repost their own thread
    if (thread.author.toString() === userId) {
      return res.status(400).json({ message: "You cannot repost your own thread" });
    }

    const isReposted = thread.reposts.includes(userId);

    if (isReposted) {
      // Remove repost
      thread.reposts = thread.reposts.filter(id => id.toString() !== userId);
    } else {
      // Add repost
      thread.reposts.push(userId);
    }

    await thread.save();

    res.status(200).json({
      message: isReposted ? "Repost removed" : "Thread reposted",
      isReposted: !isReposted,
    });
  } catch (error) {
    console.error("Error in repostThread controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete thread
export async function deleteThread(req, res) {
  try {
    const { id: threadId } = req.params;
    const userId = req.user.id;

    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    // Check if user is the author of the thread
    if (thread.author.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own threads" });
    }

    // Soft delete - mark as deleted instead of removing from database
    thread.isDeleted = true;
    await thread.save();

    // Remove from user's threads array
    await User.findByIdAndUpdate(userId, {
      $pull: { threads: threadId },
    });

    // Remove from community's threads array if applicable
    if (thread.community) {
      await Community.findByIdAndUpdate(thread.community, {
        $pull: { threads: threadId },
      });
    }

    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (error) {
    console.error("Error in deleteThread controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Upvote/Downvote thread
export async function voteThread(req, res) {
  try {
    const { id: threadId } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const userId = req.user.id;

    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const hasUpvoted = thread.upvotes.includes(userId);
    const hasDownvoted = thread.downvotes.includes(userId);

    if (voteType === 'upvote') {
      if (hasUpvoted) {
        // Remove upvote
        thread.upvotes = thread.upvotes.filter(id => id.toString() !== userId);
      } else {
        // Add upvote and remove downvote if exists
        thread.upvotes.push(userId);
        if (hasDownvoted) {
          thread.downvotes = thread.downvotes.filter(id => id.toString() !== userId);
        }
      }
    } else if (voteType === 'downvote') {
      if (hasDownvoted) {
        // Remove downvote
        thread.downvotes = thread.downvotes.filter(id => id.toString() !== userId);
      } else {
        // Add downvote and remove upvote if exists
        thread.downvotes.push(userId);
        if (hasUpvoted) {
          thread.upvotes = thread.upvotes.filter(id => id.toString() !== userId);
        }
      }
    }

    await thread.save();

    res.status(200).json({
      message: "Vote updated successfully",
      upvotes: thread.upvotes.length,
      downvotes: thread.downvotes.length,
      userVote: hasUpvoted && voteType === 'upvote' ? null :
                hasDownvoted && voteType === 'downvote' ? null : voteType,
    });
  } catch (error) {
    console.error("Error in voteThread controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Bookmark/Unbookmark thread
export async function bookmarkThread(req, res) {
  try {
    const { id: threadId } = req.params;
    const userId = req.user.id;

    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const isBookmarked = thread.bookmarks.includes(userId);

    if (isBookmarked) {
      // Remove bookmark
      thread.bookmarks = thread.bookmarks.filter(id => id.toString() !== userId);
    } else {
      // Add bookmark
      thread.bookmarks.push(userId);
    }

    await thread.save();

    res.status(200).json({
      message: isBookmarked ? "Bookmark removed" : "Thread bookmarked",
      isBookmarked: !isBookmarked,
    });
  } catch (error) {
    console.error("Error in bookmarkThread controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Edit thread
export async function editThread(req, res) {
  try {
    const { id: threadId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Content is required" });
    }

    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    // Check if user is the author of the thread
    if (thread.author.toString() !== userId) {
      return res.status(403).json({ message: "You can only edit your own threads" });
    }

    // Save current content to edit history
    if (!thread.isEdited) {
      thread.editHistory.push({
        content: thread.content,
        editedAt: thread.createdAt,
      });
    }

    // Add new edit to history
    thread.editHistory.push({
      content: thread.content,
      editedAt: new Date(),
    });

    // Update thread content
    thread.content = content.trim();
    thread.isEdited = true;

    await thread.save();

    // Populate the updated thread
    const populatedThread = await Thread.findById(threadId)
      .populate({
        path: "author",
        select: "fullName profilePic _id nativeLanguage learningLanguage",
      })
      .populate({
        path: "community",
        select: "name username image _id",
      });

    res.status(200).json({
      message: "Thread updated successfully",
      thread: populatedThread,
    });
  } catch (error) {
    console.error("Error in editThread controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
