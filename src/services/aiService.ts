import { supabase } from "@/integrations/supabase/client";

export interface GenerateTextParams {
  prompt: string;
  systemPrompt?: string;
}

export interface GenerateImageParams {
  prompt: string;
}

export interface AnalyzeImageParams {
  imageUrl: string;
  prompt?: string;
}

export const aiService = {
  async generateText({ prompt, systemPrompt }: GenerateTextParams): Promise<string> {
    const { data, error } = await supabase.functions.invoke('ai-generate-text', {
      body: { prompt, systemPrompt }
    });

    if (error) throw error;
    if (!data?.text) throw new Error('No text generated');
    
    return data.text;
  },

  async generateImage({ prompt }: GenerateImageParams): Promise<string> {
    const { data, error } = await supabase.functions.invoke('ai-generate-image', {
      body: { prompt }
    });

    if (error) throw error;
    if (!data?.imageUrl) throw new Error('No image generated');
    
    return data.imageUrl;
  },

  async analyzeImage({ imageUrl, prompt }: AnalyzeImageParams): Promise<string> {
    const { data, error } = await supabase.functions.invoke('ai-analyze-image', {
      body: { imageUrl, prompt }
    });

    if (error) throw error;
    if (!data?.analysis) throw new Error('No analysis generated');
    
    return data.analysis;
  }
};
