import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

/**
 * Hook for handling image uploads
 */
const useImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  // Upload profile picture mutation
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await axiosInstance.post('/upload/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Profile picture uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      setUploadProgress(0);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to upload image';
      toast.error(message);
      setUploadProgress(0);
    },
  });

  // Delete profile picture mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete('/upload/profile-picture');
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profile picture removed successfully!');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to remove image';
      toast.error(message);
    },
  });

  // File validation
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!file) {
      toast.error('Please select a file');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, GIF, and WebP images are allowed');
      return false;
    }

    return true;
  };

  // Upload file with validation
  const uploadFile = (file) => {
    if (validateFile(file)) {
      uploadMutation.mutate(file);
    }
  };

  // Delete profile picture
  const deleteProfilePicture = () => {
    deleteMutation.mutate();
  };

  return {
    uploadFile,
    deleteProfilePicture,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    uploadProgress,
    uploadError: uploadMutation.error,
    deleteError: deleteMutation.error,
  };
};

export default useImageUpload;
