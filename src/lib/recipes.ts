export interface Recipe {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  category: string;
  createdAt: string;
}

const STORAGE_KEY = "my-recipes";

export const getRecipes = (): Recipe[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
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

export const CATEGORIES = [
  "Frühstück",
  "Mittagessen",
  "Abendessen",
  "Snack",
  "Dessert",
  "Sonstiges",
];
