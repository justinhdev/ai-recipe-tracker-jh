import { useState, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";
import MacroChart from "../components/MacroChart";
import { motion, AnimatePresence } from "framer-motion";
import IngredientInput from "../components/IngredientInput";
import { BarChart3 } from "lucide-react";

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
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [showMacros, setShowMacros] = useState(false);
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
        { ingredients: selectedIngredients },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  const handleSave = useCallback(async () => {
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
  }, [recipe]);

  const renderedRecipe = useMemo(() => {
    if (!recipe) return null;

    const stepMatches = recipe.instructions.match(
      /Step \d+\..*?(?=Step \d+\.|$)/g
    );

    return (
      <motion.div
        key={recipe.title}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-sm sm:text-base"
      >
        <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>

        <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Ingredients
        </h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.ingredients.map((item, idx) => (
            <span
              key={idx}
              className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-default"
            >
              {item}
            </span>
          ))}
        </div>

        <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mt-4 mb-2">
          Instructions
        </h4>
        <div className="space-y-2">
          {stepMatches?.map((step, i) => {
            const splitIndex = step.indexOf(". ");
            const stepText = step.slice(splitIndex + 2);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-2"
              >
                <div className="flex-none w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white text-xs flex items-center justify-center">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {stepText}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1">
            {recipe.calories} kcal • {recipe.protein}g protein • {recipe.fat}g
            fat • {recipe.carbs}g carbs
          </p>

          <div className="text-center mt-2">
            <button
              onClick={() => setShowMacros((prev) => !prev)}
              className="inline-flex items-center gap-1 text-sm text-blue-500 dark:text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1 rounded-full transition cursor-pointer"
              title={
                showMacros ? "Hide Nutrition Chart" : "Show Nutrition Chart"
              }
            >
              <BarChart3 size={18} />
              <span>{showMacros ? "Hide Chart" : "Show Chart"}</span>
            </button>
          </div>

          <AnimatePresence>
            {showMacros && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="mt-4"
              >
                <MacroChart
                  protein={recipe.protein}
                  fat={recipe.fat}
                  carbs={recipe.carbs}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 ${
              saved ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            }`}
          >
            {saved ? "Recipe Saved" : "Save Recipe"}
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
    );
  }, [recipe, showMacros, handleSave, saved]);

  return (
    <PageWrapper>
      <div
        className={`grid gap-8 items-start ${
          recipe ? "md:grid-cols-2" : "grid-cols-1 max-w-xl mx-auto"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-2xl font-bold mb-4">Generate a Recipe</h2>
          <div className="space-y-4">
            <IngredientInput onChange={setSelectedIngredients} />

            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

            <button
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 ${loading ? "cursor-wait" : "cursor-pointer"}`}
              onClick={handleSubmit}
              disabled={loading || selectedIngredients.length === 0}
            >
              {loading ? "Generating..." : "Generate Recipe"}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>{renderedRecipe}</AnimatePresence>
      </div>
    </PageWrapper>
  );
}
