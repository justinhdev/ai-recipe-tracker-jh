import { useState, useMemo, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { INGREDIENTS } from "../utils/ingredientList";

type Props = {
  onChange: (selected: string[]) => void;
};

export default function IngredientInput({ onChange }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  const fuse = useMemo(
    () =>
      new Fuse(INGREDIENTS, {
        threshold: 0.3,
        ignoreLocation: true,
      }),
    []
  );

  const addIngredient = (value: string) => {
    const cleanValue = value.trim().toLowerCase();
    if (!cleanValue || selected.includes(cleanValue)) return;

    const updated = [...selected, cleanValue];
    setSelected(updated);
    onChange(updated);
    setQuery("");
  };

  const removeIngredient = (ingredient: string) => {
    const updated = selected.filter((i) => i !== ingredient);
    setSelected(updated);
    onChange(updated);
  };

  const isRecognized = (ingredient: string) =>
    INGREDIENTS.includes(ingredient.toLowerCase());

  const suggestions = query
    ? fuse
        .search(query)
        .map((r) => r.item)
        .filter((i) => !selected.includes(i))
    : [];

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query, suggestions.length]);

  useEffect(() => {
    const el = itemRefs.current[highlightedIndex];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
        Ingredients
      </label>
      <input
        type="text"
        value={query}
        placeholder="Start typing..."
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev < suggestions.length - 1 ? prev + 1 : 0
            );
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : suggestions.length - 1
            );
          } else if (e.key === "Enter") {
            e.preventDefault();
            const selected = suggestions[highlightedIndex] || query;
            addIngredient(selected);
          }
        }}
        className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
      />

      {query &&
        suggestions.length > 0 &&
        (() => {
          itemRefs.current = [];

          return (
            <div className="bg-white dark:bg-gray-800 border rounded shadow mt-1 max-h-40 overflow-y-auto z-10 relative">
              {suggestions.map((item, index) => (
                <div
                  key={item}
                  ref={(el) => {
                    if (el) itemRefs.current[index] = el;
                  }}
                  onClick={() => addIngredient(item)}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    index === highlightedIndex
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          );
        })()}

      <div className="flex flex-wrap gap-2 mt-3">
        {selected.map((item) => (
          <span
            key={item}
            onClick={() => removeIngredient(item)}
            className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
              isRecognized(item)
                ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-white"
                : "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300 border border-yellow-400"
            }`}
            title={
              isRecognized(item)
                ? undefined
                : "Not in ingredient list — still usable, but may impact results"
            }
          >
            {item} ✕
          </span>
        ))}
      </div>
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-300 dark:bg-blue-800"></span>
          Recognized
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-300 dark:bg-yellow-800"></span>
          Not Recognized
        </div>
      </div>
    </div>
  );
}
