import { Recipe } from "@/lib/recipes";
import { Clock, Trash2, Users } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

const RecipeCard = ({ recipe, onSelect, onDelete }: RecipeCardProps) => {
  const date = new Date(recipe.createdAt).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      className="group relative rounded-lg bg-card p-4 transition-all active:scale-[0.98] cursor-pointer animate-fade-in"
      onClick={() => onSelect(recipe)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold leading-tight truncate">
            {recipe.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            {recipe.categories?.map((cat) => (
              <span
                key={cat}
                className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {cat}
              </span>
            ))}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {recipe.cookingTime ? `${recipe.cookingTime} Min.` : date}
            </span>
            {recipe.servings > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {recipe.servings}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {recipe.ingredients.slice(0, 3).map((ing) => ing.amount ? `${ing.amount} ${ing.name}` : ing.name).join(", ")}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(recipe.id);
          }}
          className="shrink-0 rounded-md p-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive active:opacity-100"
          aria-label="Rezept löschen"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
