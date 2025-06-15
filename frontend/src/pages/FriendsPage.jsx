import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import { capitialize } from "../lib/utils";
import { getLanguageFlag, getLanguageByName } from "../lib/languageUtils";
import { LANGUAGE_TO_FLAG } from "../constants";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import Avatar from "../components/Avatar";

const FriendsPage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    if (outgoingFriendReqs) {
      const ids = new Set(outgoingFriendReqs.map((req) => req.recipient._id));
      setOutgoingRequestsIds(ids);
    }
  }, [outgoingFriendReqs]);

  const handleSendRequest = (userId) => {
    sendRequestMutation(userId);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* RECOMMENDED USERS SECTION */}
        <div className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Discover Language Partners</h3>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h4 className="font-semibold text-lg mb-2">No recommendations available</h4>
              <p className="text-base-content opacity-70">
                Check back later for new language learning partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendedUsers.map((user) => (
                <div key={user._id} className="card bg-base-200 hover:shadow-md transition-shadow">
                  <div className="card-body p-4">
                    {/* USER INFO */}
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar user={user} size="size-12" />
                      <h4 className="font-semibold truncate">{user.fullName}</h4>
                    </div>

                    {/* LOCATION */}
                    {user.location && (
                      <div className="flex items-center gap-1 mb-2 text-sm text-base-content opacity-70">
                        <MapPinIcon className="h-3 w-3" />
                        <span>{user.location}</span>
                      </div>
                    )}

                    {/* LANGUAGES */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="badge badge-secondary text-xs">
                        <img
                          src={`https://flagcdn.com/24x18/${LANGUAGE_TO_FLAG[user.nativeLanguage?.toLowerCase()] || 'gb'}.png`}
                          alt={`${user.nativeLanguage} flag`}
                          className="h-3 mr-1 inline-block"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        Native: {user.nativeLanguage}
                      </span>
                      <span className="badge badge-outline text-xs">
                        <img
                          src={`https://flagcdn.com/24x18/${LANGUAGE_TO_FLAG[user.learningLanguage?.toLowerCase()] || 'gb'}.png`}
                          alt={`${user.learningLanguage} flag`}
                          className="h-3 mr-1 inline-block"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        Learning: {user.learningLanguage}
                      </span>
                    </div>

                    {/* INTERESTS */}
                    {user.interests && user.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {user.interests.slice(0, 3).map((interest, index) => (
                          <span key={index} className="badge badge-ghost text-xs">
                            {capitialize(interest)}
                          </span>
                        ))}
                        {user.interests.length > 3 && (
                          <span className="badge badge-ghost text-xs">
                            +{user.interests.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* ACTION BUTTON */}
                    <button
                      className={`btn w-full ${
                        outgoingRequestsIds.has(user._id)
                          ? "btn-success btn-disabled"
                          : "btn-primary"
                      }`}
                      onClick={() => handleSendRequest(user._id)}
                      disabled={isPending || outgoingRequestsIds.has(user._id)}
                    >
                      {outgoingRequestsIds.has(user._id) ? (
                        <>
                          <CheckCircleIcon className="mr-2 size-4" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="mr-2 size-4" />
                          Send Friend Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
