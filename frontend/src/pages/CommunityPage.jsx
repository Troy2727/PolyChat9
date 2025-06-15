import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Plus, Settings, MessageCircle, Globe, X, Edit3, Trash2, UserMinus, Crown } from "lucide-react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { getCommunity, joinCommunity, leaveCommunity, getThreads, updateCommunity, deleteCommunity, removeMemberFromCommunity } from "../lib/api";
import Avatar from "../components/Avatar";
import Tooltip from "../components/Tooltip";
import ThreadCard from "../components/cards/ThreadCard";
import { formatDateString } from "../lib/utils";

const CommunityPage = () => {
  const { id } = useParams();
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("threads");
  const [showManageModal, setShowManageModal] = useState(false);

  const { data: community, isLoading: communityLoading } = useQuery({
    queryKey: ["community", id],
    queryFn: () => getCommunity(id),
    enabled: !!id,
  });

  const { data: threads = [], isLoading: threadsLoading } = useQuery({
    queryKey: ["communityThreads", id],
    queryFn: () => getThreads({ community: id }),
    enabled: !!id,
  });

  const joinMutation = useMutation({
    mutationFn: () => joinCommunity(id),
    onSuccess: () => {
      toast.success("Joined community successfully!");
      queryClient.invalidateQueries({ queryKey: ["community", id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to join community");
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveCommunity(id),
    onSuccess: () => {
      toast.success("Left community successfully!");
      queryClient.invalidateQueries({ queryKey: ["community", id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to leave community");
    },
  });

  if (communityLoading) {
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

  if (!community) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Community not found</h3>
            <p className="text-base-content/70 mb-6">
              This community may not exist or has been removed.
            </p>
            <Link to="/communities" className="btn btn-primary">
              Back to Communities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isMember = community.members?.some(member => 
    (member._id || member) === authUser?._id
  );
  const isCreator = community.createdBy?._id === authUser?._id || 
                   community.createdBy === authUser?._id;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Community Header */}
        <div className="card bg-base-200 mb-8">
          <div className="card-body p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar user={community} size="w-24 h-24" />
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
                <p className="text-lg text-base-content/80 mb-2">@{community.username}</p>
                
                {community.bio && (
                  <p className="text-base-content/80 mb-4">{community.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
                  <Tooltip text="Number of community members">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {community.members?.length || 0} members
                    </div>
                  </Tooltip>

                  <Tooltip text="Number of threads in this community">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {threads.length} threads
                    </div>
                  </Tooltip>

                  <Tooltip text={community.isPrivate ? "This is a private community" : "This is a public community"}>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {community.isPrivate ? 'Private' : 'Public'}
                    </div>
                  </Tooltip>
                </div>

                {/* Community Tags */}
                {community.tags && community.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {community.tags.map((tag, index) => (
                      <span key={index} className="badge badge-outline">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!isMember ? (
                  <Tooltip text="Join this community">
                    <button
                      onClick={() => joinMutation.mutate()}
                      disabled={joinMutation.isPending}
                      className="btn btn-primary"
                    >
                      <Plus className="w-4 h-4" />
                      Join Community
                    </button>
                  </Tooltip>
                ) : (
                  <>
                    <Tooltip text="Create a new thread in this community">
                      <Link
                        to={`/create-thread?community=${id}`}
                        className="btn btn-primary"
                      >
                        <Plus className="w-4 h-4" />
                        Create Thread
                      </Link>
                    </Tooltip>

                    {!isCreator && (
                      <Tooltip text="Leave this community">
                        <button
                          onClick={() => leaveMutation.mutate()}
                          disabled={leaveMutation.isPending}
                          className="btn btn-outline"
                        >
                          Leave
                        </button>
                      </Tooltip>
                    )}

                    {isCreator && (
                      <Tooltip text="Manage community settings">
                        <button
                          className="btn btn-outline"
                          onClick={() => setShowManageModal(true)}
                        >
                          <Settings className="w-4 h-4" />
                          Manage
                        </button>
                      </Tooltip>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Community Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${activeTab === "threads" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("threads")}
          >
            Threads
          </button>
          <button
            className={`tab ${activeTab === "members" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
          <button
            className={`tab ${activeTab === "about" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>

        {/* Community Content */}
        <div className="space-y-6">
          {activeTab === "threads" && (
            <div>
              {threadsLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-md" />
                </div>
              ) : threads.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No threads yet</h3>
                  <p className="text-base-content/70 mb-6">
                    Be the first to start a conversation in this community!
                  </p>
                  {isMember && (
                    <Link 
                      to={`/create-thread?community=${id}`} 
                      className="btn btn-primary"
                    >
                      Create First Thread
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {threads.map((thread) => (
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
                      upvotes={thread.upvotes || []}
                      downvotes={thread.downvotes || []}
                      bookmarks={thread.bookmarks || []}
                      isEdited={thread.isEdited || false}
                      editHistory={thread.editHistory || []}
                      isComment={false}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "members" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {community.members?.map((member) => (
                <div key={member._id || member} className="card bg-base-200">
                  <div className="card-body p-4">
                    <div className="flex items-center gap-3">
                      <Avatar user={member} size="w-12 h-12" />
                      <div>
                        <h4 className="font-semibold">{member.fullName || member.name}</h4>
                        {member.nativeLanguage && (
                          <p className="text-sm text-base-content/70">
                            🗣️ {member.nativeLanguage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "about" && (
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-4">About this community</h3>
                <p className="text-base-content/80 mb-4">
                  {community.bio || "No description available."}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Created:</span>
                    <p>{formatDateString(community.createdAt)}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Creator:</span>
                    <p>{community.createdBy?.fullName || "Unknown"}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Privacy:</span>
                    <p>{community.isPrivate ? "Private" : "Public"}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Members:</span>
                    <p>{community.members?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Community Management Modal */}
        {showManageModal && (
          <CommunityManageModal
            community={community}
            onClose={() => setShowManageModal(false)}
            onUpdate={() => {
              queryClient.invalidateQueries({ queryKey: ["community", id] });
              setShowManageModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Community Management Modal Component
const CommunityManageModal = ({ community, onClose, onUpdate }) => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [activeManageTab, setActiveManageTab] = useState("settings");
  const [editForm, setEditForm] = useState({
    name: community.name || "",
    bio: community.bio || "",
    tags: community.tags?.join(", ") || "",
    isPrivate: community.isPrivate || false,
  });

  // Update community mutation
  const updateMutation = useMutation({
    mutationFn: (data) => updateCommunity(community._id, data),
    onSuccess: () => {
      toast.success("Community updated successfully!");
      onUpdate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update community");
    },
  });

  // Delete community mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteCommunity(community._id),
    onSuccess: () => {
      toast.success("Community deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      window.location.href = "/communities";
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete community");
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (memberId) => removeMemberFromCommunity(community._id, memberId),
    onSuccess: () => {
      toast.success("Member removed successfully!");
      queryClient.invalidateQueries({ queryKey: ["community", community._id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove member");
    },
  });

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      toast.error("Community name is required");
      return;
    }

    const updateData = {
      ...editForm,
      tags: editForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
    };

    updateMutation.mutate(updateData);
  };

  const handleDeleteCommunity = () => {
    if (window.confirm(`Are you sure you want to delete "${community.name}"? This action cannot be undone and will remove all threads and members.`)) {
      deleteMutation.mutate();
    }
  };

  const handleRemoveMember = (memberId, memberName) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the community?`)) {
      removeMemberMutation.mutate(memberId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Manage Community</h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Management Tabs */}
          <div className="tabs tabs-boxed mb-6">
            <button
              className={`tab ${activeManageTab === "settings" ? "tab-active" : ""}`}
              onClick={() => setActiveManageTab("settings")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            <button
              className={`tab ${activeManageTab === "members" ? "tab-active" : ""}`}
              onClick={() => setActiveManageTab("members")}
            >
              <Users className="w-4 h-4 mr-2" />
              Members
            </button>
            <button
              className={`tab ${activeManageTab === "danger" ? "tab-active" : ""}`}
              onClick={() => setActiveManageTab("danger")}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Danger Zone
            </button>
          </div>

          {/* Tab Content */}
          {activeManageTab === "settings" && (
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Community Name</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input input-bordered"
                  maxLength={100}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="textarea textarea-bordered"
                  maxLength={500}
                  rows={3}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tags</span>
                </label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="spanish, language, learning (comma separated)"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Private Community</span>
                  <input
                    type="checkbox"
                    checked={editForm.isPrivate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
                    className="checkbox"
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="btn btn-primary flex-1"
                >
                  {updateMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      Update Community
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeManageTab === "members" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Community Members ({community.members?.length || 0})</h3>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {community.members?.map((member) => {
                  const isCreator = member._id === community.createdBy?._id || member._id === community.createdBy;
                  return (
                    <div key={member._id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar user={member} size="w-10 h-10" />
                        <div>
                          <h4 className="font-medium">{member.fullName}</h4>
                          <p className="text-sm text-base-content/70">
                            {isCreator ? (
                              <span className="flex items-center gap-1">
                                <Crown className="w-3 h-3 text-yellow-500" />
                                Creator
                              </span>
                            ) : (
                              "Member"
                            )}
                          </p>
                        </div>
                      </div>

                      {!isCreator && (
                        <button
                          onClick={() => handleRemoveMember(member._id, member.fullName)}
                          disabled={removeMemberMutation.isPending}
                          className="btn btn-error btn-sm"
                        >
                          <UserMinus className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeManageTab === "danger" && (
            <div className="space-y-6">
              <div className="alert alert-warning">
                <div>
                  <h3 className="font-bold">Danger Zone</h3>
                  <div className="text-xs">These actions are irreversible. Please be careful.</div>
                </div>
              </div>

              <div className="card bg-error/10 border border-error/20">
                <div className="card-body">
                  <h3 className="card-title text-error">Delete Community</h3>
                  <p className="text-sm">
                    Permanently delete this community and all its content. This action cannot be undone.
                    All threads, comments, and member data will be lost.
                  </p>
                  <div className="card-actions justify-end">
                    <button
                      onClick={handleDeleteCommunity}
                      disabled={deleteMutation.isPending}
                      className="btn btn-error"
                    >
                      {deleteMutation.isPending ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Delete Community
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
