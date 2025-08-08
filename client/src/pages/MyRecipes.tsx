import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import { AnimatePresence, motion } from "framer-motion";
import { useRecipeActions } from "../hooks/useRecipeActions";
import { toMessage } from "../utils/error";
import type { Recipe } from "../types/recipe";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Required<Recipe>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Required<Recipe> | null>(null);

  const { fetchAll, remove } = useRecipeActions();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchAll();
        setRecipes(data);
      } catch (e: unknown) {
        setError(toMessage(e, "Failed to fetch recipes"));
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchAll]);

  const handleDelete = async (id: number) => {
    try {
      await remove(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      setSelected(null);
    } catch (e: unknown) {
      setError(toMessage(e, "Failed to delete recipe"));
    }
  };

  return (
    <PageWrapper>
      <h2 className="text-2xl font-bold mb-4">My Saved Recipes</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400">{error}</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
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
                {...recipe}
                onSelect={(r) => setSelected(r as Required<Recipe>)}
              />
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <RecipeModal
            recipe={selected}
            onClose={() => setSelected(null)}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
