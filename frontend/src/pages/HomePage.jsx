import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
  getThreads,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, PlusCircleIcon, TrendingUp, MessageCircle } from "lucide-react";

import { capitialize } from "../lib/utils";
import { getLanguageFlag, getLanguageByName } from "../lib/languageUtils";
import { LANGUAGE_TO_FLAG } from "../constants";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import Avatar from "../components/Avatar";
import ThreadCard from "../components/cards/ThreadCard";
import useAuthUser from "../hooks/useAuthUser";

const HomePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState("friends"); // friends, community, recommended

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

  const { data: threads = [], isLoading: loadingThreads } = useQuery({
    queryKey: ["threads"],
    queryFn: () => getThreads("all"),
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* Header with Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">PolyChat9 Home</h2>
          <div className="flex gap-2">
            <Link to="/notifications" className="btn btn-outline btn-sm">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
            <Link to="/create-thread" className="btn btn-primary btn-sm">
              <PlusCircleIcon className="w-4 h-4" />
              Create Thread
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === "friends" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("friends")}
          >
            Your Friends
          </button>
          <button
            className={`tab ${activeTab === "community" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("community")}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Community Feed
          </button>
          <button
            className={`tab ${activeTab === "recommended" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("recommended")}
          >
            Meet New Learners
          </button>
        </div>

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <section>
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
          </section>
        )}

        {/* Community Feed Tab */}
        {activeTab === "community" && (
          <section>
            {loadingThreads ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : !threads || threads.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No threads yet</h3>
                <p className="text-base-content/70 mb-6">
                  Be the first to start a conversation in the community!
                </p>
                <Link to="/create-thread" className="btn btn-primary">
                  <PlusCircleIcon className="w-5 h-5" />
                  Create Your First Thread
                </Link>
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
          </section>
        )}

        {/* Recommended Users Tab */}
        {activeTab === "recommended" && (
          <section>
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                  <p className="opacity-70">
                    Discover perfect language exchange partners based on your profile
                  </p>
                </div>
              </div>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="card bg-base-200 p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
                <p className="text-base-content opacity-70">
                  Check back later for new language partners!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedUsers.map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="card-body p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar user={user} size="size-16" />

                          <div>
                            <h3 className="font-semibold text-lg">{user.fullName}</h3>
                            {user.location && (
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <MapPinIcon className="size-3 mr-1" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Languages with flags */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="badge badge-secondary">
                            <img
                              src={`https://flagcdn.com/24x18/${LANGUAGE_TO_FLAG[user.nativeLanguage?.toLowerCase()] || 'gb'}.png`}
                              alt={`${user.nativeLanguage} flag`}
                              className="h-3 mr-1 inline-block"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                            Native: {capitialize(user.nativeLanguage)}
                          </span>
                          <span className="badge badge-outline">
                            <img
                              src={`https://flagcdn.com/24x18/${LANGUAGE_TO_FLAG[user.learningLanguage?.toLowerCase()] || 'gb'}.png`}
                              alt={`${user.learningLanguage} flag`}
                              className="h-3 mr-1 inline-block"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                            Learning: {capitialize(user.learningLanguage)}
                          </span>
                        </div>

                        {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                        {/* Action button */}
                        <button
                          className={`btn w-full mt-2 ${
                            hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                          } `}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="size-4 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4 mr-2" />
                              Send Friend Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
