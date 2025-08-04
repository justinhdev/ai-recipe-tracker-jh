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
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    }`;

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md dark:shadow-lg px-4 py-3 flex justify-between items-center">
      <div className="text-lg font-semibold text-blue-600">Recipe Forge</div>
      <div className="flex items-center gap-4">
        <Link to="/generate" className={linkStyle("/generate")}>
          Generate
        </Link>
        <Link to="/my-recipes" className={linkStyle("/my-recipes")}>
          My Recipes
        </Link>
        {username && (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Hi, {username}!
          </span>
        )}
        <DarkToggle />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 dark:hover:bg-red-400 text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
