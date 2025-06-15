import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import Avatar from "./Avatar";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar user={friend} size="size-12" />
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            <img
              src={`https://flagcdn.com/24x18/${LANGUAGE_TO_FLAG[friend.nativeLanguage?.toLowerCase()] || 'gb'}.png`}
              alt={`${friend.nativeLanguage} flag`}
              className="h-3 mr-1 inline-block"
              onError={(e) => e.target.style.display = 'none'}
            />
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            <img
              src={`https://flagcdn.com/24x18/${LANGUAGE_TO_FLAG[friend.learningLanguage?.toLowerCase()] || 'gb'}.png`}
              alt={`${friend.learningLanguage} flag`}
              className="h-3 mr-1 inline-block"
              onError={(e) => e.target.style.display = 'none'}
            />
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

// Removed getLanguageFlag function - now using the one from languageUtils
