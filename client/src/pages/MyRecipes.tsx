import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import MacroChart from "../components/MacroChart";

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
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">My Saved Recipes</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : recipes.length === 0 ? (
          <p className="text-gray-500">You haven't saved any recipes yet.</p>
        ) : (
          <div className="grid gap-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="p-4 border rounded shadow bg-white"
              >
                <h3 className="text-xl font-semibold mb-1">{recipe.title}</h3>
                <p className="text-sm mb-1 text-gray-600">
                  <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
                </p>
                <p className="text-sm mb-1">
                  <strong>Instructions:</strong> {recipe.instructions}
                </p>
                <p className="text-sm text-gray-600">
                  Macros — {recipe.calories} kcal • {recipe.protein}g protein •{" "}
                  {recipe.fat}g fat • {recipe.carbs}g carbs
                </p>
                <div className="mt-4">
                  <MacroChart
                    protein={recipe.protein}
                    fat={recipe.fat}
                    carbs={recipe.carbs}
                  />
                </div>
                <button
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  onClick={() => handleDelete(recipe.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
