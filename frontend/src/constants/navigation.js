import { 
  HomeIcon, 
  SearchIcon, 
  BellIcon, 
  PlusCircleIcon, 
  UsersIcon, 
  UserIcon,
  MessageCircleIcon 
} from "lucide-react";

export const sidebarLinks = [
  {
    icon: HomeIcon,
    route: "/",
    label: "Home",
  },
  {
    icon: SearchIcon,
    route: "/search",
    label: "Search",
  },
  {
    icon: BellIcon,
    route: "/activity",
    label: "Activity",
  },
  {
    icon: PlusCircleIcon,
    route: "/create-thread",
    label: "Create Thread",
    isSpecial: true, // Special styling for create button
  },
  {
    icon: UsersIcon,
    route: "/communities",
    label: "Communities",
  },
  {
    icon: UserIcon,
    route: "/profile",
    label: "Profile",
  },
  {
    icon: MessageCircleIcon,
    route: "/friends",
    label: "Chat & Friends",
    isDivider: true, // Add divider before this item
  },
];

export const profileTabs = [
  { value: "threads", label: "Threads", icon: "reply" },
  { value: "replies", label: "Replies", icon: "users" },
  { value: "tagged", label: "Tagged", icon: "tag" },
];

export const communityTabs = [
  { value: "threads", label: "Threads", icon: "reply" },
  { value: "members", label: "Members", icon: "users" },
  { value: "requests", label: "Requests", icon: "user-plus" },
];
