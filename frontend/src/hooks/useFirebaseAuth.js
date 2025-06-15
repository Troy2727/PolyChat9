import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  signInWithTwitter, 
  signInWithLinkedIn,
  logoutUser,
  onAuthStateChange 
} from '../lib/firebase';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

// LinkedIn OAuth helper function
const getLinkedInAuthUrl = () => {
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/linkedin/callback`);
  const scope = encodeURIComponent('r_liteprofile r_emailaddress');
  const state = Math.random().toString(36).substring(7);
  
  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
};

// Custom hook for Firebase authentication
export const useFirebaseAuth = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setFirebaseUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync Firebase user with backend
  const syncWithBackend = async (firebaseUser, additionalData = {}) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await axiosInstance.post('/auth/firebase-signin', {
        idToken,
        ...additionalData
      });
      return response.data;
    } catch (error) {
      console.error('Backend sync error:', error);
      throw error;
    }
  };

  return {
    firebaseUser,
    isLoading,
    syncWithBackend
  };
};

// Email/Password authentication hooks
export const useEmailAuth = () => {
  const queryClient = useQueryClient();
  const { syncWithBackend } = useFirebaseAuth();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const { user, error } = await signInWithEmail(email, password);
      if (error) throw new Error(error);
      
      // Sync with backend
      await syncWithBackend(user);
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Successfully signed in!');
    },
    onError: (error) => {
      toast.error(error.message || 'Sign in failed');
    }
  });

  const signupMutation = useMutation({
    mutationFn: async ({ email, password, fullName }) => {
      const { user, error } = await signUpWithEmail(email, password);
      if (error) throw new Error(error);
      
      // Sync with backend including full name
      await syncWithBackend(user, { fullName });
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Account created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Sign up failed');
    }
  });

  return {
    loginMutation,
    signupMutation,
    isLoading: loginMutation.isPending || signupMutation.isPending,
    error: loginMutation.error || signupMutation.error
  };
};

// Google authentication hook
export const useGoogleAuth = () => {
  const queryClient = useQueryClient();
  const { syncWithBackend } = useFirebaseAuth();

  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      const { user, error } = await signInWithGoogle();
      if (error) throw new Error(error);
      
      // Sync with backend
      await syncWithBackend(user, { 
        fullName: user.displayName,
        profilePic: user.photoURL 
      });
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Successfully signed in with Google!');
    },
    onError: (error) => {
      toast.error(error.message || 'Google sign in failed');
    }
  });

  return {
    googleSignInMutation,
    isLoading: googleSignInMutation.isPending,
    error: googleSignInMutation.error
  };
};

// Twitter authentication hook
export const useTwitterAuth = () => {
  const queryClient = useQueryClient();
  const { syncWithBackend } = useFirebaseAuth();

  const twitterSignInMutation = useMutation({
    mutationFn: async () => {
      const { user, error } = await signInWithTwitter();
      if (error) throw new Error(error);

      // Try to sync with backend, but don't fail if backend is down
      try {
        await syncWithBackend(user, {
          fullName: user.displayName,
          profilePic: user.photoURL
        });
      } catch (backendError) {
        console.warn('Backend sync failed, but Twitter authentication succeeded:', backendError);
        // Continue with authentication even if backend sync fails
      }
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Successfully signed in with Twitter!');
    },
    onError: (error) => {
      toast.error(error.message || 'Twitter sign in failed');
    }
  });

  return {
    twitterSignInMutation,
    isLoading: twitterSignInMutation.isPending,
    error: twitterSignInMutation.error
  };
};

// LinkedIn authentication hook
export const useLinkedInAuth = () => {
  const queryClient = useQueryClient();
  const { syncWithBackend } = useFirebaseAuth();

  const linkedInSignInMutation = useMutation({
    mutationFn: async () => {
      // Redirect to LinkedIn OAuth
      window.location.href = getLinkedInAuthUrl();
    },
    onError: (error) => {
      toast.error(error.message || 'LinkedIn sign in failed');
    }
  });

  // Handle LinkedIn callback
  const handleLinkedInCallback = useMutation({
    mutationFn: async (authCode) => {
      // Exchange code for custom token via backend
      const response = await axiosInstance.post('/auth/linkedin-exchange', { code: authCode });
      const { customToken } = response.data;
      
      // Sign in with custom token
      const { user, error } = await signInWithLinkedIn(customToken);
      if (error) throw new Error(error);
      
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Successfully signed in with LinkedIn!');
    },
    onError: (error) => {
      toast.error(error.message || 'LinkedIn sign in failed');
    }
  });

  return {
    linkedInSignInMutation,
    handleLinkedInCallback,
    isLoading: linkedInSignInMutation.isPending || handleLinkedInCallback.isPending,
    error: linkedInSignInMutation.error || handleLinkedInCallback.error
  };
};

// Logout hook
export const useFirebaseLogout = () => {
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await logoutUser();
      if (error) throw new Error(error);
      
      // Also logout from backend
      await axiosInstance.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Successfully logged out!');
    },
    onError: (error) => {
      toast.error(error.message || 'Logout failed');
    }
  });

  return {
    logoutMutation,
    isLoading: logoutMutation.isPending,
    error: logoutMutation.error
  };
};
