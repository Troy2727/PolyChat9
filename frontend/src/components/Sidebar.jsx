import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import Avatar from "./Avatar";
import { sidebarLinks } from "../constants/navigation";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="PolyChat9 Logo" className="w-12 h-12" />
          <span className="text-3xl font-bold tracking-wider text-white">
            PolyChat9
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive =
            (currentPath.includes(link.route) && link.route.length > 1) ||
            currentPath === link.route;

          const IconComponent = link.icon;

          return (
            <div key={link.route}>
              {link.isDivider && (
                <div className="divider my-2 opacity-30"></div>
              )}
              <Link
                to={link.route}
                className={`btn justify-start w-full gap-3 px-3 normal-case ${
                  link.isSpecial
                    ? "btn-primary"
                    : isActive
                    ? "btn-active"
                    : "btn-ghost"
                }`}
              >
                <IconComponent className="size-5 text-base-content opacity-70" />
                <span>{link.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <Link to="/profile" className="flex items-center gap-3 hover:bg-base-300 p-2 rounded-lg transition-colors">
          <Avatar user={authUser} size="w-10 h-10" />
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};
export default Sidebar;
