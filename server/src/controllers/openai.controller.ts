import { Request, Response } from "express";
import { getRecipeFromIngredients } from "../services/openai.service";

export const generateRecipe = async (req: Request, res: Response) => {
  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ message: "Invalid ingredients input" });
  }

  try {
    const recipe = await getRecipeFromIngredients(ingredients);
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate recipe" });
  }
};
