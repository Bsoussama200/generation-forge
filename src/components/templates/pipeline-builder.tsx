import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { aiService } from "@/services/aiService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  Image as ImageIcon, 
  Video, 
  Type, 
  Upload,
  HelpCircle,
  Sparkles,
  Play,
  ChevronDown
} from "lucide-react";
import { PipelineInputCollector } from "./pipeline-input-collector";
import { PipelineTester } from "./pipeline-tester";

export interface Pipeline {
  id: string;
  name: string;
  type: "image" | "video";
  prompt: string;
  inputs: PipelineInput[];
}

export interface GlobalInput {
  id: string;
  name: string;
  type: "text" | "image";
  placeholder?: string;
  description?: string;
  exampleValue?: string;
  guideImage?: string;
}

export interface PipelineInput {
  id: string;
  name: string;
  type: "text" | "image";
  inputSource: "user" | "static";
  placeholder?: string;
  description?: string;
  exampleValue?: string;
  guideImage?: string;
  staticValue?: string;
  staticImage?: string;
  staticImageFile?: string;
  editWithAi?: boolean;
  imagePrompt?: string;
  nestedInputs?: PipelineInput[];
  isGlobalInput?: boolean;
  globalInputId?: string;
  analyseWithAi?: boolean;
  analysisPrompt?: string;
  useImageAsPipelineInput?: boolean;
}

interface PipelineBuilderProps {
  pipelines: Pipeline[];
  onPipelinesChange: (pipelines: Pipeline[]) => void;
  globalInputs?: GlobalInput[];
  onGlobalInputsChange?: (globalInputs: GlobalInput[]) => void;
}

