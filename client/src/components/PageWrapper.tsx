import Navbar from "./Navbar";
import type { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-28 px-4 sm:px-6 max-w-screen-xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        {children}
      </div>
    </>
  );
}
