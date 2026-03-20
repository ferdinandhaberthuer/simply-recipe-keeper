export interface Ingredient {
  amount: string;
  name: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  /** @deprecated old string format, kept for migration */
  ingredientsLegacy?: string;
  instructions: string;
  category: string;
  cookingTime: number;
  servings: number;
  createdAt: string;
}

/** Migrate old string-based ingredients to structured format */
export const migrateIngredients = (raw: any): Ingredient[] => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    return raw.split("\n").filter(Boolean).map((line: string) => {
      const match = line.match(/^(\d+[.,]?\d*\s*\w*)\s+(.+)$/);
      if (match) return { amount: match[1].trim(), name: match[2].trim() };
      return { amount: "", name: line.trim() };
    });
  }
  return [];
};

export const getRandomRecipe = (category?: string): Recipe | null => {
  let recipes = getRecipes();
  if (category && category !== "Alle") {
    recipes = recipes.filter((r) => r.category === category);
  }
  if (recipes.length === 0) return null;
  return recipes[Math.floor(Math.random() * recipes.length)];
};

const STORAGE_KEY = "my-recipes";

export const getRecipes = (): Recipe[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  const recipes = JSON.parse(data);
  return recipes.map((r: any) => ({
    ...r,
    ingredients: migrateIngredients(r.ingredients),
  }));
};

export const saveRecipe = (recipe: Omit<Recipe, "id" | "createdAt">): Recipe => {
  const recipes = getRecipes();
  const newRecipe: Recipe = {
    ...recipe,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  recipes.unshift(newRecipe);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  return newRecipe;
};

export const deleteRecipe = (id: string): void => {
  const recipes = getRecipes().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
};

export const exportRecipes = (): string => {
  const recipes = getRecipes();
  return JSON.stringify({ version: 1, recipes }, null, 2);
};

export const importRecipes = (jsonString: string): { added: number; skipped: number } => {
  const data = JSON.parse(jsonString);
  if (!data.recipes || !Array.isArray(data.recipes)) {
    throw new Error("Ungültiges Dateiformat");
  }
  const existing = getRecipes();
  const existingIds = new Set(existing.map((r) => r.id));
  const newRecipes = (data.recipes as Recipe[]).filter((r) => !existingIds.has(r.id));
  const merged = [...newRecipes, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return { added: newRecipes.length, skipped: data.recipes.length - newRecipes.length };
};

export const CATEGORIES = [
  "Frühstück",
  "Mittagessen",
  "Abendessen",
  "Snack",
  "Dessert",
  "Sonstiges",
];
