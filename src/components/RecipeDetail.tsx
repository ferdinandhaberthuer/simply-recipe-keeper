import { Recipe } from "@/lib/recipes";
import { ArrowLeft } from "lucide-react";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

const RecipeDetail = ({ recipe, onBack }: RecipeDetailProps) => {
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
                {item}
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
