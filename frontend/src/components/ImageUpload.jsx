import { useRef, useState } from 'react';
import { CameraIcon, TrashIcon, UploadIcon } from 'lucide-react';
import useImageUpload from '../hooks/useImageUpload';
import Avatar from './Avatar';

/**
 * Image Upload Component for profile pictures
 * @param {Object} props
 * @param {Object} props.user - Current user object
 * @param {Function} props.onRandomAvatar - Function to generate random avatar
 * @param {boolean} props.showRandomButton - Whether to show random avatar button
 */
const ImageUpload = ({ user, onRandomAvatar, showRandomButton = true }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const { 
    uploadFile, 
    deleteProfilePicture, 
    isUploading, 
    isDeleting, 
    uploadProgress 
  } = useImageUpload();

  const hasUploadedAvatar = user?.avatarUrl && user.avatarUrl.trim() !== '';

  const handleFileSelect = (file) => {
    if (file) {
      uploadFile(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteAvatar = () => {
    if (window.confirm('Are you sure you want to remove your profile picture?')) {
      deleteProfilePicture();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Preview */}
      <div className="relative">
        <Avatar 
          user={user} 
          size="size-32" 
          className="ring-4 ring-base-300"
        />
        
        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="text-white text-center">
              <div className="loading loading-spinner loading-md mb-2"></div>
              <div className="text-sm">{uploadProgress}%</div>
            </div>
          </div>
        )}

        {/* Camera Icon Overlay */}
        {!isUploading && (
          <button
            onClick={openFileDialog}
            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 group"
            disabled={isUploading || isDeleting}
          >
            <CameraIcon className="size-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-primary bg-primary bg-opacity-10' 
            : 'border-base-300 hover:border-base-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <UploadIcon className="size-8 mx-auto mb-2 text-base-content opacity-50" />
        <p className="text-sm text-base-content opacity-70 mb-2">
          Drag and drop an image here, or{' '}
          <button
            onClick={openFileDialog}
            className="text-primary hover:underline"
            disabled={isUploading || isDeleting}
          >
            browse files
          </button>
        </p>
        <p className="text-xs text-base-content opacity-50">
          JPEG, PNG, GIF, WebP • Max 5MB
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        {/* Upload Button */}
        <button
          onClick={openFileDialog}
          className={`btn btn-primary ${isUploading ? 'loading' : ''}`}
          disabled={isUploading || isDeleting}
        >
          {!isUploading && <UploadIcon className="size-4 mr-2" />}
          {isUploading ? 'Uploading...' : 'Upload Photo'}
        </button>

        {/* Random Avatar Button */}
        {showRandomButton && onRandomAvatar && (
          <button
            onClick={onRandomAvatar}
            className="btn btn-accent"
            disabled={isUploading || isDeleting}
          >
            <CameraIcon className="size-4 mr-2" />
            Random Avatar
          </button>
        )}

        {/* Delete Button */}
        {hasUploadedAvatar && (
          <button
            onClick={handleDeleteAvatar}
            className={`btn btn-error btn-outline ${isDeleting ? 'loading' : ''}`}
            disabled={isUploading || isDeleting}
          >
            {!isDeleting && <TrashIcon className="size-4 mr-2" />}
            {isDeleting ? 'Removing...' : 'Remove Photo'}
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
