import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Anvil } from "lucide-react";
import DarkToggle from "./DarkToggle";
import HelpModal from "./HelpModal";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showHelp, setShowHelp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <nav className="z-10 relative bg-white dark:bg-gray-900 shadow-md dark:shadow-lg duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg text-blue-600 group hover:cursor-pointer"
        >
          <Anvil
            size={20}
            className="text-blue-600 dark:text-blue-400 transition-transform duration-200 group-hover:scale-110"
          />
          <span className="transition-opacity duration-200 group-hover:opacity-90">
            Recipe Forge
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-4">
          <Link to="/generate" className={linkStyle("/generate")}>
            Generate
          </Link>
          <Link to="/my-recipes" className={linkStyle("/my-recipes")}>
            My Recipes
          </Link>

          <div className="w-px h-4 bg-gray-400 opacity-30" />

          <DarkToggle />
          <button
            onClick={() => setShowHelp(true)}
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Help
          </button>
          <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

          <div className="w-px h-4 bg-gray-400 opacity-30" />

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 dark:hover:bg-red-400 text-sm transition duration-300"
          >
            Logout
          </button>
        </div>

        <button
          className="sm:hidden text-gray-700 dark:text-gray-300"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            transition={{ duration: 0.2 }}
            className="sm:hidden px-4 pb-6 pt-2 flex flex-col items-stretch gap-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <Link
              to="/generate"
              onClick={() => setMenuOpen(false)}
              className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Generate
            </Link>
            <Link
              to="/my-recipes"
              onClick={() => setMenuOpen(false)}
              className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              My Recipes
            </Link>

            <div className="pl-4">
              <DarkToggle />
            </div>

            <button
              onClick={() => {
                setShowHelp(true);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Help
            </button>

            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-400"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </nav>
  );
}
