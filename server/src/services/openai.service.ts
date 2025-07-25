import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getRecipeFromIngredients = async (ingredients: string[]) => {
  const prompt = `
You are a helpful nutritionist and recipe creator. 
Create a healthy recipe using the following ingredients: ${ingredients.join(", ")}.

Respond in the following JSON format:
{
  "title": "Recipe Name",
  "ingredients": [ "ingredient 1", "ingredient 2", ... ],
  "instructions": "Step-by-step instructions here.",
  "macros": {
    "calories": number,
    "protein": number,
    "fat": number,
    "carbs": number
  }
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) throw new Error("No content returned from OpenAI");

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("Failed to parse recipe JSON from OpenAI");
  }
};
