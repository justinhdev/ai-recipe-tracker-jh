import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import DarkToggle from "./DarkToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    setUsername(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const linkStyle = (path: string) =>
    `text-sm font-medium px-3 py-1 rounded transition ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white"
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 duration-300"
    }`;

  return (
    <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 px-4 py-3 bg-white dark:bg-gray-900 shadow-md dark:shadow-lg duration-300">
      <div className="text-lg font-semibold text-blue-600">Recipe Forge</div>
      <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
        <Link to="/generate" className={linkStyle("/generate")}>
          Generate
        </Link>
        <Link to="/my-recipes" className={linkStyle("/my-recipes")}>
          My Recipes
        </Link>
        {username && (
          <span className="text-sm text-gray-600 dark:text-gray-300 duration-300">
            Hi, {username}!
          </span>
        )}
        <DarkToggle />
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-400 text-sm transition duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
