import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Wand2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface PromptBuilderProps {
  onPromptChange: (prompt: string) => void;
  currentPrompt: string;
}

const CATEGORIES = [
  { id: "characters", label: "Characters", icon: "👤" },
  { id: "environment", label: "Environment", icon: "🌍" },
  { id: "lighting", label: "Lighting", icon: "💡" },
  { id: "cameraAngles", label: "Camera Angles", icon: "📷" },
  { id: "mood", label: "Mood", icon: "🎭" },
];

export function PromptBuilder({
  onPromptChange,
  currentPrompt,
}: PromptBuilderProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cinematicMode, setCinematicMode] = useState(false);
  const [builderPrompt, setBuilderPrompt] = useState({
    characters: "",
    environment: "",
    lighting: "",
    cameraAngles: "",
    mood: "",
  });

  const suggestionsQuery = trpc.generation.getPromptSuggestions.useQuery(
    {
      category: (activeCategory as any) || "characters",
      currentPrompt,
    },
    { enabled: !!activeCategory }
  );

  const cinematicQuery = trpc.generation.generateCinematicPrompt.useQuery(
    {
      characters: builderPrompt.characters,
      environment: builderPrompt.environment,
      lighting: builderPrompt.lighting,
      cameraAngle: builderPrompt.cameraAngles,
      mood: builderPrompt.mood,
    },
    { enabled: cinematicMode }
  );

  const handleAddSuggestion = (suggestion: string) => {
    const newPrompt = currentPrompt
      ? `${currentPrompt}, ${suggestion}`
      : suggestion;
    onPromptChange(newPrompt);
  };

  const handleCinematicMode = async () => {
    setCinematicMode(true);
    if (cinematicQuery.data?.cinematic) {
      onPromptChange(cinematicQuery.data.cinematic);
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Wand2 size={20} className="text-blue-500" />
          Smart Prompt Builder
        </h3>
        <Button
          onClick={handleCinematicMode}
          variant={cinematicMode ? "default" : "outline"}
          size="sm"
          className={
            cinematicMode
              ? "bg-purple-600 hover:bg-purple-700"
              : "border-slate-700"
          }
          disabled={cinematicQuery.isPending}
        >
          {cinematicQuery.isPending ? (
            <>
              <Loader2 size={14} className="mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={14} className="mr-1" />
              Cinematic Mode
            </>
          )}
        </Button>
      </div>

      {/* Category Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.id)}
            className={
              activeCategory === cat.id
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-slate-700"
            }
          >
            <span className="mr-1">{cat.icon}</span>
            <span className="hidden sm:inline text-xs">{cat.label}</span>
          </Button>
        ))}
      </div>

      {/* Category Input */}
      {activeCategory && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <label className="text-sm font-semibold text-gray-300">
            {CATEGORIES.find((c) => c.id === activeCategory)?.label}
          </label>
          <Textarea
            value={(builderPrompt as any)[activeCategory] || ""}
            onChange={(e) =>
              setBuilderPrompt({
                ...builderPrompt,
                [activeCategory]: e.target.value,
              } as any)
            }
            placeholder={`Describe ${activeCategory}...`}
            className="bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 h-20 resize-none"
          />

          {/* Suggestions */}
          {suggestionsQuery.data?.suggestions && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 font-semibold">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestionsQuery.data.suggestions.map((suggestion, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-xs"
                    onClick={() => handleAddSuggestion(suggestion)}
                  >
                    + {suggestion.substring(0, 20)}...
                  </Button>
                ))}
              </div>
            </div>
          )}

          {suggestionsQuery.isPending && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 size={14} className="animate-spin" />
              Loading suggestions...
            </div>
          )}
        </motion.div>
      )}

      {/* Preview */}
      {currentPrompt && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Current Prompt:</p>
          <p className="text-sm text-gray-200 line-clamp-3">{currentPrompt}</p>
        </div>
      )}
    </Card>
  );
}
