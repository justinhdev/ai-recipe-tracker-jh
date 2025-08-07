import { useState, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";
import MacroChart from "../components/MacroChart";
import { motion, AnimatePresence } from "framer-motion";
import IngredientInput from "../components/IngredientInput";
import { BarChart3, ChevronDown, Wand2 } from "lucide-react";
import RecipeShimmer from "../components/RecipeShimmer";
import { INGREDIENTS } from "../utils/ingredientList";
import { getIcon } from "../utils/getIcon";

type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

const Label = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200"
  >
    {children}
  </label>
);

const Select = ({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full appearance-none cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
      <ChevronDown size={18} />
    </div>
  </div>
);

export default function GenerateRecipe() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [showMacros, setShowMacros] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const savingRef = useRef(false);

  const [servings, setServings] = useState(2);
  const [diet, setDiet] = useState("none");
  const [cuisine, setCuisine] = useState("none");
  const [mealType, setMealType] = useState("none");
  const [bravery, setBravery] = useState(0.7);
  const [macroPreference, setMacroPreference] = useState("none");

  const handleSurpriseMe = () => {
    const shuffled = [...INGREDIENTS].sort(() => 0.5 - Math.random());
    setSelectedIngredients(shuffled.slice(0, 4));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setRecipe(null);
    setSaved(false);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ingredients: selectedIngredients,
        servings,
        diet,
        cuisine,
        mealType,
        bravery,
        macroPreference,
      };
      const res = await axios.post(
        "http://localhost:3000/api/ai/generate",
        payload,
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
        <h3 className="flex items-center justify-center gap-2 text-xl font-semibold mb-2">
          <span>{getIcon(recipe.title)}</span>
          <span>{recipe.title}</span>
        </h3>
        <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Ingredients
        </h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.ingredients.map((item, idx) => (
            <span
              key={idx}
              className="cursor-default rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
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
              className="inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-sm text-blue-500 transition hover:bg-blue-500 hover:text-white dark:text-blue-400"
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
            className={`rounded bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 ${
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
          recipe || loading ? "md:grid-cols-2" : "grid-cols-1 max-w-xl mx-auto"
        }`}
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
              <div className="mb-4">
                <IngredientInput
                  value={selectedIngredients}
                  onChange={setSelectedIngredients}
                />
              </div>
              <div className="mb-4">
                <button
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  className="flex w-full cursor-pointer items-center justify-between text-left text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  <span>Advanced Options</span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-200 ${
                      showAdvanced ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 },
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-6 pt-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="servings">Servings</Label>
                              <input
                                type="number"
                                id="servings"
                                value={servings}
                                onChange={(e) =>
                                  setServings(Number(e.target.value))
                                }
                                min="1"
                                className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="mealType">Meal Type</Label>
                              <Select
                                id="mealType"
                                value={mealType}
                                onChange={(e) => setMealType(e.target.value)}
                              >
                                <option value="none">Any</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Snack">Snack</option>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="diet">Dietary Style</Label>
                              <Select
                                id="diet"
                                value={diet}
                                onChange={(e) => setDiet(e.target.value)}
                              >
                                <option value="none">None</option>
                                <option value="Keto">Keto</option>
                                <option value="Low-Carb">Low-Carb</option>
                                <option value="Vegan">Vegan</option>
                                <option value="Vegetarian">Vegetarian</option>
                                <option value="Carnivore">Carnivore</option>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="cuisine">Cuisine</Label>
                              <Select
                                id="cuisine"
                                value={cuisine}
                                onChange={(e) => setCuisine(e.target.value)}
                              >
                                <option value="none">Any</option>
                                <option value="Mexican">Mexican</option>
                                <option value="Italian">Italian</option>
                                <option value="Asian">Asian</option>
                                <option value="Mediterranean">
                                  Mediterranean
                                </option>
                                <option value="American">American</option>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="macroPreference">
                              Nutrition Goal
                            </Label>
                            <Select
                              id="macroPreference"
                              value={macroPreference}
                              onChange={(e) =>
                                setMacroPreference(e.target.value)
                              }
                            >
                              <option value="none">Balanced</option>
                              <option value="Protein">High Protein</option>
                              <option value="Fat">High Fat</option>
                              <option value="Carbs">High Carbs</option>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <Label htmlFor="bravery">AI Creativity</Label>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {bravery.toFixed(1)}
                            </span>
                          </div>
                          <input
                            type="range"
                            id="bravery"
                            min="0.2"
                            max="1.2"
                            step="0.1"
                            value={bravery}
                            onChange={(e) => setBravery(Number(e.target.value))}
                            className="w-full h-2 rounded-lg cursor-pointer accent-blue-600 dark:accent-blue-500"
                          />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>Focused</span>
                            <span>Adventurous</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {error && (
              <p className="text-red-500 dark:text-red-400 mt-4">{error}</p>
            )}
            <div className="mt-auto flex gap-4 pt-4">
              <button
                className={`rounded bg-blue-600 px-4 py-2 text-white cursor-pointer disabled:cursor-default transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 ${
                  loading ? "cursor-wait" : ""
                }`}
                onClick={handleSubmit}
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
          ) : (
            renderedRecipe
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
