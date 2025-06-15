import { useState } from 'react';

/**
 * Smart Avatar component that displays uploaded photo with random avatar fallback
 * @param {Object} props
 * @param {Object} props.user - User object with avatar data
 * @param {string} props.size - Size class (e.g., 'w-10 h-10', 'size-16')
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.alt - Alt text for the image
 */
const Avatar = ({ user, size = 'w-10 h-10', className = '', alt }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Determine which avatar to display
  const getAvatarUrl = () => {
    if (!user) {
      return 'https://avatar.iran.liara.run/public/1.png';
    }



    // Priority 1: Explicitly uploaded avatar (from file upload)
    if (user.avatarUrl && user.avatarUrl.trim() !== '') {

      return user.avatarUrl;
    }

    // Priority 2: Social login profile picture (Google, Twitter, etc.)
    if (user.profilePic) {
      const pic = user.profilePic;
      // Check if it's a generated avatar (not a real photo)
      const isGeneratedAvatar = pic.includes('avatar.iran.liara.run') ||
                               pic.includes('api.dicebear.com') ||
                               pic.includes('robohash.org') ||
                               pic.includes('ui-avatars.com');

      // If it's a real photo (from Google, Twitter, etc.), use it
      if (!isGeneratedAvatar) {

        return pic;
      }
    }

    // Priority 3: Random avatar URL (fallback for generated avatars)
    if (user.randomAvatarUrl) {
      return user.randomAvatarUrl;
    }

    // Priority 4: Any profilePic (including generated ones)
    if (user.profilePic) {
      return user.profilePic;
    }

    // Default fallback
    return 'https://avatar.iran.liara.run/public/1.png';
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const avatarUrl = getAvatarUrl();
  const displayName = user?.fullName || user?.name || 'User';

  return (
    <div className={`avatar ${className}`}>
      <div className={`${size} rounded-full bg-base-300 overflow-hidden relative`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-300">
            <div className="loading loading-spinner loading-sm"></div>
          </div>
        )}
        <img
          src={avatarUrl}
          alt={alt || `${displayName}'s avatar`}
          className="w-full h-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
};

export default Avatar;
