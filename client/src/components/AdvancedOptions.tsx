import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { GenerateOptions } from "../types/recipe";

const Label = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200"
  >
    {children}
  </label>
);

const Select = ({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full appearance-none cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
      <ChevronDown size={18} />
    </div>
  </div>
);

type Props = {
  value: GenerateOptions;
  onChange: (next: GenerateOptions) => void;
};

export default function AdvancedOptions({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full cursor-pointer items-center justify-between text-left text-sm font-medium text-gray-800 dark:text-gray-200"
      >
        <span>Advanced Options</span>
        <ChevronDown
          size={20}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-6 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="servings">Servings</Label>
                  <input
                    type="number"
                    id="servings"
                    value={value.servings}
                    min={1}
                    onChange={(e) =>
                      onChange({ ...value, servings: Number(e.target.value) })
                    }
                    className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="mealType">Meal Type</Label>
                  <Select
                    id="mealType"
                    value={value.mealType}
                    onChange={(e) =>
                      onChange({ ...value, mealType: e.target.value })
                    }
                  >
                    <option value="none">Any</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Snack">Snack</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="diet">Dietary Style</Label>
                  <Select
                    id="diet"
                    value={value.diet}
                    onChange={(e) =>
                      onChange({ ...value, diet: e.target.value })
                    }
                  >
                    <option value="none">None</option>
                    <option value="Keto">Keto</option>
                    <option value="Low-Carb">Low-Carb</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Carnivore">Carnivore</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cuisine">Cuisine</Label>
                  <Select
                    id="cuisine"
                    value={value.cuisine}
                    onChange={(e) =>
                      onChange({ ...value, cuisine: e.target.value })
                    }
                  >
                    <option value="none">Any</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Italian">Italian</option>
                    <option value="Asian">Asian</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="American">American</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="macroPreference">Nutrition Goal</Label>
                <Select
                  id="macroPreference"
                  value={value.macroPreference}
                  onChange={(e) =>
                    onChange({ ...value, macroPreference: e.target.value })
                  }
                >
                  <option value="none">Balanced</option>
                  <option value="Protein">High Protein</option>
                  <option value="Fat">High Fat</option>
                  <option value="Carbs">High Carbs</option>
                </Select>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="bravery">AI Creativity</Label>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {value.bravery.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  id="bravery"
                  min="0.2"
                  max="1.2"
                  step="0.1"
                  value={value.bravery}
                  onChange={(e) =>
                    onChange({ ...value, bravery: Number(e.target.value) })
                  }
                  className="w-full h-2 rounded-lg cursor-pointer accent-blue-600 dark:accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Focused</span>
                  <span>Adventurous</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
