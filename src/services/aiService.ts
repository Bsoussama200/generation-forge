import { supabase } from "@/integrations/supabase/client";

export interface GenerateContentRequest {
  prompt: string;
  stepType: string;
}

export interface GenerateImageRequest {
  prompt: string;
  inputImageUrl?: string;
}

export interface AnalyzeImageRequest {
  imageUrl: string;
  prompt: string;
}

export const aiService = {
  async generateContent(request: GenerateContentRequest) {
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: request
    });

    if (error) throw error;
    return data;
  },

  async generateImage(request: GenerateImageRequest) {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: request
    });

    if (error) throw error;
    return data;
  },

  async analyzeImage(request: AnalyzeImageRequest) {
    const { data, error } = await supabase.functions.invoke('analyze-image', {
      body: request
    });

    if (error) throw error;
    return data;
  }
};
