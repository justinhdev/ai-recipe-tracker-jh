import { Request, Response } from "express";
import prisma from "../prisma";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";

export const getUserRecipes = async (req: Request, res: Response) => {
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const recipes = await prisma.recipe.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  const userId = getUserIdFromToken(req);
  const recipeId = parseInt(req.params.id);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (isNaN(recipeId)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe || recipe.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Recipe not found or access denied" });
    }

    await prisma.recipe.delete({ where: { id: recipeId } });
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};
