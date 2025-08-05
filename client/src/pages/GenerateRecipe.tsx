import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

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

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setRecipe(null);

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
    if (!recipe) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/recipes", recipe, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.data || err.message);
      } else {
        console.error("Unknown error:", err);
      }
      setError("Failed to save recipe");
    }
  };

  return (
    <>
      <Navbar />
      {
        <div className="max-w-2xl mx-auto p-4 dark:bg-gray-900 dark:text-white transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4">Generate a Recipe</h2>
          <input
            type="text"
            className="w-full p-2 border rounded mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
            placeholder="Enter ingredients, separated by commas..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 transition-colors duration-300"
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
          >
            {loading ? "Generating..." : "Generate Recipe"}
          </button>

          {error && (
            <p className="text-red-500 dark:text-red-400 mt-2 transition-colors duration-300">
              {error}
            </p>
          )}

          {recipe && (
            <>
              {
                <div className="mt-6 p-4 border rounded bg-white shadow dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
                  <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                  <p className="mb-2">
                    <strong>Ingredients:</strong>{" "}
                    {recipe.ingredients.join(", ")}
                  </p>
                  <p className="mb-2">
                    <strong>Instructions:</strong> {recipe.instructions}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 dark:text-gray-300 transition-colors duration-300">
                    Macros — {recipe.calories} kcal • {recipe.protein}g protein
                    • {recipe.fat}g fat • {recipe.carbs}g carbs
                  </p>
                </div>
              }
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition transition-colors duration-300"
                onClick={handleSave}
                disabled={saved}
              >
                {saved ? "Recipe Saved ✅" : "Save Recipe"}
              </button>
            </>
          )}
        </div>
      }
    </>
  );
}
