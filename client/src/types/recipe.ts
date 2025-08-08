export type Recipe = {
  id?: number;
  title: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  createdAt?: string;
};

export type GenerateOptions = {
  servings: number;
  diet: string;
  cuisine: string;
  mealType: string;
  bravery: number;
  macroPreference: string;
};
