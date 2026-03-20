import { useState } from "react";
import { Recipe, Ingredient } from "@/lib/recipes";
import { ArrowLeft, Clock, Users, Minus, Plus } from "lucide-react";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

const RecipeDetail = ({ recipe, onBack }: RecipeDetailProps) => {
  const [servings, setServings] = useState(recipe.servings || 1);
  const scale = recipe.servings ? servings / recipe.servings : 1;

  const scaleAmount = (amount: string) => {
    if (!amount || scale === 1) return amount;
    return amount.replace(/(\d+([.,]\d+)?)/g, (match) => {
      const num = parseFloat(match.replace(",", "."));
      const scaled = num * scale;
      return scaled % 1 === 0 ? String(scaled) : scaled.toFixed(1).replace(".", ",");
    });
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück
      </button>

      <div className="space-y-6">
        <div>
          <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {recipe.category}
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold">{recipe.title}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            {recipe.cookingTime > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {recipe.cookingTime} Min.
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.servings || 1} {(recipe.servings || 1) === 1 ? "Person" : "Personen"}
            </span>
          </div>
        </div>

        {/* Servings adjuster */}
        <div className="flex items-center gap-3 rounded-lg bg-card p-3">
          <span className="text-sm font-medium">Portionen:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-lg font-bold">{servings}</span>
            <button
              onClick={() => setServings(servings + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {scale !== 1 && (
            <span className="ml-auto text-xs text-muted-foreground">
              ×{scale.toFixed(1).replace(".0", "")}
            </span>
          )}
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold mb-2">Zutaten</h2>
          <div className="space-y-1.5">
            {recipe.ingredients.split("\n").filter(Boolean).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm rounded-md bg-card px-3 py-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {scaleIngredient(item)}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold mb-2">Zubereitung</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            {recipe.instructions.split("\n").filter(Boolean).map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
