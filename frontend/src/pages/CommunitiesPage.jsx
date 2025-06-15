import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SearchIcon, Users, Plus, X, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { getCommunities, createCommunity, joinCommunity, leaveCommunity } from "../lib/api";
import Avatar from "../components/Avatar";
import Tooltip from "../components/Tooltip";
import { Link } from "react-router";

const CommunitiesPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);



  const { data: communities, isLoading } = useQuery({
    queryKey: ["communities", searchQuery],
    queryFn: () => getCommunities(searchQuery),
    enabled: !!authUser,
  });

  const createCommunityMutation = useMutation({
    mutationFn: (data) => {
      console.log("Mutation called with data:", data);
      return createCommunity(data);
    },
    onSuccess: (data) => {
      console.log("Community created successfully:", data);
      toast.success("Community created successfully!");
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      setShowCreateModal(false);
    },
    onError: (error) => {
      console.error("Error creating community:", error);
      toast.error(error.message || "Failed to create community");
    },
  });

  const joinCommunityMutation = useMutation({
    mutationFn: joinCommunity,
    onSuccess: () => {
      toast.success("Joined community successfully!");
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to join community");
    },
  });

  const leaveCommunityMutation = useMutation({
    mutationFn: leaveCommunity,
    onSuccess: () => {
      toast.success("Left community successfully!");
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
    onError: (error) => {
      console.error("Leave community error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to leave community";
      toast.error(errorMessage);
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Communities</h1>
          <Tooltip text="Create a new community">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-5 h-5" />
              Create Community
            </button>
          </Tooltip>
        </div>



        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="flex items-center gap-3 bg-base-200 rounded-lg px-4 py-3">
            <SearchIcon className="w-5 h-5 text-base-content opacity-70" />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-base-content placeholder-base-content/50"
            />
          </div>
        </div>

        {/* Communities Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : !communities || communities.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No communities found</h3>
            <p className="text-base-content/70 mb-6">
              {searchQuery 
                ? `No communities found for "${searchQuery}"`
                : "Be the first to create a community!"
              }
            </p>
            <button className="btn btn-primary">
              <Plus className="w-5 h-5" />
              Create Community
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <CommunityCard
                key={community._id}
                community={community}
                onJoin={() => joinCommunityMutation.mutate(community._id)}
                onLeave={() => leaveCommunityMutation.mutate(community._id)}
                isJoining={joinCommunityMutation.isPending}
                isLeaving={leaveCommunityMutation.isPending}
              />
            ))}
          </div>
        )}

        {/* Create Community Modal */}
        {showCreateModal && (
          <CreateCommunityModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={(data) => createCommunityMutation.mutate(data)}
            isLoading={createCommunityMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

// Create Community Modal Component
const CreateCommunityModal = ({ onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    image: "",
    tags: "",
    isPrivate: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    if (!formData.name.trim() || !formData.username.trim()) {
      toast.error("Name and username are required");
      return;
    }

    const submitData = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
    };

    console.log("Submitting data:", submitData);
    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Create Community</h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Community Name *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Spanish Learners"
                className="input input-bordered"
                maxLength={100}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Username *</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g., spanish-learners"
                className="input input-bordered"
                maxLength={50}
                pattern="[a-z0-9\-]+"
                title="Only lowercase letters, numbers, and hyphens allowed"
                required
              />
              <label className="label">
                <span className="label-text-alt">Only lowercase letters, numbers, and hyphens</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Describe your community..."
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
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="spanish, language, learning (comma separated)"
                className="input input-bordered"
              />
              <label className="label">
                <span className="label-text-alt">Separate tags with commas</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Private Community</span>
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleChange}
                  className="checkbox"
                />
              </label>
              <label className="label">
                <span className="label-text-alt">Private communities require approval to join</span>
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
                disabled={isLoading}
                className="btn btn-primary flex-1"
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Community
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Community Avatar Component
const CommunityAvatar = ({ community, size = "w-16 h-16" }) => {
  const { authUser } = useAuthUser();

  const getAvatarUrl = () => {
    // Priority 1: Community has its own image
    if (community.image) {
      return community.image;
    }

    // Priority 2: If current user is the creator, use their current avatar
    const isCreator = community.createdBy?._id === authUser?._id || community.createdBy === authUser?._id;
    if (isCreator && authUser) {
      // Use the same logic as the main Avatar component
      if (authUser.avatarUrl && authUser.avatarUrl.trim() !== '') {
        return authUser.avatarUrl;
      }

      if (authUser.profilePic) {
        const pic = authUser.profilePic;
        const isGeneratedAvatar = pic.includes('avatar.iran.liara.run') ||
                                 pic.includes('api.dicebear.com') ||
                                 pic.includes('robohash.org') ||
                                 pic.includes('ui-avatars.com');

        if (!isGeneratedAvatar) {
          return pic;
        }
      }

      if (authUser.randomAvatarUrl) {
        return authUser.randomAvatarUrl;
      }
    }

    // Priority 3: Use creator's avatar from community data
    if (community.createdBy?.avatarUrl) {
      return community.createdBy.avatarUrl;
    }

    if (community.createdBy?.profilePic) {
      return community.createdBy.profilePic;
    }

    // Priority 4: Generate community-specific avatar based on name
    const communityName = community.name || community.username || 'Community';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(communityName)}&background=random&color=fff&size=200`;
  };

  return (
    <div className="avatar">
      <div className={`${size} rounded-full bg-base-300 overflow-hidden`}>
        <img
          src={getAvatarUrl()}
          alt={`${community.name} avatar`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

// Community Card Component
const CommunityCard = ({ community, onJoin, onLeave, isJoining, isLeaving }) => {
  const { authUser } = useAuthUser();

  // Check if current user is the creator
  const isCreator = community.createdBy?._id === authUser?._id || community.createdBy === authUser?._id;
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
      <div className="card-body p-6">
        <div className="flex items-center gap-4 mb-4">
          <CommunityAvatar community={community} size="w-16 h-16" />
          <div className="flex-1">
            <Link to={`/communities/${community._id}`}>
              <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                {community.name}
              </h3>
            </Link>
            <p className="text-sm text-base-content/70">
              @{community.username || community.name.toLowerCase().replace(/\s+/g, '')}
            </p>
          </div>
        </div>

        {community.bio && (
          <p className="text-sm text-base-content/80 mb-4 line-clamp-3">
            {community.bio}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-base-content/70">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {community.memberCount || 0} members
            </span>
            <span>
              {community.threadCount || 0} threads
            </span>
          </div>
          
          <div className="flex gap-2">
            {community.isMember ? (
              isCreator ? (
                <button className="btn btn-outline btn-sm" disabled>
                  Creator
                </button>
              ) : (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={onLeave}
                  disabled={isLeaving}
                >
                  {isLeaving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Leaving...
                    </>
                  ) : (
                    "Leave"
                  )}
                </button>
              )
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={onJoin}
                disabled={isJoining}
              >
                {isJoining ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Joining...
                  </>
                ) : (
                  "Join"
                )}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-base-300">
          <Link 
            to={`/communities/${community._id}`}
            className="btn btn-ghost btn-sm w-full"
          >
            View Community
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunitiesPage;
