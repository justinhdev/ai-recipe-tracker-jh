export const getIcon = (text: string): string => {
  if (!text) return "🍽️";
  const t = text.toLowerCase();
  if (t.includes("chicken")) return "🍗";
  if (t.includes("beef") || t.includes("steak")) return "🥩";
  if (t.includes("salad")) return "🥗";
  if (t.includes("fish") || t.includes("salmon")) return "🐟";
  if (t.includes("egg")) return "🥚";
  if (t.includes("pasta")) return "🍝";
  return "🍽️";
};
