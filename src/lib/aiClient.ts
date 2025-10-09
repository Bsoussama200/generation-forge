import { supabase } from "@/integrations/supabase/client";

export type ContentType = "text" | "image";

export interface GenerateContentRequest {
  prompt: string;
  type?: ContentType;
  model?: string;
}

export interface GenerateContentResponse {
  content?: string;
  imageUrl?: string;
  error?: string;
}

/**
 * Generate AI content using Lovable AI Gateway with Gemini models
 * Uses google/gemini-2.5-flash by default (free during testing period)
 */
export async function generateAIContent(
  request: GenerateContentRequest
): Promise<GenerateContentResponse> {
  try {
    const { data, error } = await supabase.functions.invoke("ai-generate-content", {
      body: {
        prompt: request.prompt,
        type: request.type || "text",
        model: request.model || "google/gemini-2.5-flash",
      },
    });

    if (error) {
      console.error("AI generation error:", error);
      throw new Error(error.message || "Failed to generate content");
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error("AI client error:", error);
    throw error;
  }
}
