export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const generateAvatarUrl = (userId, type = 'avataaars') => {
  const seed = userId || 'default';

  const avatarTypes = {
    avataaars: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
    bottts: `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`,
    identicon: `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`,
    robohash: `https://robohash.org/${seed}?set=set1&size=200x200`,
  };

  return avatarTypes[type] || avatarTypes.avataaars;
};

// Date formatting utility from Threads app
export const formatDateString = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
};

// Thread count formatting utility from Threads app
export const formatThreadCount = (count) => {
  if (count === 0) {
    return "No Threads";
  } else {
    const threadCount = count.toString().padStart(2, "0");
    const threadWord = count === 1 ? "Thread" : "Threads";
    return `${threadCount} ${threadWord}`;
  }
};
