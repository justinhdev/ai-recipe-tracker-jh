import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getRecipeFromIngredients = async (ingredients: string[]) => {
  const prompt = `
You are a professional chef and nutritionist. Based on the provided ingredients, create a healthy, realistic recipe in **strict JSON format** — no extra text.

FORMAT:
{
  "title": "Recipe Name",
  "ingredients": [
    "exact amounts and units for each ingredient (e.g., 1 cup milk, 2 tbsp olive oil)"
  ],
  "instructions": "Step 1. Full sentence. Step 2. Full sentence. Step 3. ...",
  "macros": {
    "calories": number,
    "protein": number,
    "fat": number,
    "carbs": number
  }
}

RECIPE REQUIREMENTS:
- Write **6 to 8 detailed steps** with heat levels, cooking times, and prep techniques.
- Each step must start with: **Step X.** followed by a full, clear sentence.
- Use only the provided ingredients plus pantry staples (salt, pepper, oil, water).
- Instructions must be inside one string with no line breaks or Markdown.
- Output must be **valid JSON only** — no commentary or formatting.

INGREDIENTS: ${ingredients.join(", ")}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
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
