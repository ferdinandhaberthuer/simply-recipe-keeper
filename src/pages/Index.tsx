import { useState, useCallback, useRef } from "react";
import { getRecipes, deleteRecipe, exportRecipes, importRecipes, Recipe } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetail from "@/components/RecipeDetail";
import AddRecipeForm from "@/components/AddRecipeForm";
import { Plus, Search, UtensilsCrossed, Download, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type View = "list" | "add" | "detail";

const Index = () => {
  const [view, setView] = useState<View>("list");
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [search, setSearch] = useState("");

  const refresh = useCallback(() => {
    setRecipes(getRecipes());
  }, []);

  const handleDelete = (id: string) => {
    deleteRecipe(id);
    refresh();
  };

  const handleSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView("detail");
  };

  const filtered = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  if (view === "add") {
    return (
      <div className="mx-auto max-w-lg px-4 py-6 pb-24">
        <AddRecipeForm
          onSaved={() => {
            refresh();
            setView("list");
          }}
          onCancel={() => setView("list")}
        />
      </div>
    );
  }

  if (view === "detail" && selectedRecipe) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6 pb-24">
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={() => {
            setSelectedRecipe(null);
            setView("list");
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Meine Rezepte</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {recipes.length} {recipes.length === 1 ? "Rezept" : "Rezepte"} gespeichert
        </p>
      </div>

      {/* Search */}
      {recipes.length > 0 && (
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rezept suchen..."
            className="w-full rounded-lg bg-card py-2.5 pl-10 pr-4 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-shadow"
          />
        </div>
      )}

      {/* Recipe List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <UtensilsCrossed className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground font-medium">
            {search ? "Kein Rezept gefunden" : "Noch keine Rezepte"}
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {search ? "Versuch einen anderen Suchbegriff" : "Füge dein erstes Rezept hinzu!"}
          </p>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setView("add")}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-90"
        aria-label="Neues Rezept hinzufügen"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Index;
