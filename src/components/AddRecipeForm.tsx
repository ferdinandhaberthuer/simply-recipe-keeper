import { useState } from "react";
import { saveRecipe, CATEGORIES, Ingredient } from "@/lib/recipes";
import { ArrowLeft, Plus, X } from "lucide-react";

interface AddRecipeFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

const AddRecipeForm = ({ onSaved, onCancel }: AddRecipeFormProps) => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { amount: "", name: "" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [cookingTime, setCookingTime] = useState(30);
  const [servings, setServings] = useState(2);

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { amount: "", name: "" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validIngredients = ingredients.filter((ing) => ing.name.trim());
    if (!title.trim() || validIngredients.length === 0) return;
    saveRecipe({
      title: title.trim(),
      ingredients: validIngredients.map((ing) => ({
        amount: ing.amount.trim(),
        name: ing.name.trim(),
      })),
      instructions: instructions.trim(),
      category,
      cookingTime,
      servings,
    });
    onSaved();
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={onCancel}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück
      </button>

      <h1 className="font-display text-2xl font-bold mb-6">Neues Rezept</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Spaghetti Bolognese"
            className="w-full rounded-lg bg-card px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-shadow"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Kategorie</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Kochzeit (Min.)</label>
            <input
              type="number"
              value={cookingTime}
              onChange={(e) => setCookingTime(Math.max(0, parseInt(e.target.value) || 0))}
              min={0}
              className="w-full rounded-lg bg-card px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Portionen</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              className="w-full rounded-lg bg-card px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-shadow"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Zutaten</label>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={ing.amount}
                  onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                  placeholder="200g"
                  className="w-24 shrink-0 rounded-lg bg-card px-3 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-shadow text-center"
                />
                <input
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, "name", e.target.value)}
                  placeholder="Spaghetti"
                  className="flex-1 rounded-lg bg-card px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Zutat entfernen"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <Plus className="h-4 w-4" />
            Zutat hinzufügen
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Zubereitung (ein Schritt pro Zeile)</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder={"Wasser zum Kochen bringen\nSpaghetti al dente kochen\nSoße zubereiten"}
            rows={5}
            className="w-full rounded-lg bg-card px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-shadow resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          Rezept speichern
        </button>
      </form>
    </div>
  );
};

export default AddRecipeForm;
