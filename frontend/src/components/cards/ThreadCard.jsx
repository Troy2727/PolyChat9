import { Link } from "react-router";
import {
  Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Trash2,
  ChevronUp, ChevronDown, Bookmark, Edit3, Clock
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Avatar from "../Avatar";
import Tooltip from "../Tooltip";
import { formatDateString } from "../../lib/utils";
import { likeThread, repostThread, deleteThread, voteThread, bookmarkThread, editThread } from "../../lib/api";
import useAuthUser from "../../hooks/useAuthUser";

const ThreadCard = ({
  id,
  currentUserId,
  parentId = null,
  content,
  author,
  community = null,
  createdAt,
  comments = [],
  isComment = false,
  likes = [],
  reposts = [],
  images = [],
  upvotes = [],
  downvotes = [],
  bookmarks = [],
  isEdited = false,
  editHistory = [],
}) => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  // Check user interactions
  const isLiked = likes?.some(like => like._id === authUser?._id || like === authUser?._id);
  const isReposted = reposts?.some(repost => repost._id === authUser?._id || repost === authUser?._id);
  const hasUpvoted = upvotes?.some(vote => vote._id === authUser?._id || vote === authUser?._id);
  const hasDownvoted = downvotes?.some(vote => vote._id === authUser?._id || vote === authUser?._id);
  const isBookmarked = bookmarks?.some(bookmark => bookmark._id === authUser?._id || bookmark === authUser?._id);
  const isAuthor = author._id === authUser?._id || author.id === authUser?._id;

  // Mutations for thread actions
  const likeMutation = useMutation({
    mutationFn: () => likeThread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to like thread");
    },
  });

  const repostMutation = useMutation({
    mutationFn: () => repostThread(id),
    onSuccess: () => {
      toast.success(isReposted ? "Repost removed" : "Thread reposted!");
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to repost thread");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteThread(id),
    onSuccess: () => {
      toast.success("Thread deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      setShowDropdown(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete thread");
    },
  });

  const handleLike = () => {
    if (!authUser) {
      toast.error("Please login to like threads");
      return;
    }
    likeMutation.mutate();
  };

  const handleRepost = () => {
    if (!authUser) {
      toast.error("Please login to repost threads");
      return;
    }
    repostMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this thread?")) {
      deleteMutation.mutate();
    }
  };

  // New mutations for enhanced features
  const voteMutation = useMutation({
    mutationFn: (voteType) => voteThread(id, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to vote");
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => bookmarkThread(id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to bookmark");
    },
  });

  const editMutation = useMutation({
    mutationFn: (content) => editThread(id, content),
    onSuccess: () => {
      toast.success("Thread updated successfully!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to edit thread");
    },
  });

  const handleVote = (voteType) => {
    if (!authUser) {
      toast.error("Please login to vote");
      return;
    }
    voteMutation.mutate(voteType);
  };

  const handleBookmark = () => {
    if (!authUser) {
      toast.error("Please login to bookmark");
      return;
    }
    bookmarkMutation.mutate();
  };

  const handleEdit = () => {
    if (editContent.trim() === content.trim()) {
      setIsEditing(false);
      return;
    }
    if (!editContent.trim()) {
      toast.error("Content cannot be empty");
      return;
    }
    editMutation.mutate(editContent.trim());
  };

  const cancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };
  return (
    <article className={`flex w-full flex-col rounded-xl ${
      isComment ? "px-0 xs:px-7" : "bg-base-200 p-7"
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link to={`/profile/${author._id || author.id}`} className="relative h-11 w-11">
              <Avatar
                user={author}
                size="w-11 h-11"
                className="cursor-pointer"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <div className="flex items-center justify-between">
              <Link to={`/profile/${author._id || author.id}`} className="w-fit">
                <h4 className="cursor-pointer text-base-semibold">
                  {author.fullName || author.name}
                </h4>
              </Link>

              {/* Language Learning Badge */}
              {author.nativeLanguage && (
                <div className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                  <span>🗣️ {author.nativeLanguage}</span>
                  {author.learningLanguage && (
                    <span>📚 {author.learningLanguage}</span>
                  )}
                </div>
              )}

              {/* Thread Actions Dropdown */}
              {isAuthor && (
                <div className="relative">
                  <Tooltip text="More Options">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="btn btn-ghost btn-sm btn-circle"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </Tooltip>

                  {showDropdown && (
                    <div className="absolute right-0 top-8 bg-base-100 border border-base-300 rounded-lg shadow-lg z-10 min-w-32">
                      <Tooltip text="Edit this thread">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowDropdown(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-base-200 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                      </Tooltip>
                      <Tooltip text="Delete this thread">
                        <button
                          onClick={handleDelete}
                          disabled={deleteMutation.isPending}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-base-200 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </Tooltip>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Thread Content - Editable */}
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="textarea textarea-bordered w-full min-h-20 text-sm"
                  placeholder="Edit your thread..."
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-base-content/60">
                    {editContent.length}/500
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={cancelEdit}
                      className="btn btn-ghost btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEdit}
                      disabled={editMutation.isPending}
                      className="btn btn-primary btn-sm"
                    >
                      {editMutation.isPending ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-sm">{content}</p>
                {isEdited && (
                  <Tooltip text="This thread has been edited">
                    <div className="flex items-center gap-1 mt-1 text-xs text-base-content/60">
                      <Clock className="w-3 h-3" />
                      <span>Edited</span>
                    </div>
                  </Tooltip>
                )}
              </div>
            )}

            {/* Thread Images */}
            {images && images.length > 0 && (
              <div className={`mt-3 grid gap-2 ${
                images.length === 1 ? 'grid-cols-1' :
                images.length === 2 ? 'grid-cols-2' :
                'grid-cols-2'
              }`}>
                {images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Thread image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {images.length > 4 && index === 3 && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold">+{images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              {/* Main Action Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Upvote/Downvote */}
                  <div className="flex items-center gap-1">
                    <Tooltip text="Upvote">
                      <button
                        onClick={() => handleVote('upvote')}
                        disabled={voteMutation.isPending}
                        className={`flex items-center gap-1 transition-colors ${
                          hasUpvoted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
                        }`}
                      >
                        <ChevronUp className={`w-5 h-5 ${hasUpvoted ? 'fill-current' : ''}`} />
                        {upvotes?.length > 0 && (
                          <span className="text-xs">{upvotes.length}</span>
                        )}
                      </button>
                    </Tooltip>

                    <Tooltip text="Downvote">
                      <button
                        onClick={() => handleVote('downvote')}
                        disabled={voteMutation.isPending}
                        className={`flex items-center gap-1 transition-colors ${
                          hasDownvoted ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <ChevronDown className={`w-5 h-5 ${hasDownvoted ? 'fill-current' : ''}`} />
                        {downvotes?.length > 0 && (
                          <span className="text-xs">{downvotes.length}</span>
                        )}
                      </button>
                    </Tooltip>
                  </div>

                  {/* Comment Button */}
                  <Tooltip text="Comments">
                    <Link to={`/thread/${id}`} className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      {comments?.length > 0 && (
                        <span className="text-xs">{comments.length}</span>
                      )}
                    </Link>
                  </Tooltip>

                  {/* Like Button */}
                  <Tooltip text={isLiked ? "Unlike" : "Like"}>
                    <button
                      onClick={handleLike}
                      disabled={likeMutation.isPending}
                      className={`flex items-center gap-1 transition-colors ${
                        isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      {likes?.length > 0 && (
                        <span className="text-xs">{likes.length}</span>
                      )}
                    </button>
                  </Tooltip>

                  {/* Repost Button */}
                  <Tooltip text={isReposted ? "Unrepost" : "Repost"}>
                    <button
                      onClick={handleRepost}
                      disabled={repostMutation.isPending}
                      className={`flex items-center gap-1 transition-colors ${
                        isReposted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
                      }`}
                    >
                      <Repeat2 className="w-5 h-5" />
                      {reposts?.length > 0 && (
                        <span className="text-xs">{reposts.length}</span>
                      )}
                    </button>
                  </Tooltip>
                </div>

                {/* Secondary Actions */}
                <div className="flex items-center gap-2">
                  {/* Bookmark Button */}
                  <Tooltip text={isBookmarked ? "Remove Bookmark" : "Bookmark"}>
                    <button
                      onClick={handleBookmark}
                      disabled={bookmarkMutation.isPending}
                      className={`transition-colors ${
                        isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </Tooltip>

                  {/* Share Button */}
                  <Tooltip text="Share">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/thread/${id}`);
                        toast.success("Link copied to clipboard!");
                      }}
                      className="text-gray-500 hover:text-purple-500 transition-colors"
                    >
                      <Share className="w-5 h-5" />
                    </button>
                  </Tooltip>
                </div>
              </div>

              {isComment && comments.length > 0 && (
                <Link to={`/thread/${id}`}>
                  <p className="mt-1 text-xs text-gray-500">
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comment Preview for Main Threads */}
      {!isComment && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {comments.slice(0, 2).map((comment, index) => (
            <Avatar
              key={index}
              user={comment.author}
              size="w-6 h-6"
              className={`${index !== 0 && "-ml-2"} object-cover`}
            />
          ))}

          <Link to={`/thread/${id}`}>
            <p className="mt-1 text-xs text-gray-500">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {/* Thread Metadata */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>{formatDateString(createdAt)}</span>

          {!isComment && community && (
            <Link
              to={`/communities/${community._id || community.id}`}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <span>{community.name} Community</span>
              <Avatar
                user={community}
                size="w-4 h-4"
                className="object-cover"
              />
            </Link>
          )}
        </div>

        {/* Language Learning Context */}
        {!isComment && (author.nativeLanguage || author.learningLanguage) && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Language Exchange</span>
            <Link
              to={`/chat/${author._id || author.id}`}
              className="btn btn-xs btn-primary"
            >
              Practice Together
            </Link>
          </div>
        )}
      </div>
    </article>
  );
};

export default ThreadCard;
