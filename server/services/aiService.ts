import { invokeLLM } from "../_core/llm";
import { generateImage as generateImageBuiltIn } from "../_core/imageGeneration";

export interface ImageGenerationParams {
  prompt: string;
  negativePrompt?: string;
  style: string;
  aspectRatio: string;
  batchCount?: number;
}

export interface VideoGenerationParams {
  imageUrl: string;
  cameraMotion: "zoom" | "pan" | "dolly" | "slowMotion";
  motionIntensity: number;
  effects?: string[];
  transitions?: string[];
  exportQuality: "HD" | "4K";
}

/**
 * Enhance user prompt using LLM for better image generation quality
 */
export async function enhancePrompt(userPrompt: string): Promise<string> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are an expert prompt engineer for AI image generation. Your task is to enhance user prompts to create the highest quality images. 
        
Guidelines:
- Add specific visual details and artistic styles
- Include lighting and atmosphere descriptions
- Add composition and framing suggestions
- Maintain the user's original intent while expanding on it
- Keep the enhanced prompt concise but detailed (under 200 words)
- Use professional photography and cinematography terminology`,
      },
      {
        role: "user",
        content: `Enhance this prompt for AI image generation: "${userPrompt}"`,
      },
    ],
  });

  const content = response.choices[0]?.message.content;
  return typeof content === "string" ? content : userPrompt;
}

/**
 * Generate Hollywood-level cinematic prompt using LLM
 */
export async function generateCinematicPrompt(
  characters?: string,
  environment?: string,
  lighting?: string,
  cameraAngle?: string,
  mood?: string
): Promise<string> {
  const components = [characters, environment, lighting, cameraAngle, mood]
    .filter(Boolean)
    .join(", ");

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a world-class cinematographer and visual effects director. Create an ultra-cinematic, Hollywood-quality image prompt that combines all provided elements into a stunning visual composition.
        
Requirements:
- Use professional cinematography terminology
- Include specific lighting setups (3-point lighting, volumetric lighting, etc.)
- Add camera movement and framing details
- Include color grading and atmosphere
- Reference famous films or visual styles
- Make it vivid and emotionally compelling
- Keep it under 200 words but make every word count`,
      },
      {
        role: "user",
        content: `Create a cinematic prompt with these elements: ${components || "a dramatic scene"}`,
      },
    ],
  });

  const content = response.choices[0]?.message.content;
  return typeof content === "string"
    ? content
    : "A cinematic masterpiece with professional lighting and composition";
}

/**
 * Generate smart suggestions for prompt builder categories
 */
export async function generatePromptSuggestions(
  category: "characters" | "environment" | "lighting" | "cameraAngles" | "mood",
  currentPrompt: string
): Promise<string[]> {
  const categoryDescriptions = {
    characters: "interesting characters, people, creatures, or subjects",
    environment: "detailed environments, locations, backgrounds, or settings",
    lighting: "lighting setups, light sources, shadows, and atmospheric effects",
    cameraAngles: "camera angles, framing, composition, and perspective techniques",
    mood: "emotional tones, atmospheres, vibes, and overall feeling",
  };

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are an expert AI prompt engineer. Generate 5 creative and specific suggestions for the "${category}" category that would enhance an image generation prompt.
        
Current prompt context: "${currentPrompt}"

Return ONLY a JSON array of 5 strings, each being a specific suggestion. No other text.
Example format: ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"]`,
      },
      {
        role: "user",
        content: `Generate 5 suggestions for ${categoryDescriptions[category]} that would work well with this prompt: "${currentPrompt}"`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "suggestions",
        strict: true,
        schema: {
          type: "array",
          items: {
            type: "string",
          },
          minItems: 5,
          maxItems: 5,
        },
      },
    },
  });

  try {
    const content = response.choices[0]?.message.content;
    if (typeof content === "string") {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Failed to parse suggestions:", error);
  }

  return [];
}

/**
 * Generate image using built-in image generation service
 */
export async function generateImage(params: ImageGenerationParams): Promise<string> {
  const enhancedPrompt = await enhancePrompt(params.prompt);

  const response = await generateImageBuiltIn({
    prompt: enhancedPrompt,
  });

  return response.url || "";
}

/**
 * Mock video generation - in production, integrate with Kling AI or similar
 */
export async function generateVideo(params: VideoGenerationParams): Promise<string> {
  // This is a placeholder for video generation
  // In production, integrate with Kling AI API
  console.log("Video generation requested with params:", params);

  // Return a mock video URL
  return "https://example.com/video.mp4";
}

/**
 * Apply video enhancements (effects and transitions)
 */
export async function enhanceVideo(
  videoUrl: string,
  effects: string[],
  transitions: string[]
): Promise<string> {
  // Placeholder for video enhancement
  console.log("Video enhancement requested:", { videoUrl, effects, transitions });

  return videoUrl;
}
