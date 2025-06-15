import { useQuery } from "@tanstack/react-query";
import { BellIcon, MessageCircle, Heart, UserPlus } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { getNotifications } from "../lib/api";
import Avatar from "../components/Avatar";
import Tooltip from "../components/Tooltip";
import { Link } from "react-router";
import { formatDateString } from "../lib/utils";

const ActivityPage = () => {
  const { authUser } = useAuthUser();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: !!authUser,
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case "like":
        return (
          <Tooltip text="Like notification">
            <Heart className="w-5 h-5 text-red-500" />
          </Tooltip>
        );
      case "comment":
        return (
          <Tooltip text="Comment notification">
            <MessageCircle className="w-5 h-5 text-blue-500" />
          </Tooltip>
        );
      case "follow":
        return (
          <Tooltip text="Follow notification">
            <UserPlus className="w-5 h-5 text-green-500" />
          </Tooltip>
        );
      case "friend_request":
        return (
          <Tooltip text="Friend request notification">
            <UserPlus className="w-5 h-5 text-purple-500" />
          </Tooltip>
        );
      default:
        return (
          <Tooltip text="General notification">
            <BellIcon className="w-5 h-5 text-gray-500" />
          </Tooltip>
        );
    }
  };

  const getActivityMessage = (notification) => {
    switch (notification.type) {
      case "like":
        return "liked your thread";
      case "comment":
        return "commented on your thread";
      case "follow":
        return "started following you";
      case "friend_request":
        return "sent you a friend request";
      default:
        return "interacted with your content";
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Activity</h1>
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Activity</h1>

        {!notifications || notifications.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No activity yet</h3>
            <p className="text-base-content/70">
              When someone interacts with your content, you'll see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <ActivityCard 
                key={notification._id} 
                notification={notification}
                getActivityIcon={getActivityIcon}
                getActivityMessage={getActivityMessage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Activity Card Component
const ActivityCard = ({ notification, getActivityIcon, getActivityMessage }) => {
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
      <div className="card-body p-6">
        <div className="flex items-start gap-4">
          <Link to={`/profile/${notification.from._id}`}>
            <Avatar user={notification.from} size="w-12 h-12" />
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getActivityIcon(notification.type)}
              <div>
                <Link 
                  to={`/profile/${notification.from._id}`}
                  className="font-semibold hover:text-primary transition-colors"
                >
                  {notification.from.fullName}
                </Link>
                <span className="text-base-content/70 ml-2">
                  {getActivityMessage(notification)}
                </span>
              </div>
            </div>
            
            {notification.thread && (
              <Link 
                to={`/thread/${notification.thread._id}`}
                className="block mt-2 p-3 bg-base-300 rounded-lg hover:bg-base-300/80 transition-colors"
              >
                <p className="text-sm text-base-content/80 line-clamp-2">
                  {notification.thread.content}
                </p>
              </Link>
            )}
            
            <p className="text-xs text-base-content/50 mt-2">
              {formatDateString(notification.createdAt)}
            </p>
          </div>

          {notification.type === "friend_request" && !notification.isRead && (
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm">Accept</button>
              <button className="btn btn-outline btn-sm">Decline</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
