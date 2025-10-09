import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiService } from "@/services/aiService";

interface PipelineStep {
  id: string;
  type: 'text_generation' | 'image_generation' | 'image_analysis';
  config: {
    prompt?: string;
    systemPrompt?: string;
    imageUrl?: string;
  };
}

interface TestPipelineDialogProps {
  steps: PipelineStep[];
}

export function TestPipelineDialog({ steps }: TestPipelineDialogProps) {
  const [open, setOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<Record<string, any>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const executeStep = async (step: PipelineStep, index: number) => {
    try {
      let result: any;

      switch (step.type) {
        case 'text_generation':
          const textPrompt = inputs[`step_${index}_prompt`] || step.config.prompt || 'Generate some content';
          result = await aiService.generateText({
            prompt: textPrompt,
            systemPrompt: step.config.systemPrompt
          });
          break;

        case 'image_generation':
          const imagePrompt = inputs[`step_${index}_prompt`] || step.config.prompt || 'Generate an image';
          result = await aiService.generateImage({
            prompt: imagePrompt
          });
          break;

        case 'image_analysis':
          const analysisPrompt = inputs[`step_${index}_prompt`] || step.config.prompt || 'Analyze this image';
          const imageUrl = inputs[`step_${index}_imageUrl`] || step.config.imageUrl;
          if (!imageUrl) throw new Error('Image URL required for analysis');
          
          result = await aiService.analyzeImage({
            imageUrl,
            prompt: analysisPrompt
          });
          break;

        default:
          throw new Error(`Unknown step type: ${step.type}`);
      }

      return result;
    } catch (error: any) {
      console.error(`Error executing step ${index}:`, error);
      throw error;
    }
  };

  const handleExecutePipeline = async () => {
    setIsExecuting(true);
    setResults({});

    try {
      const stepResults: Record<string, any> = {};

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        toast({
          title: `Executing step ${i + 1}/${steps.length}`,
          description: `Running ${step.type}...`,
        });

        const result = await executeStep(step, i);
        stepResults[`step_${i}`] = {
          type: step.type,
          result
        };
      }

      setResults(stepResults);
      toast({
        title: "Pipeline executed successfully",
        description: `Completed ${steps.length} steps`,
      });
    } catch (error: any) {
      toast({
        title: "Pipeline execution failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Play className="h-4 w-4 mr-2" />
          Test Pipeline
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Test Pipeline Execution</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">
                Step {index + 1}: {step.type.replace('_', ' ').toUpperCase()}
              </h3>

              {step.type === 'image_analysis' && (
                <div className="space-y-2">
                  <Label htmlFor={`step_${index}_imageUrl`}>Image URL</Label>
                  <Input
                    id={`step_${index}_imageUrl`}
                    placeholder="Enter image URL..."
                    value={inputs[`step_${index}_imageUrl`] || step.config.imageUrl || ''}
                    onChange={(e) => setInputs(prev => ({ ...prev, [`step_${index}_imageUrl`]: e.target.value }))}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`step_${index}_prompt`}>Prompt</Label>
                <Input
                  id={`step_${index}_prompt`}
                  placeholder="Enter prompt..."
                  value={inputs[`step_${index}_prompt`] || step.config.prompt || ''}
                  onChange={(e) => setInputs(prev => ({ ...prev, [`step_${index}_prompt`]: e.target.value }))}
                />
              </div>

              {results[`step_${index}`] && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-2">Result:</p>
                  {results[`step_${index}`].type === 'image_generation' ? (
                    <img 
                      src={results[`step_${index}`].result} 
                      alt="Generated" 
                      className="max-w-full h-auto rounded"
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{results[`step_${index}`].result}</p>
                  )}
                </div>
              )}
            </div>
          ))}

          <Button
            onClick={handleExecutePipeline}
            disabled={isExecuting || steps.length === 0}
            className="w-full"
          >
            {isExecuting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Executing Pipeline...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Execute Pipeline
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
