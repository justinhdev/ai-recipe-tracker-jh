import { useCallback } from "react";
import api from "../utils/api";
import type { Recipe, GenerateOptions } from "../types/recipe";

export function useRecipeActions() {
  const generate = useCallback(
    async (ingredients: string[], opts: GenerateOptions) => {
      const { servings, diet, cuisine, mealType, bravery, macroPreference } =
        opts;
      const res = await api.post("/api/ai/generate", {
        ingredients,
        servings,
        diet,
        cuisine,
        mealType,
        bravery,
        macroPreference,
      });
      return res.data as Recipe;
    },
    []
  );

  const save = useCallback(async (recipe: Recipe) => {
    await api.post("/api/recipes", recipe);
  }, []);

  const fetchAll = useCallback(async () => {
    const res = await api.get("/api/recipes");
    return res.data as Required<Recipe>[];
  }, []);

  const remove = useCallback(async (id: number) => {
    await api.delete(`/api/recipes/${id}`);
  }, []);

  return { generate, save, fetchAll, remove };
}
