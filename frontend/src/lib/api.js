import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (resetData) => {
  const response = await axiosInstance.post("/auth/reset-password", resetData);
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await axiosInstance.put("/auth/profile", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

// Avatar/Image upload functions
export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);

  const response = await axiosInstance.post("/upload/profile-picture", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProfilePicture = async () => {
  const response = await axiosInstance.delete("/upload/profile-picture");
  return response.data;
};

export const generateRandomAvatar = () => {
  const idx = Math.floor(Math.random() * 100) + 1;
  return `https://avatar.iran.liara.run/public/${idx}.png`;
};

// Thread API functions
export const getThreads = async (filter = "all") => {
  const response = await axiosInstance.get(`/threads?filter=${filter}`);
  return response.data;
};

export const getThread = async (threadId) => {
  const response = await axiosInstance.get(`/threads/${threadId}`);
  return response.data;
};

export const createThread = async (threadData) => {
  const response = await axiosInstance.post("/threads", threadData);
  return response.data;
};

export const addComment = async (threadId, content) => {
  const response = await axiosInstance.post(`/threads/${threadId}/comments`, { content });
  return response.data;
};

export const likeThread = async (threadId) => {
  const response = await axiosInstance.post(`/threads/${threadId}/like`);
  return response.data;
};

export const repostThread = async (threadId) => {
  const response = await axiosInstance.post(`/threads/${threadId}/repost`);
  return response.data;
};

export const deleteThread = async (threadId) => {
  const response = await axiosInstance.delete(`/threads/${threadId}`);
  return response.data;
};

export const voteThread = async (threadId, voteType) => {
  const response = await axiosInstance.post(`/threads/${threadId}/vote`, { voteType });
  return response.data;
};

export const bookmarkThread = async (threadId) => {
  const response = await axiosInstance.post(`/threads/${threadId}/bookmark`);
  return response.data;
};

export const editThread = async (threadId, content) => {
  const response = await axiosInstance.put(`/threads/${threadId}`, { content });
  return response.data;
};

// Search API functions
export const searchUsers = async (query) => {
  if (!query.trim()) return [];
  const response = await axiosInstance.get(`/users/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await axiosInstance.get(`/users/profile/${userId}`);
  return response.data;
};

// Communities API functions
export const getCommunities = async (searchQuery = "") => {
  const response = await axiosInstance.get(`/communities?q=${encodeURIComponent(searchQuery)}`);
  return response.data;
};

export const getCommunity = async (communityId) => {
  const response = await axiosInstance.get(`/communities/${communityId}`);
  return response.data;
};

export const joinCommunity = async (communityId) => {
  const response = await axiosInstance.post(`/communities/${communityId}/join`);
  return response.data;
};

export const leaveCommunity = async (communityId) => {
  const response = await axiosInstance.post(`/communities/${communityId}/leave`);
  return response.data;
};

export const createCommunity = async (communityData) => {
  const response = await axiosInstance.post("/communities", communityData);
  return response.data;
};

export const updateCommunity = async (communityId, updateData) => {
  const response = await axiosInstance.put(`/communities/${communityId}`, updateData);
  return response.data;
};

export const deleteCommunity = async (communityId) => {
  const response = await axiosInstance.delete(`/communities/${communityId}`);
  return response.data;
};

export const removeMemberFromCommunity = async (communityId, memberId) => {
  const response = await axiosInstance.post(`/communities/${communityId}/remove-member`, { memberId });
  return response.data;
};

// Activity/Notifications API functions
export const getNotifications = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};
