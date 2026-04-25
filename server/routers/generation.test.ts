import { describe, it, expect, vi, beforeEach } from "vitest";
import { generationRouter } from "./generation";
import * as db from "../db";
import * as aiService from "../services/aiService";

// Mock dependencies
vi.mock("../db");
vi.mock("../services/aiService");

describe("generation router", () => {
  const mockUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const mockContext = {
    user: mockUser,
    req: {} as any,
    res: {} as any,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("enhancePrompt", () => {
    it("should enhance a prompt using LLM", async () => {
      const enhancedPrompt = "A beautiful landscape with mountains and sunset";
      vi.mocked(aiService.enhancePrompt).mockResolvedValue(enhancedPrompt);

      const caller = generationRouter.createCaller(mockContext);
      const result = await caller.enhancePrompt({
        prompt: "landscape with mountains",
      });

      expect(result.enhanced).toBe(enhancedPrompt);
      expect(aiService.enhancePrompt).toHaveBeenCalledWith(
        "landscape with mountains"
      );
    });
  });

  describe("generateCinematicPrompt", () => {
    it("should generate a cinematic prompt from components", async () => {
      const cinematicPrompt =
        "A cinematic masterpiece featuring a lone warrior standing on a cliff...";
      vi.mocked(aiService.generateCinematicPrompt).mockResolvedValue(
        cinematicPrompt
      );

      const caller = generationRouter.createCaller(mockContext);
      const result = await caller.generateCinematicPrompt({
        characters: "warrior",
        environment: "cliff",
        lighting: "golden hour",
        cameraAngle: "wide shot",
        mood: "dramatic",
      });

      expect(result.cinematic).toBe(cinematicPrompt);
      expect(aiService.generateCinematicPrompt).toHaveBeenCalledWith(
        "warrior",
        "cliff",
        "golden hour",
        "wide shot",
        "dramatic"
      );
    });
  });

  describe("getPromptSuggestions", () => {
    it("should return suggestions for a category", async () => {
      const suggestions = [
        "suggestion 1",
        "suggestion 2",
        "suggestion 3",
        "suggestion 4",
        "suggestion 5",
      ];
      vi.mocked(aiService.generatePromptSuggestions).mockResolvedValue(
        suggestions
      );

      const caller = generationRouter.createCaller(mockContext);
      const result = await caller.getPromptSuggestions({
        category: "characters",
        currentPrompt: "a beautiful landscape",
      });

      expect(result.suggestions).toEqual(suggestions);
      expect(aiService.generatePromptSuggestions).toHaveBeenCalledWith(
        "characters",
        "a beautiful landscape"
      );
    });
  });

  describe("getHistory", () => {
    it("should retrieve user generation history", async () => {
      const mockGenerations = [
        {
          id: 1,
          userId: 1,
          type: "image",
          prompt: "test prompt",
          status: "completed",
          createdAt: new Date(),
        },
      ];

      vi.mocked(db.getUserGenerations).mockResolvedValue(mockGenerations as any);

      const caller = generationRouter.createCaller(mockContext);
      const result = await caller.getHistory({ limit: 20, offset: 0 });

      expect(result.generations).toEqual(mockGenerations);
      expect(db.getUserGenerations).toHaveBeenCalledWith(1, 20, 0);
    });

    it("should support pagination", async () => {
      vi.mocked(db.getUserGenerations).mockResolvedValue([]);

      const caller = generationRouter.createCaller(mockContext);
      await caller.getHistory({ limit: 10, offset: 20 });

      expect(db.getUserGenerations).toHaveBeenCalledWith(1, 10, 20);
    });
  });

  describe("getGeneration", () => {
    it("should retrieve a specific generation", async () => {
      const mockGeneration = {
        id: 1,
        userId: 1,
        type: "image",
        prompt: "test prompt",
        status: "completed",
        createdAt: new Date(),
      };

      vi.mocked(db.getGenerationById).mockResolvedValue(mockGeneration as any);

      const caller = generationRouter.createCaller(mockContext);
      const result = await caller.getGeneration({ id: 1 });

      expect(result.generation).toEqual(mockGeneration);
      expect(db.getGenerationById).toHaveBeenCalledWith(1, 1);
    });

    it("should throw error if generation not found", async () => {
      vi.mocked(db.getGenerationById).mockResolvedValue(null);

      const caller = generationRouter.createCaller(mockContext);

      await expect(caller.getGeneration({ id: 999 })).rejects.toThrow(
        "Generation not found"
      );
    });
  });

  describe("deleteGalleryItem", () => {
    it("should delete a gallery item", async () => {
      vi.mocked(db.deleteGalleryItem).mockResolvedValue(undefined);

      const caller = generationRouter.createCaller(mockContext);
      const result = await caller.deleteGalleryItem({ id: 1 });

      expect(result.success).toBe(true);
      expect(db.deleteGalleryItem).toHaveBeenCalledWith(1, 1);
    });
  });
});
