import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { searchUsers } from "../lib/api";
import Avatar from "../components/Avatar";
import Tooltip from "../components/Tooltip";
import { Link } from "react-router";

const SearchPage = () => {
  const { authUser } = useAuthUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["searchUsers", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Search</h1>
        
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="flex items-center gap-3 bg-base-200 rounded-lg px-4 py-3">
            <Tooltip text="Search for users">
              <SearchIcon className="w-5 h-5 text-base-content opacity-70" />
            </Tooltip>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-base-content placeholder-base-content/50"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {isLoading && debouncedQuery && (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg" />
            </div>
          )}

          {!isLoading && debouncedQuery && searchResults?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-base-content/70">No users found for "{debouncedQuery}"</p>
            </div>
          )}

          {!debouncedQuery && (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
              <p className="text-base-content/70">Start typing to search for users</p>
            </div>
          )}

          {searchResults?.map((user) => (
            <UserCard key={user._id} user={user} currentUserId={authUser?._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

// User Card Component for Search Results
const UserCard = ({ user, currentUserId }) => {
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
      <div className="card-body p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/profile/${user._id}`}>
              <Avatar user={user} size="w-16 h-16" />
            </Link>
            
            <div>
              <Link to={`/profile/${user._id}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                  {user.fullName}
                </h3>
              </Link>
              {user.bio && (
                <p className="text-sm text-base-content/70 mt-1">{user.bio}</p>
              )}
              {user.location && (
                <p className="text-xs text-base-content/50 mt-1">{user.location}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Link to={`/chat/${user._id}`} className="btn btn-outline btn-sm">
              Message
            </Link>
            <Link to={`/profile/${user._id}`} className="btn btn-primary btn-sm">
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
