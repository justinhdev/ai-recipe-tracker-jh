import { Request, Response } from "express";
import { getRecipeFromIngredients } from "../services/openai.service";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";

export const generateRecipe = async (req: Request, res: Response) => {
  const {
    ingredients,
    servings,
    diet,
    cuisine,
    mealType,
    bravery,
    macroPreference,
  } = req.body;
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  function sanitizeInstructions(instructions: string): string {
    return instructions
      .replace(/\n+/g, " ")
      .replace(/\bStep\b(?!\s*\d+\.)/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/Step\s+(\d)([^\d])/g, "Step $1.$2")
      .replace(/\.?\s*Step\s+(\d)\./g, " Step $1.")
      .replace(/\.\s*\./g, ".")
      .trim();
  }

  try {
    const recipe = await getRecipeFromIngredients({
      ingredients,
      servings,
      diet,
      cuisine,
      mealType,
      bravery,
      macroPreference,
    });

    res.json({
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: sanitizeInstructions(recipe.instructions),
      calories: recipe.macros.calories,
      protein: recipe.macros.protein,
      fat: recipe.macros.fat,
      carbs: recipe.macros.carbs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate recipe" });
  }
};
