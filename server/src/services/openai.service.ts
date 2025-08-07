import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type RecipeOptions = {
  ingredients: string[];
  servings?: number;
  diet?: string;
  cuisine?: string;
  mealType?: string;
  bravery?: number;
  macroPreference?: string;
};

export const getRecipeFromIngredients = async (options: RecipeOptions) => {
  const {
    ingredients,
    servings = 2,
    diet = "none",
    cuisine = "none",
    mealType = "none",
    bravery = 0.7,
    macroPreference = "none",
  } = options;

  const constraints: string[] = [];
  if (servings > 0) {
    constraints.push(`The recipe must serve ${servings} people.`);
  }
  if (diet !== "none") {
    constraints.push(`It must be a ${diet} recipe.`);
  }
  if (cuisine !== "none") {
    constraints.push(`The cuisine should be ${cuisine}.`);
  }
  if (mealType !== "none") {
    constraints.push(`This is for ${mealType}.`);
  }
  if (macroPreference !== "none") {
    constraints.push(
      `Prioritize a high ${macroPreference} content relative to other macros.`
    );
  }

  const prompt = `
You are a professional chef and nutritionist. Based on the provided ingredients and constraints, create a healthy, realistic recipe in **strict JSON format** — no extra text.

FORMAT:
{
  "title": "Recipe Name",
  "ingredients": [
    "exact amounts and units for each ingredient (e.g., 1 cup milk, 2 tbsp olive oil)"
  ],
  "instructions": "Step 1. Full sentence or sentences. Step 2. Full sentence or sentences. Step 3. ...",
  "macros": {
    "calories": number,
    "protein": number,
    "fat": number,
    "carbs": number
  }
}

RECIPE REQUIREMENTS:
${
  constraints.length > 0
    ? constraints.map((c) => `- ${c}`).join("\n")
    : "- Follow user-provided ingredients."
}
- Write **6 to 8 detailed steps** with heat levels, cooking times, and prep techniques.
- Each step must start with: **Step X.** followed by a full, clear sentence or sentences.
- Use only the provided ingredients plus pantry staples (salt, pepper, oil, water).
- Instructions must be inside one string with no line breaks or Markdown.
- Output must be **valid JSON only** — no commentary or formatting.

INGREDIENTS: ${ingredients.join(", ")}
`;

  const temperature = bravery ? Math.min(Math.max(bravery, 0), 1.5) : 0.7;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: temperature,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) throw new Error("No content returned from OpenAI");

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("Failed to parse recipe JSON from OpenAI");
  }
};
