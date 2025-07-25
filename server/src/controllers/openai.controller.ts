import { Request, Response } from "express";
import { getRecipeFromIngredients } from "../services/openai.service";
import prisma from "../prisma";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";

export const generateRecipe = async (req: Request, res: Response) => {
  const { ingredients } = req.body;
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const recipe = await getRecipeFromIngredients(ingredients);

    const saved = await prisma.recipe.create({
      data: {
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        calories: recipe.macros.calories,
        protein: recipe.macros.protein,
        fat: recipe.macros.fat,
        carbs: recipe.macros.carbs,
        userId,
      },
    });

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate or save recipe" });
  }
};
