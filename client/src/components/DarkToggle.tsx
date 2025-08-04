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
    <button
      onClick={toggleDark}
      aria-label="Toggle dark mode"
      className={`w-10 h-5 flex items-center rounded-full transition-colors duration-300 ${
        isDark ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
          isDark ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}
