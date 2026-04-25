import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PromptBuilder } from "@/components/PromptBuilder";
import { Wand2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PromptBuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [, setLocation] = useLocation();

  const handleUsePrompt = () => {
    if (prompt) {
      // Store prompt in sessionStorage and navigate to generate page
      sessionStorage.setItem("initialPrompt", prompt);
      setLocation("/generate");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Wand2 className="text-purple-500" size={32} />
              Prompt Builder
            </h1>
            <p className="text-gray-400">
              Create the perfect prompt with AI-powered suggestions
            </p>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="border-slate-700"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PromptBuilder
            currentPrompt={prompt}
            onPromptChange={setPrompt}
          />

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              onClick={handleUsePrompt}
              disabled={!prompt}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg"
            >
              Use This Prompt
            </Button>
            <Button
              onClick={() => setPrompt("")}
              variant="outline"
              className="flex-1 border-slate-700"
            >
              Clear
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
