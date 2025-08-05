import { useEffect, useState } from "react";

export default function DarkToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const enabled = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const toggleDark = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    document.documentElement.classList.toggle("dark", newValue);
    localStorage.setItem("theme", newValue ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {isDark ? "Dark" : "Light"}
      </span>
      <button
        onClick={toggleDark}
        aria-label="Toggle dark mode"
        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
          isDark ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isDark ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
