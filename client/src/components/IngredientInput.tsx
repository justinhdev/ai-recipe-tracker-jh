import { useState, useMemo, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { INGREDIENTS } from "../utils/ingredientList";

type Props = {
  value: string[];
  onChange: (selected: string[]) => void;
};

export default function IngredientInput({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  const fuse = useMemo(
    () =>
      new Fuse(INGREDIENTS, {
        threshold: 0.3,
      }),
    []
  );

  const suggestions = query
    ? fuse
        .search(query)
        .map((r) => r.item)
        .filter((i) => !value.includes(i))
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  useEffect(() => {
    const el = itemRefs.current[highlightedIndex];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [highlightedIndex]);

  const addIngredient = (ingredientValue: string) => {
    const cleanValue = ingredientValue.trim().toLowerCase();
    if (!cleanValue || value.includes(cleanValue)) return;

    const updated = [...value, cleanValue];
    onChange(updated);
    setQuery("");
    setDropdownOpen(false);
  };

  const removeIngredient = (ingredient: string) => {
    const updated = value.filter((i) => i !== ingredient);
    onChange(updated);
  };

  const isRecognized = (ingredient: string) =>
    INGREDIENTS.includes(ingredient.toLowerCase());

  return (
    <div ref={containerRef}>
      <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
        Ingredients
      </label>
      <input
        type="text"
        value={query}
        placeholder="Start typing..."
        onChange={(e) => {
          setQuery(e.target.value);
          setDropdownOpen(true);
        }}
        onKeyDown={(e) => {
          const goUp = () => {
            e.preventDefault();
            if (suggestions.length === 0) return;
            setDropdownOpen(true);
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : suggestions.length - 1
            );
          };

          const goDown = () => {
            e.preventDefault();
            if (suggestions.length === 0) return;
            setDropdownOpen(true);
            setHighlightedIndex((prev) =>
              prev < suggestions.length - 1 ? prev + 1 : 0
            );
          };

          if (e.key === "ArrowUp") {
            goUp();
          } else if (e.key === "ArrowDown") {
            goDown();
          } else if (e.key === "Tab") {
            if (e.shiftKey) {
              goUp();
            } else {
              goDown();
            }
          } else if (e.key === "Escape") {
            setDropdownOpen(false);
          } else if (e.key === "Enter") {
            e.preventDefault();
            const valueToAdd =
              dropdownOpen && suggestions.length > 0
                ? suggestions[highlightedIndex]
                : query;
            addIngredient(valueToAdd);
          }
        }}
        className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
      />

      {dropdownOpen && suggestions.length > 0 && (
        <>
          {(itemRefs.current = [])}
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
        </>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {value.map((item) => (
          <span
            key={item}
            onClick={() => removeIngredient(item)}
            className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-colors duration-200 ${
              isRecognized(item)
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800 dark:text-white dark:hover:bg-blue-700"
                : "border border-yellow-400 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-300 dark:hover:bg-yellow-700"
            }`}
            title={
              isRecognized(item)
                ? "Click to remove"
                : "Custom ingredient (click to remove)"
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
