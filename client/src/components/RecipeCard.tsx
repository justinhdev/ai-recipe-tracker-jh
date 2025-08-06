import { getIcon } from "../utils/getIcon";

type Recipe = {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  createdAt: string;
};

type RecipeProps = Recipe & {
  onSelect: (recipe: Recipe) => void;
};

export default function RecipeCard({
  id,
  title,
  ingredients,
  instructions,
  calories,
  protein,
  fat,
  carbs,
  createdAt,
  onSelect,
}: RecipeProps) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-5 flex flex-col justify-between gap-3 transition duration-200 hover:shadow-lg hover:scale-[1.01] cursor-pointer h-full min-h-[220px] sm:min-h-[240px] md:min-h-[260px] lg:min-h-[280px]"
      onClick={() =>
        onSelect({
          id,
          title,
          ingredients,
          instructions,
          calories,
          protein,
          fat,
          carbs,
          createdAt,
        })
      }
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span>{getIcon(title)}</span>
          <h3 className="text-base sm:text-lg">{title}</h3>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(createdAt)}
        </span>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300">
        <strong>Ingredients:</strong> {ingredients.join(", ")}
      </p>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {calories} kcal • {protein}g protein • {fat}g fat • {carbs}g carbs
      </p>

      <span className="text-blue-600 dark:text-blue-400 hover:underline text-sm w-fit mt-auto">
        View Recipe
      </span>
    </div>
  );
}