export function PipelineBuilder({ 
  pipelines, 
  onPipelinesChange, 
  globalInputs = [], 
  onGlobalInputsChange 
}: PipelineBuilderProps) {
  const { toast } = useToast();
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [runningPipeline, setRunningPipeline] = useState<Pipeline | null>(null);
  const [isInputCollectorOpen, setIsInputCollectorOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [runResult, setRunResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isGlobalInputsCollapsed, setIsGlobalInputsCollapsed] = useState(true);

  const addPipeline = (type: "image" | "video") => {
    if (pipelines.length >= 10) return;
    
    const newPipeline: Pipeline = {
      id: `pipeline-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Pipeline ${pipelines.length + 1}`,
      type,
      prompt: `Create a ${type} with the following elements:`,
      inputs: []
    };
    
    onPipelinesChange([...pipelines, newPipeline]);
  };

  const deletePipeline = (pipelineId: string) => {
    onPipelinesChange(pipelines.filter(p => p.id !== pipelineId));
  };

  const editPipeline = (pipeline: Pipeline) => {
    setEditingPipeline({ ...pipeline });
    setIsDialogOpen(true);
  };

  const savePipeline = (updatedPipeline: Pipeline) => {
    onPipelinesChange(
      pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p)
    );
    setEditingPipeline(null);
    setIsDialogOpen(false);
  };

  const initiatePipelineRun = (pipeline: Pipeline) => {
    setRunningPipeline(pipeline);
    
    // Check if there are user inputs that need to be collected
    const userInputs = pipeline.inputs.filter(input => 
      input.inputSource === "user" && !input.editWithAi
    );
    
    const nestedUserInputs = pipeline.inputs.some(input => 
      input.editWithAi && input.nestedInputs?.some(ni => ni.inputSource === "user")
    );

    if (userInputs.length > 0 || nestedUserInputs) {
      // Show input collector dialog
      setIsInputCollectorOpen(true);
    } else {
      // Run directly if no user inputs needed
      runPipeline(pipeline, [], []);
    }
  };

  const runPipeline = async (
    pipeline: Pipeline, 
    collectedInputs: Array<{inputId: string, value: string | File, type: "text" | "image"}>,
    collectedNestedInputs: Array<{parentInputId: string, nestedInputId: string, value: string | File, type: "text" | "image"}>,
    collectedGlobalInputs: Array<{inputId: string, value: string | File, type: "text" | "image"}> = []
  ) => {
    setIsRunDialogOpen(true);
    setIsRunning(true);
    setRunResult(null);

    // Log collected inputs for debugging
    console.log("Running pipeline with inputs:", { collectedInputs, collectedNestedInputs, collectedGlobalInputs });

    try {
      // Build the prompt with collected inputs
      let finalPrompt = pipeline.prompt;
      
      // Add collected text inputs to the prompt
      collectedInputs.forEach(input => {
        if (input.type === 'text' && typeof input.value === 'string') {
          finalPrompt += `\n- ${input.value}`;
        }
      });

      let result;
      
      if (pipeline.type === "image") {
        // Generate image using Gemini
        result = await aiService.generateImage({
          prompt: finalPrompt
        });
        setRunResult(result.imageUrl);
        
        toast({
          title: "Success",
          description: "Image generated successfully with Gemini AI"
        });
      } else {
        // For video, generate text description for now
        result = await aiService.generateContent({
          prompt: finalPrompt,
          stepType: 'video-description'
        });
        
        // For video, we'll show a placeholder with the description
        setRunResult(`Video generation result: ${result.content}`);
        
        toast({
          title: "Success",
          description: "Video description generated (full video generation coming soon)"
        });
      }
    } catch (error: any) {
      console.error('Pipeline execution error:', error);
      toast({
        title: "Pipeline Failed",
        description: error.message || "Failed to execute pipeline",
        variant: "destructive"
      });
      setRunResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  const movePipeline = (fromIndex: number, toIndex: number) => {
    const updated = [...pipelines];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onPipelinesChange(updated);
  };

  const addGlobalInput = (type: "text" | "image") => {
    if (!onGlobalInputsChange) return;
    
    const newGlobalInput: GlobalInput = {
      id: `global-input-${Date.now()}`,
      name: `Global ${type} Input ${globalInputs.length + 1}`,
      type,
      placeholder: type === "text" ? "Enter text..." : undefined,
      exampleValue: type === "text" ? "Example text" : undefined,
      description: `A global ${type} input that can be used across all pipelines`
    };
    
    onGlobalInputsChange([...globalInputs, newGlobalInput]);
  };

  const updateGlobalInput = (inputId: string, updates: Partial<GlobalInput>) => {
    if (!onGlobalInputsChange) return;
    
    onGlobalInputsChange(
      globalInputs.map(input => 
        input.id === inputId ? { ...input, ...updates } : input
      )
    );
  };

  const deleteGlobalInput = (inputId: string) => {
    if (!onGlobalInputsChange) return;
    
    // Remove the global input
    onGlobalInputsChange(globalInputs.filter(input => input.id !== inputId));
    
    // Remove any pipeline inputs that reference this global input
    const updatedPipelines = pipelines.map(pipeline => ({
      ...pipeline,
      inputs: pipeline.inputs.filter(input => 
        !(input.isGlobalInput && input.globalInputId === inputId)
      ).map(input => ({
        ...input,
        // Also clean up nested inputs that might reference the global input
        nestedInputs: input.nestedInputs?.filter(nestedInput => 
          !(nestedInput.isGlobalInput && nestedInput.globalInputId === inputId)
        )
      }))
    }));
    
    onPipelinesChange(updatedPipelines);
  };

  const handleGlobalGuideImageUpload = (inputId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateGlobalInput(inputId, { guideImage: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Global Inputs Section */}
      {onGlobalInputsChange && (
        <Collapsible open={!isGlobalInputsCollapsed} onOpenChange={(open) => setIsGlobalInputsCollapsed(!open)}>
          <Card className="bg-gradient-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                  <div className="cursor-pointer hover:bg-muted/5 transition-colors rounded p-1 -m-1">
                    <CardTitle className="text-base">Global Inputs</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Inputs that can be used across all pipelines
                    </p>
                  </div>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2">
                  {!isGlobalInputsCollapsed && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        onClick={() => addGlobalInput("text")}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Type className="h-4 w-4" />
                        Add Text Input
                      </Button>
                      <Button 
                        onClick={() => addGlobalInput("image")}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Add Image Input
                      </Button>
                    </div>
                  )}
                  <CollapsibleTrigger asChild>
                    <button className="p-1 hover:bg-muted/20 rounded transition-colors">
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform duration-200 text-muted-foreground ${
                          isGlobalInputsCollapsed ? 'rotate-0' : 'rotate-180'
                        }`} 
                      />
                    </button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </CardHeader>
            
            <CollapsibleContent>
              {globalInputs.length > 0 ? (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {globalInputs.map((input) => (
                      <div key={input.id} className="p-4 bg-background/50 rounded-lg border space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {input.type === "text" ? (
                              <Type className="h-4 w-4 text-primary" />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-primary" />
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {input.type}
                            </Badge>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteGlobalInput(input.id)}
                            className="gap-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Input Name</Label>
                            <Input
                              value={input.name}
                              onChange={(e) => updateGlobalInput(input.id, { name: e.target.value })}
                              placeholder="Input name"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Description</Label>
                            <Input
                              value={input.description || ""}
                              onChange={(e) => updateGlobalInput(input.id, { description: e.target.value })}
                              placeholder="Description"
                              className="text-sm"
                            />
                          </div>
                        </div>
                        
                        {input.type === "text" ? (
                          <div className="space-y-1">
                            <Label className="text-xs">Example Value</Label>
                            <Input
                              value={input.exampleValue || ""}
                              onChange={(e) => updateGlobalInput(input.id, { exampleValue: e.target.value })}
                              placeholder="Example text..."
                              className="text-sm"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Label className="text-xs flex items-center gap-1">
                              Guide Image
                              <HelpCircle className="h-3 w-3 text-muted-foreground" />
                            </Label>
                            <div className="border-2 border-dashed border-border rounded-lg p-3 text-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleGlobalGuideImageUpload(input.id, e)}
                                className="hidden"
                                id={`global-guide-image-${input.id}`}
                              />
                              <label htmlFor={`global-guide-image-${input.id}`} className="cursor-pointer">
                                {input.guideImage ? (
                                  <div className="space-y-1">
                                    <img 
                                      src={input.guideImage} 
                                      alt="Global guide image preview" 
                                      className="max-h-20 mx-auto rounded object-cover"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Click to change guide image
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    <Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">
                                      Upload guide image for users
                                    </p>
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-0 pb-6">
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">No global inputs yet. Add text or image inputs to share across all pipelines.</p>
                  </div>
                </CardContent>
              )}
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Pipelines Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Pipelines ({pipelines.length}/10)</h3>
          <p className="text-sm text-muted-foreground">
            Configure up to 10 AI processing pipelines for your template
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={() => addPipeline("image")}
            disabled={pipelines.length >= 10}
            className="gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            Add Image Pipeline
          </Button>
          <Button 
            onClick={() => addPipeline("video")}
            disabled={pipelines.length >= 10}
            className="gap-2"
          >
            <Video className="h-4 w-4" />
            Add Video Pipeline
          </Button>
        </div>
      </div>

      {/* Pipelines List */}
      <div className="space-y-3">
        {pipelines.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center py-12">
              <div className="p-3 bg-muted rounded-full w-fit mx-auto mb-4">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">No pipelines yet</h3>
              <p className="text-sm text-muted-foreground">
                Add your first pipeline to start building your template
              </p>
            </CardContent>
          </Card>
        ) : (
          pipelines.map((pipeline, index) => (
            <Card key={pipeline.id} className="bg-gradient-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {pipeline.type === "image" ? (
                        <ImageIcon className="h-4 w-4 text-primary" />
                      ) : (
                        <Video className="h-4 w-4 text-primary" />
                      )}
                      {pipeline.name}
                      <Badge variant="secondary" className="text-xs">
                        {pipeline.type}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {pipeline.inputs.length} input{pipeline.inputs.length !== 1 ? 's' : ''} configured
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => initiatePipelineRun(pipeline)}
                      className="gap-1 neon-border hover:bg-primary/10"
                    >
                      <Play className="h-3 w-3" />
                      Run
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editPipeline(pipeline)}
                      className="gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePipeline(pipeline.id)}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Pipeline Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPipeline?.name || "Edit Pipeline"}
            </DialogTitle>
            <DialogDescription>
              Configure the pipeline settings and inputs
            </DialogDescription>
          </DialogHeader>
          
          {editingPipeline && (
            <>
              <PipelineEditor
                pipeline={editingPipeline}
                onSave={savePipeline}
                onCancel={() => setIsDialogOpen(false)}
                globalInputs={globalInputs}
              />
              <PipelineTester pipeline={editingPipeline} />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Pipeline Input Collector */}
      <PipelineInputCollector
        pipeline={runningPipeline}
        globalInputs={globalInputs}
        isOpen={isInputCollectorOpen}
        onClose={() => setIsInputCollectorOpen(false)}
        onRun={(inputs, nestedInputs, globalInputs) => runPipeline(runningPipeline!, inputs, nestedInputs, globalInputs)}
      />

      {/* Pipeline Run Dialog */}
      <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Running {runningPipeline?.name}
            </DialogTitle>
            <DialogDescription>
              Testing pipeline execution
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isRunning ? (
              <div className="text-center space-y-4">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-muted-foreground">
                  Processing {runningPipeline?.type} pipeline...
                </p>
              </div>
            ) : runResult ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-primary mb-2">
                    ✓ Pipeline completed successfully
                  </p>
                  <img 
                    src={runResult} 
                    alt="Pipeline output" 
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsRunDialogOpen(false)}
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PipelineEditorProps {
  pipeline: Pipeline;
  onSave: (pipeline: Pipeline) => void;
  onCancel: () => void;
  globalInputs?: GlobalInput[];
}

function PipelineEditor({ pipeline, onSave, onCancel, globalInputs = [] }: PipelineEditorProps) {
  const [editedPipeline, setEditedPipeline] = useState<Pipeline>(pipeline);
  const [showGlobalInputSelect, setShowGlobalInputSelect] = useState(false);

  const addInput = (type: "text" | "image") => {
    const newInput: PipelineInput = {
      id: `input-${Date.now()}`,
      name: `${type} Input ${editedPipeline.inputs.length + 1}`,
      type,
      inputSource: "user",
      placeholder: type === "text" ? "Enter text..." : undefined,
      exampleValue: type === "text" ? "Example text" : undefined
    };
    
    const updatedInputs = [...editedPipeline.inputs, newInput];
    let updatedPrompt = editedPipeline.prompt;
    
    // Auto-add text inputs to prompt
    if (type === "text") {
      updatedPrompt += ` {{${newInput.name}}}`;
    }
    
    setEditedPipeline({
      ...editedPipeline,
      inputs: updatedInputs,
      prompt: updatedPrompt
    });
  };

  const addGlobalInputToPipeline = (globalInput: GlobalInput) => {
    const newInput: PipelineInput = {
      id: `input-${Date.now()}`,
      name: globalInput.name,
      type: globalInput.type,
      inputSource: "user",
      placeholder: globalInput.placeholder,
      description: globalInput.description,
      exampleValue: globalInput.exampleValue,
      isGlobalInput: true,
      globalInputId: globalInput.id
    };
    
    const updatedInputs = [...editedPipeline.inputs, newInput];
    let updatedPrompt = editedPipeline.prompt;
    
    // Auto-add text inputs to prompt
    if (globalInput.type === "text") {
      updatedPrompt += ` {{${newInput.name}}}`;
    }
    
    setEditedPipeline({
      ...editedPipeline,
      inputs: updatedInputs,
      prompt: updatedPrompt
    });
    
    setShowGlobalInputSelect(false);
  };

  const updateInput = (inputId: string, updates: Partial<PipelineInput>) => {
    const currentInput = editedPipeline.inputs.find(input => input.id === inputId);
    let updatedPrompt = editedPipeline.prompt;
    
    // If updating the name of a text input, update the prompt references
    if (updates.name && currentInput?.type === "text" && currentInput.name !== updates.name) {
      const oldReference = `{{${currentInput.name}}}`;
      const newReference = `{{${updates.name}}}`;
      updatedPrompt = updatedPrompt.replace(new RegExp(oldReference.replace(/[{}]/g, '\\$&'), 'g'), newReference);
    }
    
    // If toggling the analyseWithAi checkbox for image inputs
    if (updates.hasOwnProperty('analyseWithAi') && currentInput?.type === "image") {
      const analysisReference = `{{Analysis of ${currentInput.name}}}`;
      
      if (updates.analyseWithAi) {
        // Add the analysis reference to the prompt if not already present
        if (!updatedPrompt.includes(analysisReference)) {
          updatedPrompt = updatedPrompt.trim() + ` ${analysisReference}`;
        }
      } else {
        // Remove the analysis reference from the prompt
        updatedPrompt = updatedPrompt.replace(new RegExp(analysisReference.replace(/[{}]/g, '\\$&'), 'g'), '');
        // Clean up any extra spaces
        updatedPrompt = updatedPrompt.replace(/\s+/g, ' ').trim();
      }
    }
    
    // If updating the name of an image input that has AI analysis enabled, update analysis references
    if (updates.name && currentInput?.type === "image" && currentInput.analyseWithAi && currentInput.name !== updates.name) {
      const oldAnalysisReference = `{{Analysis of ${currentInput.name}}}`;
      const newAnalysisReference = `{{Analysis of ${updates.name}}}`;
      updatedPrompt = updatedPrompt.replace(new RegExp(oldAnalysisReference.replace(/[{}]/g, '\\$&'), 'g'), newAnalysisReference);
    }
    
    setEditedPipeline({
      ...editedPipeline,
      prompt: updatedPrompt,
      inputs: editedPipeline.inputs.map(input =>
        input.id === inputId ? { ...input, ...updates } : input
      )
    });
  };

  const handleStaticImageUpload = (inputId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateInput(inputId, { staticImageFile: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuideImageUpload = (inputId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateInput(inputId, { guideImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteInput = (inputId: string) => {
    const inputToDelete = editedPipeline.inputs.find(input => input.id === inputId);
    let updatedPrompt = editedPipeline.prompt;
    
    // If deleting a text input, remove its reference from the prompt
    if (inputToDelete?.type === "text") {
      const referenceToRemove = `{{${inputToDelete.name}}}`;
      updatedPrompt = updatedPrompt.replace(new RegExp(referenceToRemove.replace(/[{}]/g, '\\$&'), 'g'), '');
      // Clean up any extra spaces
      updatedPrompt = updatedPrompt.replace(/\s+/g, ' ').trim();
    }
    
    // If deleting an image input with AI analysis, remove its analysis reference from the prompt
    if (inputToDelete?.type === "image" && inputToDelete.analyseWithAi) {
      const analysisReferenceToRemove = `{{Analysis of ${inputToDelete.name}}}`;
      updatedPrompt = updatedPrompt.replace(new RegExp(analysisReferenceToRemove.replace(/[{}]/g, '\\$&'), 'g'), '');
      // Clean up any extra spaces
      updatedPrompt = updatedPrompt.replace(/\s+/g, ' ').trim();
    }
    
    setEditedPipeline({
      ...editedPipeline,
      prompt: updatedPrompt,
      inputs: editedPipeline.inputs.filter(input => input.id !== inputId)
    });
  };

  const addNestedInput = (parentInputId: string, type: "text" | "image") => {
    const newNestedInput: PipelineInput = {
      id: `nested-input-${Date.now()}`,
      name: `${type} Input`,
      type,
      inputSource: "user",
      exampleValue: type === "text" ? "Example text" : undefined
    };

    setEditedPipeline({
      ...editedPipeline,
      inputs: editedPipeline.inputs.map(input => {
        if (input.id === parentInputId) {
          const updatedNestedInputs = [...(input.nestedInputs || []), newNestedInput];
          let updatedImagePrompt = input.imagePrompt || "";
          
          // Auto-add text inputs to image prompt
          if (type === "text") {
            updatedImagePrompt += ` {{${newNestedInput.name}}}`;
          }
          
          return { 
            ...input, 
            nestedInputs: updatedNestedInputs,
            imagePrompt: updatedImagePrompt
          };
        }
        return input;
      })
    });
  };

  const addGlobalNestedInput = (parentInputId: string, globalInputId: string) => {
    const globalInput = globalInputs.find(gi => gi.id === globalInputId);
    if (!globalInput) return;

    const newNestedInput: PipelineInput = {
      id: `nested-global-${Date.now()}`,
      name: globalInput.name,
      type: globalInput.type,
      inputSource: "user",
      placeholder: globalInput.placeholder,
      description: globalInput.description,
      exampleValue: globalInput.exampleValue,
      isGlobalInput: true,
      globalInputId: globalInput.id
    };

    setEditedPipeline({
      ...editedPipeline,
      inputs: editedPipeline.inputs.map(input => {
        if (input.id === parentInputId) {
          const updatedNestedInputs = [...(input.nestedInputs || []), newNestedInput];
          let updatedImagePrompt = input.imagePrompt || "";
          
          // Auto-add text inputs to image prompt
          if (globalInput.type === "text") {
            updatedImagePrompt += ` {{${newNestedInput.name}}}`;
          }
          
          return { 
            ...input, 
            nestedInputs: updatedNestedInputs,
            imagePrompt: updatedImagePrompt
          };
        }
        return input;
      })
    });
  };

  const updateNestedInput = (parentInputId: string, nestedInputId: string, updates: Partial<PipelineInput>) => {
    setEditedPipeline({
      ...editedPipeline,
      inputs: editedPipeline.inputs.map(input => {
        if (input.id === parentInputId) {
          const currentNestedInput = input.nestedInputs?.find(ni => ni.id === nestedInputId);
          let updatedImagePrompt = input.imagePrompt || "";
          
          // If updating the name of a nested text input, update the image prompt references
          if (updates.name && currentNestedInput?.type === "text" && currentNestedInput.name !== updates.name) {
            const oldReference = `{{${currentNestedInput.name}}}`;
            const newReference = `{{${updates.name}}}`;
            updatedImagePrompt = updatedImagePrompt.replace(new RegExp(oldReference.replace(/[{}]/g, '\\$&'), 'g'), newReference);
          }
          
          return {
            ...input,
            imagePrompt: updatedImagePrompt,
            nestedInputs: input.nestedInputs?.map(nestedInput =>
              nestedInput.id === nestedInputId ? { ...nestedInput, ...updates } : nestedInput
            )
          };
        }
        return input;
      })
    });
  };

  const handleNestedStaticImageUpload = (parentInputId: string, nestedInputId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateNestedInput(parentInputId, nestedInputId, { staticImageFile: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNestedGuideImageUpload = (parentInputId: string, nestedInputId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateNestedInput(parentInputId, nestedInputId, { guideImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteNestedInput = (parentInputId: string, nestedInputId: string) => {
    setEditedPipeline({
      ...editedPipeline,
      inputs: editedPipeline.inputs.map(input => {
        if (input.id === parentInputId) {
          const nestedInputToDelete = input.nestedInputs?.find(ni => ni.id === nestedInputId);
          let updatedImagePrompt = input.imagePrompt || "";
          
          // If deleting a nested text input, remove its reference from the image prompt
          if (nestedInputToDelete?.type === "text") {
            const referenceToRemove = `{{${nestedInputToDelete.name}}}`;
            updatedImagePrompt = updatedImagePrompt.replace(new RegExp(referenceToRemove.replace(/[{}]/g, '\\$&'), 'g'), '');
            // Clean up any extra spaces
            updatedImagePrompt = updatedImagePrompt.replace(/\s+/g, ' ').trim();
          }
          
          return {
            ...input,
            imagePrompt: updatedImagePrompt,
            nestedInputs: input.nestedInputs?.filter(nestedInput => nestedInput.id !== nestedInputId)
          };
        }
        return input;
      })
    });
  };

  const generatePromptPreview = () => {
    const userTextInputs = editedPipeline.inputs.filter(
      input => input.type === "text" && input.inputSource === "user"
    );
    
    if (userTextInputs.length === 0) {
      return "No text inputs configured yet";
    }
    
    return `Create a ${editedPipeline.type} with the following: ` +
      userTextInputs.map(input => `{{${input.name}}}`).join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pipeline-name">Pipeline Name</Label>
          <Input
            id="pipeline-name"
            value={editedPipeline.name}
            onChange={(e) => setEditedPipeline({
              ...editedPipeline,
              name: e.target.value
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pipeline-type">Pipeline Type</Label>
          <Select
            value={editedPipeline.type}
            onValueChange={(value: "image" | "video") =>
              setEditedPipeline({ ...editedPipeline, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image Pipeline</SelectItem>
              <SelectItem value="video">Video Pipeline</SelectItem>
            </SelectContent>
          </Select>
      </div>

      {/* Prompt Section - Always visible */}
      <div className="space-y-2 w-full">
        <Label htmlFor="pipeline-prompt">Prompt Template *</Label>
        <Textarea
          id="pipeline-prompt"
          value={editedPipeline.prompt}
          onChange={(e) => setEditedPipeline({
            ...editedPipeline,
            prompt: e.target.value
          })}
          placeholder={`Describe how to generate ${editedPipeline.type} content...`}
          rows={4}
          className="resize-none w-full min-w-0 max-w-none"
        />
      </div>
      </div>

      {/* Inputs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Pipeline Inputs</h4>
            <p className="text-sm text-muted-foreground">
              Configure what data users will provide
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => addInput("text")}
              className="gap-2"
              size="lg"
            >
              <Type className="h-4 w-4" />
              Add Text Input
            </Button>
            <Button
              onClick={() => addInput("image")}
              className="gap-2"
              size="lg"
            >
              <ImageIcon className="h-4 w-4" />
              Add Image Input
            </Button>
            {globalInputs.length > 0 && (
              <div className="relative">
                <Button
                  onClick={() => setShowGlobalInputSelect(!showGlobalInputSelect)}
                  variant="outline"
                  className="gap-2"
                  size="lg"
                >
                  <Sparkles className="h-4 w-4" />
                  Use Global Input
                </Button>
                
                {showGlobalInputSelect && (
                  <Card className="absolute top-full mt-2 right-0 z-10 min-w-64 bg-background border shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Select Global Input</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {globalInputs.map((globalInput) => (
                        <Button
                          key={globalInput.id}
                          variant="ghost"
                          className="w-full justify-start gap-2 text-left"
                          onClick={() => addGlobalInputToPipeline(globalInput)}
                        >
                          {globalInput.type === "text" ? (
                            <Type className="h-4 w-4" />
                          ) : (
                            <ImageIcon className="h-4 w-4" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{globalInput.name}</div>
                            {globalInput.description && (
                              <div className="text-xs text-muted-foreground">
                                {globalInput.description}
                              </div>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {globalInput.type}
                          </Badge>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Inputs List */}
        <div className="space-y-3">
          {editedPipeline.inputs.map((input, index) => (
            <Card key={input.id} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {input.type === "text" ? (
                      <Type className="h-6 w-6 text-primary" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-primary" />
                    )}
                    <Badge variant="secondary">{input.type}</Badge>
                    {input.isGlobalInput ? (
                      <Badge variant="default" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        Global
                      </Badge>
                    ) : input.editWithAi ? (
                      <Badge variant="default" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI
                      </Badge>
                    ) : (
                      <Badge variant="default">
                        {input.inputSource}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteInput(input.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {input.isGlobalInput ? (
                  // Read-only display for global inputs
                  <div className="bg-muted/50 rounded-lg p-4 border border-dashed">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-muted-foreground">Global Input:</Label>
                        <span className="font-medium">{input.name}</span>
                      </div>
                      {input.description && (
                        <div className="flex items-start gap-2">
                          <Label className="text-muted-foreground">Description:</Label>
                          <span className="text-sm">{input.description}</span>
                        </div>
                      )}
                      {input.placeholder && (
                        <div className="flex items-center gap-2">
                          <Label className="text-muted-foreground">Placeholder:</Label>
                          <span className="text-sm text-muted-foreground">{input.placeholder}</span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        This is a global input and cannot be edited here. Modify it in the Global Inputs section above.
                      </p>
                    </div>
                  </div>
                ) : (
                  // Editable fields for regular inputs
                  <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Input Name</Label>
                    <Input
                      value={input.name}
                      onChange={(e) => updateInput(input.id, { name: e.target.value })}
                    />
                  </div>
                  {input.type === "text" ? (
                    <div className="space-y-2">
                      <Label>Example Value</Label>
                      <Input
                        value={input.exampleValue || ""}
                        onChange={(e) => updateInput(input.id, { exampleValue: e.target.value })}
                        placeholder="Example to show users"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Input Source</Label>
                      <Select
                        value={input.editWithAi ? "generate-with-ai" : input.inputSource}
                        onValueChange={(value: "user" | "static" | "generate-with-ai") => {
                          if (value === "generate-with-ai") {
                            updateInput(input.id, { 
                              inputSource: "user", 
                              editWithAi: true,
                              imagePrompt: "Create an image with the following elements:",
                              nestedInputs: []
                            });
                          } else {
                            updateInput(input.id, { 
                              inputSource: value as "user" | "static", 
                              editWithAi: false,
                              imagePrompt: undefined,
                              nestedInputs: undefined
                            });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User Input</SelectItem>
                          <SelectItem value="static">Static Input</SelectItem>
                          {editedPipeline.type === "video" && (
                            <SelectItem value="generate-with-ai">Generate with AI</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {input.type === "text" && (
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={input.description || ""}
                      onChange={(e) => updateInput(input.id, { description: e.target.value })}
                      placeholder="Describe what this input is for..."
                      rows={2}
                    />
                  </div>
                )}

                {input.type === "image" && input.editWithAi && (
                    <div className="space-y-4 border-l-4 border-primary/30 pl-4 bg-primary/5 rounded-r-lg">
                     <div className="flex items-center gap-2 text-primary">
                       <Sparkles className="h-4 w-4" />
                       <span className="text-sm font-medium">AI Image Generation</span>
                     </div>
                    <div className="space-y-2">
                      <Label>Image Generation Prompt</Label>
                      <Textarea
                        value={input.imagePrompt || ""}
                        onChange={(e) => updateInput(input.id, { imagePrompt: e.target.value })}
                        placeholder="Describe how to generate the image..."
                        rows={3}
                      />
                    </div>
                    
                    {/* Nested Inputs */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-sm">Image Generation Inputs</h5>
                          <p className="text-xs text-muted-foreground">
                            Configure what data will be used to generate this image
                          </p>
                        </div>
                         <div className="flex gap-2">
                           <Button
                             onClick={() => addNestedInput(input.id, "text")}
                             className="gap-2"
                             size="sm"
                           >
                             <Type className="h-3 w-3" />
                             Add Text Input
                           </Button>
                           <Button
                             onClick={() => addNestedInput(input.id, "image")}
                             className="gap-2"
                             size="sm"
                           >
                             <ImageIcon className="h-3 w-3" />
                             Add Image Input
                           </Button>
                            {globalInputs.length > 0 && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="gap-2"
                                    size="sm"
                                  >
                                    <Sparkles className="h-3 w-3" />
                                    Use Global Input
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-background border shadow-lg">
                                  {globalInputs.map((globalInput) => (
                                    <DropdownMenuItem 
                                      key={globalInput.id} 
                                      onClick={() => addGlobalNestedInput(input.id, globalInput.id)}
                                      className="flex items-center gap-2 cursor-pointer"
                                    >
                                      {globalInput.type === "text" ? (
                                        <Type className="h-3 w-3" />
                                      ) : (
                                        <ImageIcon className="h-3 w-3" />
                                      )}
                                      {globalInput.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                         </div>
                      </div>

                      {/* Nested Inputs List */}
                      {input.nestedInputs && input.nestedInputs.length > 0 ? (
                        <div className="space-y-2">
                          {input.nestedInputs.map((nestedInput) => (
                            <Card key={nestedInput.id} className="p-3 bg-background/50">
                              <div className="space-y-3">
                                 <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                     {nestedInput.type === "text" ? (
                                       <Type className="h-4 w-4 text-primary" />
                                     ) : (
                                       <ImageIcon className="h-4 w-4 text-primary" />
                                     )}
                                     <Badge variant="secondary" className="text-xs">{nestedInput.type}</Badge>
                                     {nestedInput.isGlobalInput && (
                                       <Badge variant="default" className="gap-1 text-xs">
                                         <Sparkles className="h-2 w-2" />
                                         Global
                                       </Badge>
                                     )}
                                   </div>
                                   <Button
                                     variant="ghost"
                                     size="sm"
                                     onClick={() => deleteNestedInput(input.id, nestedInput.id)}
                                     className="text-destructive hover:text-destructive h-6 w-6 p-0"
                                   >
                                     <Trash2 className="h-3 w-3" />
                                   </Button>
                                 </div>

                                 {nestedInput.isGlobalInput ? (
                                   // Read-only display for global inputs
                                   <div className="bg-muted/30 rounded p-2 border border-dashed text-xs">
                                     <div className="space-y-1">
                                       <div className="flex items-center gap-2">
                                         <Label className="text-muted-foreground">Global Input:</Label>
                                         <span className="font-medium">{nestedInput.name}</span>
                                       </div>
                                       {nestedInput.description && (
                                         <div className="flex items-start gap-2">
                                           <Label className="text-muted-foreground">Description:</Label>
                                           <span>{nestedInput.description}</span>
                                         </div>
                                       )}
                                       {nestedInput.placeholder && (
                                         <div className="flex items-center gap-2">
                                           <Label className="text-muted-foreground">Placeholder:</Label>
                                           <span className="text-muted-foreground">{nestedInput.placeholder}</span>
                                         </div>
                                       )}
                                       <p className="text-muted-foreground mt-1">
                                         This is a global input and cannot be edited here.
                                       </p>
                                     </div>
                                   </div>
                                 ) : (
                                   // Editable fields for regular inputs
                                   <div className="grid grid-cols-2 gap-3">
                                     <div className="space-y-1">
                                       <Label className="text-xs">Input Name</Label>
                                       <Input
                                         value={nestedInput.name}
                                         onChange={(e) => updateNestedInput(input.id, nestedInput.id, { name: e.target.value })}
                                         className="h-8 text-xs"
                                       />
                                     </div>
                                     {nestedInput.type === "text" ? (
                                       <div className="space-y-1">
                                         <Label className="text-xs">Example Value</Label>
                                         <Input
                                           value={nestedInput.exampleValue || ""}
                                           onChange={(e) => updateNestedInput(input.id, nestedInput.id, { exampleValue: e.target.value })}
                                           placeholder="Example text"
                                           className="h-8 text-xs"
                                         />
                                       </div>
                                     ) : (
                                       <div className="space-y-1">
                                         <Label className="text-xs">Input Source</Label>
                                         <Select
                                           value={nestedInput.inputSource}
                                           onValueChange={(value: "user" | "static") =>
                                             updateNestedInput(input.id, nestedInput.id, { inputSource: value })
                                           }
                                         >
                                           <SelectTrigger className="h-8 text-xs">
                                             <SelectValue />
                                           </SelectTrigger>
                                           <SelectContent>
                                             <SelectItem value="user">User Input</SelectItem>
                                             <SelectItem value="static">Static Input</SelectItem>
                                           </SelectContent>
                                         </Select>
                                       </div>
                                     )}
                                   </div>
                                 )}

                                {nestedInput.type === "image" && nestedInput.inputSource === "user" && !nestedInput.isGlobalInput && (
                                  <div className="space-y-1 col-span-2">
                                    <Label className="text-xs flex items-center gap-1">
                                      Guide Image
                                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                    </Label>
                                    <div className="border-2 border-dashed border-border rounded-lg p-3 text-center">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleNestedGuideImageUpload(input.id, nestedInput.id, e)}
                                        className="hidden"
                                        id={`nested-guide-image-${nestedInput.id}`}
                                      />
                                      <label htmlFor={`nested-guide-image-${nestedInput.id}`} className="cursor-pointer">
                                        {nestedInput.guideImage ? (
                                          <div className="space-y-1">
                                            <img 
                                              src={nestedInput.guideImage} 
                                              alt="Guide image preview" 
                                              className="max-h-16 mx-auto rounded object-cover"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                              Click to change guide image
                                            </p>
                                          </div>
                                        ) : (
                                          <>
                                            <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                                            <p className="text-xs text-muted-foreground">
                                              Optional: Upload guide image
                                            </p>
                                          </>
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                )}

                                {nestedInput.type === "image" && nestedInput.inputSource === "static" && (
                                  <div className="space-y-1 col-span-2">
                                    <Label className="text-xs">Static Image</Label>
                                    <div className="border-2 border-dashed border-border rounded-lg p-3 text-center">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleNestedStaticImageUpload(input.id, nestedInput.id, e)}
                                        className="hidden"
                                        id={`nested-static-image-${nestedInput.id}`}
                                      />
                                      <label htmlFor={`nested-static-image-${nestedInput.id}`} className="cursor-pointer">
                                        {nestedInput.staticImageFile ? (
                                          <div className="space-y-1">
                                            <img 
                                              src={nestedInput.staticImageFile} 
                                              alt="Static image preview" 
                                              className="max-h-16 mx-auto rounded object-cover"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                              Click to change image
                                            </p>
                                          </div>
                                        ) : (
                                          <>
                                            <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                                            <p className="text-xs text-muted-foreground">
                                              Click to upload image
                                            </p>
                                          </>
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                )}

                                {nestedInput.type !== "image" || nestedInput.inputSource !== "static" ? (
                                  <div className="space-y-1 col-span-2">
                                    <Label className="text-xs">Description</Label>
                                    <Textarea
                                      value={nestedInput.description || ""}
                                      onChange={(e) => updateNestedInput(input.id, nestedInput.id, { description: e.target.value })}
                                      placeholder="Describe what this input is for..."
                                      rows={1}
                                      className="text-xs resize-none"
                                    />
                                  </div>
                                ) : null}
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 border-2 border-dashed border-border/50 rounded-lg bg-background/30">
                          <p className="text-xs text-muted-foreground">
                            No inputs configured for AI image generation
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={input.description || ""}
                        onChange={(e) => updateInput(input.id, { description: e.target.value })}
                        placeholder="Describe what this AI-generated image will be used for..."
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {input.type === "image" && input.inputSource === "user" && !input.editWithAi && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={input.description || ""}
                        onChange={(e) => updateInput(input.id, { description: e.target.value })}
                        placeholder="Describe what this image input is for..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-3 border-l-4 border-primary/30 pl-4 bg-primary/5 rounded-r-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`analyse-${input.id}`}
                          checked={input.analyseWithAi || false}
                          onCheckedChange={(checked) => {
                            updateInput(input.id, { 
                              analyseWithAi: checked as boolean,
                              analysisPrompt: checked ? "Analyze this image and describe what you see in detail." : undefined
                            });
                          }}
                        />
                        <Label htmlFor={`analyse-${input.id}`} className="text-sm font-medium cursor-pointer">
                          Analyse with AI
                        </Label>
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      
                      {input.analyseWithAi && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-sm">Analysis Prompt</Label>
                            <Textarea
                              value={input.analysisPrompt || ""}
                              onChange={(e) => updateInput(input.id, { analysisPrompt: e.target.value })}
                              placeholder="Describe how you want the AI to analyze this image..."
                              rows={2}
                              className="text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                              The AI analysis result will be added to the main pipeline prompt as: {`{{Analysis of ${input.name}}}`}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 pl-4 border-l-2 border-muted">
                            <Checkbox
                              id={`use-image-input-${input.id}`}
                              checked={input.useImageAsPipelineInput || false}
                              onCheckedChange={(checked) => {
                                updateInput(input.id, { 
                                  useImageAsPipelineInput: checked as boolean
                                });
                              }}
                            />
                            <Label htmlFor={`use-image-input-${input.id}`} className="text-sm cursor-pointer">
                              Use the image as input of the pipeline
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {input.type === "image" && input.inputSource === "static" && (
                  <div className="space-y-2">
                    <Label>Static Value</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleStaticImageUpload(input.id, e)}
                        className="hidden"
                        id={`static-image-${input.id}`}
                      />
                      <label htmlFor={`static-image-${input.id}`} className="cursor-pointer">
                        {input.staticImageFile ? (
                          <div className="space-y-2">
                            <img 
                              src={input.staticImageFile} 
                              alt="Static image preview" 
                              className="max-h-32 mx-auto rounded object-cover"
                            />
                            <p className="text-sm text-muted-foreground">
                              Click to change image
                            </p>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload static image
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {input.type === "image" && input.inputSource === "user" && !input.editWithAi && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Guide Image
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleGuideImageUpload(input.id, e)}
                        className="hidden"
                        id={`guide-image-${input.id}`}
                      />
                      <label htmlFor={`guide-image-${input.id}`} className="cursor-pointer">
                        {input.guideImage ? (
                          <div className="space-y-2">
                            <img 
                              src={input.guideImage} 
                              alt="Guide image preview" 
                              className="max-h-32 mx-auto rounded object-cover"
                            />
                            <p className="text-sm text-muted-foreground">
                              Click to change guide image
                            </p>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Optional: Upload guide image to help users
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}
                  </>
                )}
              </div>
            </Card>
          ))}

          {editedPipeline.inputs.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <div className="p-3 bg-muted rounded-full w-fit mx-auto mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No inputs configured. Add text or image inputs to get started.
              </p>
            </div>
          )}
        </div>
      </div>


      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(editedPipeline)}>
          Save Pipeline
        </Button>
      </div>
    </div>
  );
}