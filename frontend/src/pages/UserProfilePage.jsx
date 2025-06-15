import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, UserPlus, UserCheck, MapPin, Languages, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { getUserProfile, sendFriendRequest } from "../lib/api";
import Avatar from "../components/Avatar";
import ThreadCard from "../components/cards/ThreadCard";
import { formatDateString } from "../lib/utils";

const UserProfilePage = () => {
  const { id } = useParams();
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("threads");

  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => getUserProfile(id),
    enabled: !!id,
  });

  const sendFriendRequestMutation = useMutation({
    mutationFn: () => sendFriendRequest(id),
    onSuccess: () => {
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["userProfile", id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send friend request");
    },
  });

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

  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">User not found</h3>
            <p className="text-base-content/70 mb-6">
              This user may not exist or has been removed.
            </p>
            <Link to="/search" className="btn btn-primary">
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = user._id === authUser?._id;
  const isFriend = user.isFriend;
  const hasPendingRequest = user.hasPendingRequest;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="card bg-base-200 mb-8">
          <div className="card-body p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar user={user} size="w-24 h-24" />
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
                
                {user.bio && (
                  <p className="text-base-content/80 mb-4">{user.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDateString(user.createdAt)}
                  </div>
                </div>

                {/* Language Information */}
                {(user.nativeLanguage || user.learningLanguage) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {user.nativeLanguage && (
                      <div className="badge badge-secondary">
                        🗣️ Native: {user.nativeLanguage}
                      </div>
                    )}
                    {user.learningLanguage && (
                      <div className="badge badge-outline">
                        📚 Learning: {user.learningLanguage}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!isOwnProfile && (
                <div className="flex gap-3">
                  <Link to={`/chat/${user._id}`} className="btn btn-outline">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </Link>
                  
                  {isFriend ? (
                    <button className="btn btn-success" disabled>
                      <UserCheck className="w-4 h-4" />
                      Friends
                    </button>
                  ) : hasPendingRequest ? (
                    <button className="btn btn-disabled" disabled>
                      <UserPlus className="w-4 h-4" />
                      Request Sent
                    </button>
                  ) : (
                    <button
                      onClick={() => sendFriendRequestMutation.mutate()}
                      disabled={sendFriendRequestMutation.isPending}
                      className="btn btn-primary"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add Friend
                    </button>
                  )}
                </div>
              )}

              {isOwnProfile && (
                <Link to="/profile" className="btn btn-primary">
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card bg-base-200 text-center">
            <div className="card-body py-4">
              <div className="text-2xl font-bold">{user.threadCount || 0}</div>
              <div className="text-sm text-base-content/70">Threads</div>
            </div>
          </div>
          <div className="card bg-base-200 text-center">
            <div className="card-body py-4">
              <div className="text-2xl font-bold">{user.friendCount || 0}</div>
              <div className="text-sm text-base-content/70">Friends</div>
            </div>
          </div>
          <div className="card bg-base-200 text-center">
            <div className="card-body py-4">
              <div className="text-2xl font-bold">{user.communityCount || 0}</div>
              <div className="text-sm text-base-content/70">Communities</div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${activeTab === "threads" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("threads")}
          >
            Threads
          </button>
          <button
            className={`tab ${activeTab === "replies" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("replies")}
          >
            Replies
          </button>
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
          {activeTab === "threads" && (
            <div>
              {!user.threads || user.threads.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No threads yet</h3>
                  <p className="text-base-content/70">
                    {isOwnProfile ? "Start sharing your thoughts!" : `${user.fullName} hasn't posted any threads yet.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {user.threads.map((thread) => (
                    <ThreadCard
                      key={thread._id}
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
                      isComment={false}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "replies" && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Replies</h3>
              <p className="text-base-content/70">
                Reply functionality coming soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
