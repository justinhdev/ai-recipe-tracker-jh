import { useState, useRef } from "react";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";
import MacroChart from "../components/MacroChart";
import { motion, AnimatePresence } from "framer-motion";

type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export default function GenerateRecipe() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const savingRef = useRef(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setRecipe(null);
    setSaved(false);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/ai/generate",
        { ingredients: input.split(",").map((i) => i.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecipe(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!recipe || savingRef.current) return;

    savingRef.current = true;

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/recipes", recipe, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(true);
    } catch (err: unknown) {
      console.error("Failed to save recipe", err);
      setError("Failed to save recipe");
    } finally {
      savingRef.current = false;
    }
  };

  return (
    <PageWrapper>
      <motion.div
        layout
        transition={{ duration: 0.4 }}
        className={`grid gap-8 items-start ${
          recipe ? "md:grid-cols-2" : "grid-cols-1 max-w-xl mx-auto"
        }`}
      >
        {/* LEFT: Ingredient Input */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded shadow p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Generate a Recipe</h2>
          <input
            type="text"
            className="w-full px-4 py-3 text-base border rounded mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="e.g. chicken, rice, broccoli"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            className="bg-blue-600 text-white w-full sm:w-auto px-4 py-3 text-base rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 transition"
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
          >
            {loading ? "Generating..." : "Generate Recipe"}
          </button>
          {error && (
            <p className="text-red-500 dark:text-red-400 mt-3">{error}</p>
          )}
        </motion.div>

        {/* RIGHT: Recipe Preview (with animation) */}
        <AnimatePresence>
          {recipe && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded shadow p-6 text-sm sm:text-base"
            >
              <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>

              <p className="mb-2">
                <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
              </p>

              <div className="mb-3">
                <p className="font-medium mb-1">Instructions:</p>
                <ul className="list-decimal list-inside space-y-1">
                  {recipe.instructions
                    .split(/\d+\.\s*/)
                    .filter((step) => step.trim() !== "")
                    .map((step, i) => (
                      <li key={i}>{step.trim()}</li>
                    ))}
                </ul>
              </div>

              <MacroChart
                protein={recipe.protein}
                fat={recipe.fat}
                carbs={recipe.carbs}
              />

              <p className="text-xs text-gray-600 dark:text-gray-300 text-center mt-2">
                {recipe.calories} kcal • {recipe.protein}g protein •{" "}
                {recipe.fat}g fat • {recipe.carbs}g carbs
              </p>

              <div className="mt-4">
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition"
                >
                  {saved ? "Recipe Saved ✅" : "Save Recipe"}
                </button>

                {saved && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-green-600 dark:text-green-400 mt-2 text-sm"
                  >
                    Your recipe has been saved!
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PageWrapper>
  );
}
