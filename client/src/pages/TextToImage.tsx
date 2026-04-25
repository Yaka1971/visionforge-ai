import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Download, Share2, Zap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const STYLES = [
  "Ultra-Realistic",
  "Cinematic",
  "Anime",
  "3D Rendered",
  "Pixel Art",
  "Fantasy",
  "Sci-Fi",
];

const ASPECT_RATIOS = ["1:1", "9:16", "16:9", "4:5"];

export default function TextToImage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [style, setStyle] = useState("Ultra-Realistic");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [batchCount, setBatchCount] = useState(1);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    const initialPrompt = sessionStorage.getItem("initialPrompt");
    if (initialPrompt) {
      setPrompt(initialPrompt);
      sessionStorage.removeItem("initialPrompt");
    }
  }, []);

  const generateMutation = trpc.generation.generateImage.useMutation();
  const enhancePromptMutation = trpc.generation.enhancePrompt.useQuery(
    { prompt },
    { enabled: false }
  );

  const handleGenerate = async () => {
    if (!prompt) return;

    try {
      const result = await generateMutation.mutateAsync({
        prompt,
        negativePrompt,
        style,
        aspectRatio: aspectRatio as "1:1" | "9:16" | "16:9" | "4:5",
        batchCount,
      });

      if (result.generation.imageUrl) {
        setGeneratedImage(result.generation.imageUrl);
      }
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  const handleEnhancePrompt = async () => {
    try {
      const result = await enhancePromptMutation.refetch();
      if (result.data?.enhanced) {
        setPrompt(result.data.enhanced);
      }
    } catch (error) {
      console.error("Prompt enhancement failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="text-blue-500" size={32} />
            Text to Image
          </h1>
          <p className="text-gray-400">
            Generate ultra-high-definition images from your imagination
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-slate-900/50 border-slate-700/50 p-6 space-y-6">
              {/* Prompt Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Prompt
                  </label>
                  <span className="text-xs text-gray-500">
                    {prompt.length} / 1000
                  </span>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, 1000))}
                  placeholder="Describe your vision..."
                  className="bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 h-32 resize-none"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEnhancePrompt}
                  className="mt-2 text-blue-400 hover:text-blue-300"
                  disabled={!prompt}
                >
                  <Sparkles size={14} className="mr-1" />
                  Enhance Prompt
                </Button>
              </div>

              {/* Negative Prompt */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  Negative Prompt
                </label>
                <Textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="What to exclude..."
                  className="bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 h-20 resize-none"
                />
              </div>

              {/* Style Selection */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  Style
                </label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {STYLES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <Button
                      key={ratio}
                      variant={aspectRatio === ratio ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAspectRatio(ratio)}
                      className={
                        aspectRatio === ratio
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-slate-700"
                      }
                    >
                      {ratio}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Batch Count */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  Batch Count
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 8].map((count) => (
                    <Button
                      key={count}
                      variant={batchCount === count ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBatchCount(count)}
                      className={
                        batchCount === count
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-slate-700"
                      }
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!prompt || generateMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap size={18} className="mr-2" />
                    Generate Masterpiece
                  </>
                )}
              </Button>
            </Card>
          </motion.div>

          {/* Preview Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-900/50 border-slate-700/50 p-6 h-full flex flex-col">
              <div className="flex-1 relative bg-slate-800/50 rounded-lg overflow-hidden flex items-center justify-center min-h-96">
                {generateMutation.isPending ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="text-blue-500 animate-pulse" size={32} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium">Synthesizing Pixels</p>
                      <p className="text-sm text-gray-400">
                        SDXL Engine is processing your request...
                      </p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <Sparkles size={64} className="mx-auto mb-4 opacity-20" />
                    <p>Your masterpiece will appear here</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {generatedImage && (
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-700"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = generatedImage;
                      link.download = "visionforge-image.png";
                      link.click();
                    }}
                  >
                    <Download size={18} className="mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-700"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedImage);
                    }}
                  >
                    <Share2 size={18} className="mr-2" />
                    Copy URL
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
