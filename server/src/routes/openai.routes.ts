import { Router } from "express";
import { generateRecipe } from "../controllers/openai.controller";

const router = Router();

router.post("/generate", generateRecipe);

export default router;
