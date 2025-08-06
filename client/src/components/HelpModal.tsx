import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HelpModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-lg w-full text-sm text-gray-800 dark:text-gray-200 shadow-lg relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-200"
              aria-label="Close Help"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">
              ℹ️ How Recipe Generation Works
            </h2>
            <ul className="space-y-3 list-disc list-inside leading-relaxed">
              <li>
                Enter ingredients like <em>"chicken"</em>, <em>"broccoli"</em>,
                or <em>"olive oil"</em>.
              </li>
              <li>
                Recognized ingredients are shown in{" "}
                <span className="text-blue-600 font-semibold">blue</span>.
              </li>
              <li>
                Custom ingredients are shown in{" "}
                <span className="text-yellow-500 font-semibold">yellow</span>{" "}
                and still work.
              </li>
              <li>
                Click <strong>Generate Recipe</strong> to get a recipe and
                macros.
              </li>
              <li>
                Save recipes to view them later in <strong>My Recipes</strong>.
              </li>
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
