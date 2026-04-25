import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import {
  Sparkles,
  Video,
  Zap,
  Wand2,
  Download,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-500" size={28} />
            <span className="text-xl font-bold">VisionForge AI</span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => setLocation("/generate")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create
                </Button>
                <Button
                  onClick={() => setLocation("/prompt-builder")}
                  variant="outline"
                  className="border-slate-700"
                >
                  Prompt Builder
                </Button>
                <Button
                  onClick={() => setLocation("/image-to-video")}
                  variant="outline"
                  className="border-slate-700"
                >
                  Image to Video
                </Button>
                <Button
                  onClick={() => setLocation("/gallery")}
                  variant="outline"
                  className="border-slate-700"
                >
                  Gallery
                </Button>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-slate-700"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            Create Cinematic Visuals
            <br />
            with AI
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Transform your imagination into stunning 4K images and cinematic
            videos using advanced AI. No technical skills required.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Button
                onClick={() => setLocation("/generate")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-6 px-8"
              >
                <Sparkles className="mr-2" size={20} />
                Start Creating
                <ArrowRight className="ml-2" size={20} />
              </Button>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-6 px-8"
              >
                <Sparkles className="mr-2" size={20} />
                Get Started Free
                <ArrowRight className="ml-2" size={20} />
              </Button>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
        className="py-20 px-6 bg-slate-900/30"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-center mb-16"
          >
            Powerful Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: "Text-to-Image",
                description:
                  "Generate ultra-HD images from text prompts with multiple style presets",
              },
            {
              icon: Wand2,
              title: "Smart Prompt Builder",
              description:
                "AI-powered suggestions for characters, environments, lighting, and more",
              onClick: () => isAuthenticated ? setLocation("/prompt-builder") : null,
            },
              {
                icon: Video,
                title: "Image-to-Video",
                description:
                  "Convert static images into cinematic 15-second video clips",
              },
              {
                icon: Download,
                title: "Easy Export",
                description:
                  "Download in PNG, JPG, or MP4 optimized for social media",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-blue-500/50 transition-colors ${(feature as any).onClick && isAuthenticated ? "cursor-pointer" : ""}`}
                onClick={() => (feature as any).onClick?.()}
              >
                <feature.icon className="text-blue-500 mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
        className="py-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-12">
          <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4">
            Ready to Create?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-gray-300 mb-8 text-lg"
          >
            Join creators worldwide using VisionForge AI to bring their ideas to
            life
          </motion.p>
          <motion.div variants={itemVariants}>
            {isAuthenticated ? (
              <Button
                onClick={() => setLocation("/generate")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-6 px-8"
              >
                <Zap className="mr-2" size={20} />
                Start Forging
              </Button>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-6 px-8"
              >
                <Zap className="mr-2" size={20} />
                Sign In to Start
              </Button>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-6 text-center text-gray-500 text-sm">
        <p>© 2026 VisionForge AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
