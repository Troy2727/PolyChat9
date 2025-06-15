import { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { getThread, addComment } from "../lib/api";
import ThreadCard from "../components/cards/ThreadCard";
import Avatar from "../components/Avatar";

const ThreadPage = () => {
  const { id } = useParams();
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const { data: thread, isLoading } = useQuery({
    queryKey: ["thread", id],
    queryFn: () => getThread(id),
    enabled: !!id,
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ threadId, content }) => addComment(threadId, content),
    onSuccess: () => {
      toast.success("Comment added successfully!");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["thread", id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add comment");
    },
  });

  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    addCommentMutation.mutate({
      threadId: id,
      content: comment.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Thread not found</h3>
            <p className="text-base-content/70 mb-6">
              This thread may have been deleted or doesn't exist.
            </p>
            <Link to="/" className="btn btn-primary">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link to="/" className="btn btn-ghost mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        {/* Main Thread */}
        <div className="mb-8">
          <ThreadCard
            id={thread._id}
            currentUserId={authUser?._id}
            parentId={thread.parentId}
            content={thread.content}
            author={thread.author}
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children || []}
            likes={thread.likes || []}
            reposts={thread.reposts || []}
            images={thread.images || []}
            upvotes={thread.upvotes || []}
            downvotes={thread.downvotes || []}
            bookmarks={thread.bookmarks || []}
            isEdited={thread.isEdited || false}
            editHistory={thread.editHistory || []}
            isComment={false}
          />
        </div>

        {/* Comment Form */}
        <div className="mb-8">
          <form onSubmit={handleSubmitComment} className="bg-base-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Avatar user={authUser} size="w-10 h-10" />
              
              <div className="flex-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="textarea textarea-bordered w-full min-h-20 resize-none"
                  maxLength={280}
                />
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-base-content/50">
                    {comment.length}/280 characters
                  </span>
                  
                  <button
                    type="submit"
                    disabled={!comment.trim() || addCommentMutation.isPending}
                    className="btn btn-primary btn-sm"
                  >
                    {addCommentMutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Posting...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        Comment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Comments */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">
            Comments ({thread.children?.length || 0})
          </h3>
          
          {!thread.children || thread.children.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto text-base-content/30 mb-3" />
              <p className="text-base-content/70">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {thread.children.map((comment) => (
                <ThreadCard
                  key={comment._id}
                  id={comment._id}
                  currentUserId={authUser?._id}
                  parentId={comment.parentId}
                  content={comment.content}
                  author={comment.author}
                  community={comment.community}
                  createdAt={comment.createdAt}
                  comments={comment.children || []}
                  likes={comment.likes || []}
                  reposts={comment.reposts || []}
                  images={comment.images || []}
                  upvotes={comment.upvotes || []}
                  downvotes={comment.downvotes || []}
                  bookmarks={comment.bookmarks || []}
                  isEdited={comment.isEdited || false}
                  editHistory={comment.editHistory || []}
                  isComment={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadPage;
