import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, Loader2 } from "lucide-react";
import { aiService } from "@/services/aiService";
import { useToast } from "@/components/ui/use-toast";
import type { Pipeline } from "./pipeline-builder";

interface PipelineTesterProps {
  pipeline: Pipeline;
}

export function PipelineTester({ pipeline }: PipelineTesterProps) {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testPrompt, setTestPrompt] = useState(pipeline.prompt);

  const handleTest = async () => {
    if (!testPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to test",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      let result;

      if (pipeline.type === "image") {
        result = await aiService.generateImage({
          prompt: testPrompt
        });
        toast({
          title: "Success",
          description: "Image generated successfully"
        });
      } else {
        // For video, we'll use text generation as a placeholder
        result = await aiService.generateContent({
          prompt: testPrompt,
          stepType: 'video-description'
        });
        toast({
          title: "Success",
          description: "Video description generated (actual video generation coming soon)"
        });
      }

      setTestResult(result);
    } catch (error: any) {
      console.error('Test error:', error);
      toast({
        title: "Test Failed",
        description: error.message || "Failed to test pipeline",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Play className="h-4 w-4" />
          Test Pipeline with Gemini AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Prompt</label>
          <Textarea
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="Enter a prompt to test the pipeline..."
            className="min-h-[100px]"
          />
        </div>

        <Button
          onClick={handleTest}
          disabled={isTesting}
          className="w-full"
        >
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating with Gemini...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Test {pipeline.type === "image" ? "Image" : "Video"} Generation
            </>
          )}
        </Button>

        {testResult && (
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium">Result:</label>
            <div className="p-4 bg-muted rounded-lg">
              {pipeline.type === "image" && testResult.imageUrl ? (
                <div className="space-y-2">
                  <img
                    src={testResult.imageUrl}
                    alt="Generated"
                    className="max-w-full h-auto rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Generation ID: {testResult.generationId}
                  </p>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
