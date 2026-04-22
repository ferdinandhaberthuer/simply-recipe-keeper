import { useState, useCallback, useRef, useEffect } from "react";
import { getRecipes, deleteRecipe, exportRecipes, importRecipes, getRandomRecipe, Recipe, CATEGORIES } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetail from "@/components/RecipeDetail";
import AddRecipeForm from "@/components/AddRecipeForm";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Plus, Search, UtensilsCrossed, Download, Upload, Shuffle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type View = "list" | "add" | "detail" | "edit";

const Index = () => {
  const [view, setView] = useState<View>("list");
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Alle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleBack = () => {
      if (view === "detail" || view === "add" || view === "edit") {
        setView("list");
      } else if (view === "list") {
        window.close();
      }
    };
    window.addEventListener("capacitor-back-button", handleBack);
    return () => window.removeEventListener("capacitor-back-button", handleBack);
  }, [view]);

  const handleEdit = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView("edit");
  };

  const handleDuplicate = (recipe: Recipe) => {
    const duplicate = { ...recipe, id: "" };
    setSelectedRecipe(duplicate);
    setView("edit");
  };

  const refresh = useCallback(() => {
    setRecipes(getRecipes());
  }, []);

  const handleExport = async () => {
    const json = exportRecipes();
    const filename = `rezepte-${new Date().toISOString().slice(0, 10)}.json`;
    try {
      await Filesystem.writeFile({
        path: filename,
        data: json,
        directory: Directory.Cache,
        encoding: "utf8",
      });
      const file = await Filesystem.getUri({ path: filename, directory: Directory.Cache });
      await Share.share({
        title: "Rezepte exportieren",
        url: file.uri,
      });
      toast({ title: `${recipes.length} Rezept(e) exportiert` });
    } catch (err) {
      console.error("Export error:", err);
      toast({ title: "Export fehlgeschlagen", description: String(err), variant: "destructive" });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = importRecipes(reader.result as string);
        refresh();
        toast({ title: `${result.added} Rezept(e) importiert`, description: result.skipped > 0 ? `${result.skipped} bereits vorhanden` : undefined });
      } catch {
        toast({ title: "Import fehlgeschlagen", description: "Die Datei hat ein ungültiges Format.", variant: "destructive" });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleDelete = (id: string) => {
    deleteRecipe(id);
    refresh();
  };

  const handleSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView("detail");
  };

  const filtered = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.categories?.some((c) => c.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategory === "Alle" || r.categories?.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

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
          onEdit={() => handleEdit(selectedRecipe)}
          onDuplicate={() => handleDuplicate(selectedRecipe)}
        />
      </div>
    );
  }

  if (view === "edit" && selectedRecipe) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6 pb-24">
        <AddRecipeForm
          initialRecipe={selectedRecipe}
          onSaved={() => {
            refresh();
            setView("list");
            setSelectedRecipe(null);
          }}
          onCancel={() => setView("list")}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Meine Rezepte</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filterCategory === "Alle" ? `${recipes.length} ${recipes.length === 1 ? "Rezept" : "Rezepte"} gespeichert` : `${filtered.length} von ${recipes.length} Rezepten`}
          </p>
        </div>
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-secondary p-2.5 text-secondary-foreground transition-colors hover:bg-accent"
            aria-label="Rezepte importieren"
          >
            <Upload className="h-4 w-4" />
          </button>
          {recipes.length > 0 && (
            <button
              onClick={handleExport}
              className="rounded-lg bg-secondary p-2.5 text-secondary-foreground transition-colors hover:bg-accent"
              aria-label="Rezepte exportieren"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      {recipes.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rezept suchen..."
            className="w-full rounded-lg bg-card py-2.5 pl-10 pr-4 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-shadow"
          />
        </div>
      )}

      

      {/* Random suggestion */}
      {recipes.length > 0 && (
        <div className="mb-5 rounded-lg bg-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shuffle className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Zufälliges Rezept</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {["Alle", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  filterCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              const r = getRandomRecipe(filterCategory);
              if (r) handleSelect(r);
              else toast({ title: "Keine Rezepte in dieser Kategorie" });
            }}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground transition-transform active:scale-[0.98]"
          >
            Überrasch mich!
          </button>
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
