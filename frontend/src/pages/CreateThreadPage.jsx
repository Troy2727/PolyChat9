import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { PlusCircleIcon, ImageIcon, X, Users } from "lucide-react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { createThread, getCommunities } from "../lib/api";
import Avatar from "../components/Avatar";
import Tooltip from "../components/Tooltip";

const CreateThreadPage = () => {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  // Get communities for selection
  const { data: communities = [] } = useQuery({
    queryKey: ["communities"],
    queryFn: () => getCommunities(),
  });

  // Check if community is specified in URL params
  useEffect(() => {
    const communityId = searchParams.get("community");
    if (communityId && communities.length > 0) {
      const community = communities.find(c => c._id === communityId);
      if (community) {
        setSelectedCommunity(community);
      }
    }
  }, [searchParams, communities]);

  const createThreadMutation = useMutation({
    mutationFn: createThread,
    onSuccess: () => {
      toast.success("Thread created successfully!");
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      queryClient.invalidateQueries({ queryKey: ["communityThreads"] });

      // Navigate back to community if thread was posted there
      if (selectedCommunity) {
        navigate(`/communities/${selectedCommunity._id}`);
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create thread");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Please enter some content for your thread");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createThreadMutation.mutateAsync({
        content: content.trim(),
        images,
        community: selectedCommunity?._id || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, {
            file,
            preview: e.target.result,
            id: Date.now() + Math.random()
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Create Thread</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar user={authUser} size="w-12 h-12" />
            <div>
              <h3 className="font-semibold">{authUser?.fullName}</h3>
              <p className="text-sm text-base-content/70">Share your thoughts...</p>
            </div>
          </div>

          {/* Community Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Post to Community (Optional)</span>
            </label>
            <select
              value={selectedCommunity?._id || ""}
              onChange={(e) => {
                const community = communities.find(c => c._id === e.target.value);
                setSelectedCommunity(community || null);
              }}
              className="select select-bordered w-full"
            >
              <option value="">General Feed</option>
              {communities
                .filter(community => community.isMember)
                .map((community) => (
                  <option key={community._id} value={community._id}>
                    {community.name}
                  </option>
                ))}
            </select>
            {selectedCommunity && (
              <div className="label">
                <span className="label-text-alt flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Posting to {selectedCommunity.name}
                </span>
              </div>
            )}
          </div>

          {/* Content Input */}
          <div className="form-control">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={selectedCommunity ? `Share something with ${selectedCommunity.name}...` : "What's on your mind?"}
              className="textarea textarea-bordered min-h-32 text-base resize-none"
              maxLength={500}
            />
            <div className="label">
              <span className="label-text-alt text-base-content/50">
                {content.length}/500 characters
              </span>
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Add Images (Optional)</span>
            </label>
            
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input file-input-bordered w-full"
            />
            
            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {images.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Tooltip text="Remove image">
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-base-300">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            
            <Tooltip text="Create your thread">
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusCircleIcon className="w-5 h-5" />
                    Create Thread
                  </>
                )}
              </button>
            </Tooltip>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateThreadPage;
