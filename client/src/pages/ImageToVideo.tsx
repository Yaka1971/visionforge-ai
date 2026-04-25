import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Video, Upload, Download, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CAMERA_MOTIONS = ["zoom", "pan", "dolly", "slowMotion"];
const LIGHT_EFFECTS = ["beam bursts", "glow", "fire", "smoke"];
const TRANSITIONS = ["fade", "flash", "glitch", "cinematic cut"];

export default function ImageToVideo() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [cameraMotion, setCameraMotion] = useState("zoom");
  const [motionIntensity, setMotionIntensity] = useState(50);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [selectedTransitions, setSelectedTransitions] = useState<string[]>([]);
  const [exportQuality, setExportQuality] = useState("HD");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  const generateVideoMutation = trpc.generation.generateVideo.useMutation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedImage || !videoPrompt.trim()) {
      toast.error("Please upload an image and enter a video prompt");
      return;
    }

    if (!user) {
      toast.error("Please log in to generate videos");
      return;
    }

    setIsGenerating(true);
    try {
      // Call the backend video generation endpoint
      const result = await generateVideoMutation.mutateAsync({
        imageUrl: selectedImage,
        sceneDescription: videoPrompt,
        cameraMotion: cameraMotion as "zoom" | "pan" | "dolly" | "slowMotion",
        motionIntensity,
        effects: selectedEffects,
        transitions: selectedTransitions,
        exportQuality: exportQuality as "HD" | "4K",
      });

      if (result.generation.videoUrl) {
        setGeneratedVideo(result.generation.videoUrl);
        toast.success("Video generated successfully!");
      }
    } catch (error) {
      console.error("Video generation failed:", error);
      toast.error("Failed to generate video. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleEffect = (effect: string) => {
    setSelectedEffects((prev) =>
      prev.includes(effect) ? prev.filter((e) => e !== effect) : [...prev, effect]
    );
  };

  const toggleTransition = (transition: string) => {
    setSelectedTransitions((prev) =>
      prev.includes(transition)
        ? prev.filter((t) => t !== transition)
        : [...prev, transition]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Video className="text-blue-500" size={32} />
              Image to Video
            </h1>
            <p className="text-gray-400">
              Transform static images into cinematic 15-second videos with AI motion
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-slate-900/50 border-slate-700/50 p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  Source Image
                </label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload size={32} className="mx-auto mb-2 text-gray-500" />
                    <p className="text-sm text-gray-400">
                      Click to upload or drag and drop
                    </p>
                  </label>
                </div>
                {selectedImage && (
                  <p className="text-xs text-green-400 mt-2">✓ Image uploaded</p>
                )}
              </div>

              {/* Video Prompt */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  Video Scene Description
                </label>
                <Textarea
                  placeholder="Describe what happens in the video. E.g., 'A camera slowly zooms through a mystical forest with glowing particles floating around, revealing ancient ruins in the distance'"
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 min-h-24 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {videoPrompt.length} / 500 characters
                </p>
              </div>

              {/* Camera Motion */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  Camera Motion
                </label>
                <Select value={cameraMotion} onValueChange={setCameraMotion}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {CAMERA_MOTIONS.map((motion) => (
                      <SelectItem key={motion} value={motion}>
                        {motion.charAt(0).toUpperCase() + motion.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Motion Intensity */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  Motion Intensity: {motionIntensity}%
                </label>
                <Slider
                  value={[motionIntensity]}
                  onValueChange={(value) => setMotionIntensity(value[0])}
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Light Effects */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  Light Effects
                </label>
                <div className="space-y-2">
                  {LIGHT_EFFECTS.map((effect) => (
                    <Button
                      key={effect}
                      variant={selectedEffects.includes(effect) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleEffect(effect)}
                      className={`w-full ${
                        selectedEffects.includes(effect)
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-slate-700"
                      }`}
                    >
                      {effect}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Transitions */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  Scene Transitions
                </label>
                <div className="space-y-2">
                  {TRANSITIONS.map((transition) => (
                    <Button
                      key={transition}
                      variant={selectedTransitions.includes(transition) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTransition(transition)}
                      className={`w-full ${
                        selectedTransitions.includes(transition)
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "border-slate-700"
                      }`}
                    >
                      {transition}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Export Quality */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  Export Quality
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["HD", "4K"].map((quality) => (
                    <Button
                      key={quality}
                      variant={exportQuality === quality ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExportQuality(quality)}
                      className={
                        exportQuality === quality
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-slate-700"
                      }
                    >
                      {quality}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateVideo}
                disabled={!selectedImage || !videoPrompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Video size={18} className="mr-2" />
                    Generate Video
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
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="text-blue-500 animate-pulse" size={32} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium">Creating Cinematic Video</p>
                      <p className="text-sm text-gray-400">
                        Processing your image with AI motion effects...
                      </p>
                    </div>
                  </div>
                ) : generatedVideo ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                    <video
                      src={generatedVideo}
                      controls
                      className="w-full h-full object-contain"
                      autoPlay
                    />
                  </div>
                ) : selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <Video size={64} className="mx-auto mb-4 opacity-20" />
                    <p>Upload an image to get started</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {generatedVideo && (
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-700"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = generatedVideo;
                      link.download = `visionforge-video-${Date.now()}.mp4`;
                      link.click();
                      toast.success("Video download started!");
                    }}
                  >
                    <Download size={18} className="mr-2" />
                    Download Video
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
