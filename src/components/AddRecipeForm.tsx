import { useState } from "react";
import { saveRecipe, CATEGORIES } from "@/lib/recipes";
import { ArrowLeft } from "lucide-react";

interface AddRecipeFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

const AddRecipeForm = ({ onSaved, onCancel }: AddRecipeFormProps) => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !ingredients.trim()) return;
    saveRecipe({ title: title.trim(), ingredients: ingredients.trim(), instructions: instructions.trim(), category });
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

        <div>
          <label className="block text-sm font-medium mb-1.5">Zutaten (eine pro Zeile)</label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder={"200g Spaghetti\n100g Hackfleisch\n1 Dose Tomaten"}
            rows={5}
            className="w-full rounded-lg bg-card px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-shadow resize-none"
            required
          />
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
