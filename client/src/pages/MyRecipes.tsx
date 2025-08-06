import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import { AnimatePresence, motion } from "framer-motion";

type Recipe = {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  createdAt: string;
};

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/recipes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch recipes");
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-4">My Saved Recipes</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500 dark:text-red-400 duration-300">{error}</p>
        ) : recipes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 duration-300">
            You haven't saved any recipes yet.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] items-stretch">
            {recipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RecipeCard
                  key={recipe.id}
                  {...recipe}
                  onSelect={(r) => setSelectedRecipe(r)}
                />
              </motion.div>
            ))}
          </div>
        )}
        <AnimatePresence>
          {selectedRecipe && (
            <RecipeModal
              recipe={selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
              onDelete={handleDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
