import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import IngredientInput from "../components/IngredientInput";
import RecipeDetails from "../components/RecipeDetails";
import AdvancedOptions from "../components/AdvancedOptions";
import RecipeShimmer from "../components/RecipeShimmer";
import { Wand2 } from "lucide-react";
import { INGREDIENTS } from "../utils/ingredientList";
import { useRecipeActions } from "../hooks/useRecipeActions";
import { toMessage } from "../utils/error";
import type { Recipe, GenerateOptions } from "../types/recipe";

export default function GenerateRecipe() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [options, setOptions] = useState<GenerateOptions>({
    servings: 2,
    diet: "none",
    cuisine: "none",
    mealType: "none",
    bravery: 0.7,
    macroPreference: "none",
  });
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const savingRef = useRef(false);

  const { generate, save } = useRecipeActions();

  const handleSurpriseMe = () => {
    const shuffled = [...INGREDIENTS].sort(() => 0.5 - Math.random());
    setSelectedIngredients(shuffled.slice(0, 4));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setRecipe(null);
    setSaved(false);
    try {
      const r = await generate(selectedIngredients, options);
      setRecipe(r);
    } catch (e: unknown) {
      setError(toMessage(e, "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!recipe || savingRef.current) return;
    savingRef.current = true;
    try {
      await save(recipe);
      setSaved(true);
    } catch (e: unknown) {
      setError(toMessage(e, "Failed to save recipe"));
    } finally {
      savingRef.current = false;
    }
  };

  const twoCol = recipe || loading;

  return (
    <PageWrapper>
      <div
        className={`grid gap-8 items-start ${twoCol ? "md:grid-cols-2" : "grid-cols-1 max-w-xl mx-auto"}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-2xl font-bold mb-4">Generate a Recipe</h2>
          <div className="flex flex-col h-full">
            <div className="flex-grow space-y-4">
              <IngredientInput
                value={selectedIngredients}
                onChange={setSelectedIngredients}
              />
              <AdvancedOptions value={options} onChange={setOptions} />
            </div>

            {error && (
              <p className="text-red-500 dark:text-red-400 mt-4">{error}</p>
            )}

            <div className="mt-auto flex gap-4 pt-4">
              <button
                className={`rounded bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 ${
                  loading ? "cursor-wait" : ""
                }`}
                onClick={handleGenerate}
                disabled={loading || selectedIngredients.length === 0}
              >
                {loading ? "Generating..." : "Generate Recipe"}
              </button>
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Wand2 size={16} />
                Surprise Me
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="shimmer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RecipeShimmer />
            </motion.div>
          ) : recipe ? (
            <RecipeDetails
              recipe={recipe}
              onSave={handleSave}
              disableSave={saved}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
