// client/src/components/Navbar.tsx
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

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
    `text-sm font-medium px-3 py-1 rounded ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="w-full bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <div className="text-lg font-semibold text-blue-600">Recipe Forge</div>
      <div className="flex items-center gap-4">
        <Link to="/generate" className={linkStyle("/generate")}>
          Generate
        </Link>
        <Link to="/my-recipes" className={linkStyle("/my-recipes")}>
          My Recipes
        </Link>
        {username && (
          <span className="text-sm text-gray-600">Hi, {username}!</span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
