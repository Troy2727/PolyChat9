import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SaveIcon, UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { updateProfile, generateRandomAvatar } from "../lib/api";
import ImageUpload from "../components/ImageUpload";
import Tooltip from "../components/Tooltip";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation(formState);
  };

  const handleRandomAvatar = () => {
    const randomAvatar = generateRandomAvatar();
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Tooltip text="Profile Settings">
                <UserIcon className="size-8 text-primary" />
              </Tooltip>
              <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <ImageUpload
                user={authUser}
                onRandomAvatar={handleRandomAvatar}
                showRandomButton={true}
              />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Full Name *</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formState.fullName}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Location */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="Enter your location"
                  />
                </div>

                {/* Native Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select your native language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Italian">Italian</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Russian">Russian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Korean">Korean</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Learning Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Learning Language</span>
                  </label>
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="">Select language you're learning</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Italian">Italian</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Russian">Russian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Korean">Korean</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={formState.bio}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-24"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Tooltip text="Save your profile changes">
                  <button
                    type="submit"
                    className={`btn btn-primary ${isPending ? "loading" : ""}`}
                    disabled={isPending}
                  >
                    {!isPending && <SaveIcon className="size-4 mr-2" />}
                    {isPending ? "Updating..." : "Update Profile"}
                  </button>
                </Tooltip>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
