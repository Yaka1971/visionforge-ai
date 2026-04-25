import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createGeneration,
  createGalleryItem,
  getUserGenerations,
  getGenerationById,
  deleteGalleryItem,
} from "../db";
import {
  generateImage,
  enhancePrompt,
  generateCinematicPrompt,
  generatePromptSuggestions,
} from "../services/aiService";

export const generationRouter = router({
  /**
   * Generate an image from a text prompt
   */
  generateImage: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1).max(1000),
        negativePrompt: z.string().optional(),
        style: z.string(),
        aspectRatio: z.enum(["1:1", "9:16", "16:9", "4:5"]),
        batchCount: z.number().int().min(1).max(8).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Create generation record with pending status
      const generation = await createGeneration({
        userId,
        type: "image",
        prompt: input.prompt,
        negativePrompt: input.negativePrompt,
        style: input.style,
        aspectRatio: input.aspectRatio,
        status: "processing",
        metadata: JSON.stringify({
          engine: "SDXL",
          resolution: "4K",
          batchCount: input.batchCount || 1,
        }),
      });

      if (!generation) {
        throw new Error("Failed to create generation record");
      }

      try {
        // Generate image
        const imageUrl = await generateImage({
          prompt: input.prompt,
          negativePrompt: input.negativePrompt,
          style: input.style,
          aspectRatio: input.aspectRatio,
          batchCount: input.batchCount || 1,
        });

        // Extract file key from URL (assuming format: /manus-storage/{key})
        const fileKey = imageUrl.split("/").pop() || "";

        // Create gallery item
        await createGalleryItem({
          userId,
          generationId: generation.id,
          type: "image",
          fileKey,
          fileUrl: imageUrl,
          metadata: JSON.stringify({
            style: input.style,
            aspectRatio: input.aspectRatio,
          }),
        });

        return {
          success: true,
          generation: {
            ...generation,
            imageUrl,
            status: "completed",
          },
        };
      } catch (error) {
        console.error("Image generation failed:", error);
        throw error;
      }
    }),

  /**
   * Enhance a prompt using LLM
   */
  enhancePrompt: protectedProcedure
    .input(z.object({ prompt: z.string().min(1).max(1000) }))
    .query(async ({ input }) => {
      const enhanced = await enhancePrompt(input.prompt);
      return { enhanced };
    }),

  /**
   * Generate a cinematic prompt using LLM
   */
  generateCinematicPrompt: protectedProcedure
    .input(
      z.object({
        characters: z.string().optional(),
        environment: z.string().optional(),
        lighting: z.string().optional(),
        cameraAngle: z.string().optional(),
        mood: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const cinematic = await generateCinematicPrompt(
        input.characters,
        input.environment,
        input.lighting,
        input.cameraAngle,
        input.mood
      );
      return { cinematic };
    }),

  /**
   * Get smart suggestions for prompt builder categories
   */
  getPromptSuggestions: protectedProcedure
    .input(
      z.object({
        category: z.enum([
          "characters",
          "environment",
          "lighting",
          "cameraAngles",
          "mood",
        ]),
        currentPrompt: z.string(),
      })
    )
    .query(async ({ input }) => {
      const suggestions = await generatePromptSuggestions(
        input.category,
        input.currentPrompt
      );
      return { suggestions };
    }),

  /**
   * Get user's generation history
   */
  getHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const generations = await getUserGenerations(
        ctx.user.id,
        input.limit,
        input.offset
      );
      return { generations };
    }),

  /**
   * Get a specific generation
   */
  getGeneration: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const generation = await getGenerationById(input.id, ctx.user.id);
      if (!generation) {
        throw new Error("Generation not found");
      }
      return { generation };
    }),

  /**
   * Delete a gallery item
   */
  deleteGalleryItem: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      await deleteGalleryItem(input.id, ctx.user.id);
      return { success: true };
    }),
});
