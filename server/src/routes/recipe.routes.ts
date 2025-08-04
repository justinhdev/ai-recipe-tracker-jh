import { Router } from "express";
import {
  getUserRecipes,
  deleteRecipe,
  createRecipe,
} from "../controllers/recipe.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getUserRecipes);
router.delete("/:id", protect, deleteRecipe);

export default router;
