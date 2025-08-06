export const getIcon = (text: string): string => {
  if (!text) return "🍽️";
  const t = text.toLowerCase();

  if (t.includes("burger")) return "🍔";
  if (t.includes("hot dog")) return "🌭";
  if (t.includes("pizza")) return "🍕";
  if (t.includes("taco") || t.includes("burrito") || t.includes("quesadilla"))
    return "🌮";
  if (t.includes("noodle") || t.includes("ramen") || t.includes("pho"))
    return "🍜";
  if (t.includes("sushi")) return "🍣";
  if (t.includes("curry")) return "🍛";
  if (t.includes("casserole")) return "🍲";
  if (t.includes("pasta") || t.includes("spaghetti") || t.includes("mac"))
    return "🍝";
  if (t.includes("salad")) return "🥗";
  if (t.includes("wrap")) return "🌯";
  if (t.includes("fries") || t.includes("chips")) return "🍟";
  if (t.includes("soup") || t.includes("broth") || t.includes("stew"))
    return "🍲";
  if (t.includes("chicken")) return "🍗";
  if (t.includes("beef") || t.includes("steak") || t.includes("brisket"))
    return "🥩";
  if (t.includes("pork") || t.includes("bacon") || t.includes("ham"))
    return "🍖";
  if (
    t.includes("fish") ||
    t.includes("salmon") ||
    t.includes("tuna") ||
    t.includes("cod")
  )
    return "🐟";
  if (t.includes("shrimp") || t.includes("prawn")) return "🦐";
  if (t.includes("crab") || t.includes("lobster")) return "🦞";
  if (t.includes("egg")) return "🥚";
  if (t.includes("cheese")) return "🧀";
  if (t.includes("bread") || t.includes("toast") || t.includes("bun"))
    return "🍞";
  if (t.includes("rice")) return "🍚";
  if (t.includes("cake")) return "🍰";
  if (t.includes("pie")) return "🥧";
  if (t.includes("cookie")) return "🍪";
  if (t.includes("ice cream")) return "🍨";
  if (t.includes("donut")) return "🍩";
  if (t.includes("apple") || t.includes("berry")) return "🍓";
  if (
    t.includes("vegetable") ||
    t.includes("broccoli") ||
    t.includes("spinach") ||
    t.includes("lettuce")
  )
    if (t.includes("carrot")) return "🥕";
  if (t.includes("corn")) return "🌽";
  if (t.includes("mushroom")) return "🍄";
  if (t.includes("avocado")) return "🥑";
  if (t.includes("pepper")) return "🌶️";
  if (t.includes("garlic")) return "🧄";
  if (t.includes("onion")) return "🧅";
  if (t.includes("potato")) return "🥔";
  if (t.includes("coffee") || t.includes("latte")) return "☕";
  if (t.includes("tea")) return "🍵";
  if (t.includes("wine") || t.includes("red wine")) return "🍷";
  if (t.includes("beer")) return "🍺";
  if (t.includes("cocktail") || t.includes("margarita")) return "🍸";
  return "🍽️";
};
