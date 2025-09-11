import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Type, Image as ImageIcon, Eye } from "lucide-react";
import { Pipeline, PipelineInput } from "./pipeline-builder";

interface CollectedInput {
  inputId: string;
  value: string | File;
  type: "text" | "image";
}

interface CollectedNestedInput {
  parentInputId: string;
  nestedInputId: string;
  value: string | File;
  type: "text" | "image";
}

interface PipelineInputCollectorProps {
  pipeline: Pipeline | null;
  isOpen: boolean;
  onClose: () => void;
  onRun: (inputs: CollectedInput[], nestedInputs: CollectedNestedInput[]) => void;
}

export function PipelineInputCollector({ 
  pipeline, 
  isOpen, 
  onClose, 
  onRun 
}: PipelineInputCollectorProps) {
  const [collectedInputs, setCollectedInputs] = useState<CollectedInput[]>([]);
  const [collectedNestedInputs, setCollectedNestedInputs] = useState<CollectedNestedInput[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [viewingGuideImage, setViewingGuideImage] = useState<string | null>(null);

  if (!pipeline) return null;

  // Get all user inputs that need to be collected
  const userInputs = pipeline.inputs.filter(input => 
    input.inputSource === "user" && !input.editWithAi
  );

  // Get all nested user inputs from "Generate with AI" inputs
  const nestedUserInputs: Array<{parentInput: PipelineInput, nestedInput: PipelineInput}> = [];
  pipeline.inputs.forEach(input => {
    if (input.editWithAi && input.nestedInputs) {
      input.nestedInputs.forEach(nestedInput => {
        if (nestedInput.inputSource === "user") {
          nestedUserInputs.push({ parentInput: input, nestedInput });
        }
      });
    }
  });

  const updateInput = (inputId: string, value: string | File, type: "text" | "image") => {
    setCollectedInputs(prev => {
      const existing = prev.find(item => item.inputId === inputId);
      if (existing) {
        return prev.map(item => 
          item.inputId === inputId ? { ...item, value } : item
        );
      }
      return [...prev, { inputId, value, type }];
    });

    // Clear error when user provides input
    if (errors[inputId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[inputId];
        return newErrors;
      });
    }
  };

  const updateNestedInput = (parentInputId: string, nestedInputId: string, value: string | File, type: "text" | "image") => {
    setCollectedNestedInputs(prev => {
      const existing = prev.find(item => 
        item.parentInputId === parentInputId && item.nestedInputId === nestedInputId
      );
      if (existing) {
        return prev.map(item => 
          item.parentInputId === parentInputId && item.nestedInputId === nestedInputId 
            ? { ...item, value } : item
        );
      }
      return [...prev, { parentInputId, nestedInputId, value, type }];
    });

    // Clear error when user provides input
    const errorKey = `${parentInputId}-${nestedInputId}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (inputId: string, event: React.ChangeEvent<HTMLInputElement>, isNested = false, parentInputId?: string) => {
    const file = event.target.files?.[0];
    if (file) {
      if (isNested && parentInputId) {
        updateNestedInput(parentInputId, inputId, file, "image");
      } else {
        updateInput(inputId, file, "image");
      }
    }
  };

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};

    // Validate main user inputs
    userInputs.forEach(input => {
      const collected = collectedInputs.find(item => item.inputId === input.id);
      if (!collected || (typeof collected.value === "string" && !collected.value.trim())) {
        newErrors[input.id] = `${input.name} is required`;
      }
    });

    // Validate nested user inputs
    nestedUserInputs.forEach(({ parentInput, nestedInput }) => {
      const collected = collectedNestedInputs.find(item => 
        item.parentInputId === parentInput.id && item.nestedInputId === nestedInput.id
      );
      if (!collected || (typeof collected.value === "string" && !collected.value.trim())) {
        newErrors[`${parentInput.id}-${nestedInput.id}`] = `${nestedInput.name} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRun = () => {
    if (validateInputs()) {
      onRun(collectedInputs, collectedNestedInputs);
      onClose();
      // Reset form
      setCollectedInputs([]);
      setCollectedNestedInputs([]);
      setErrors({});
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setCollectedInputs([]);
    setCollectedNestedInputs([]);
    setErrors({});
    setViewingGuideImage(null);
  };

  const getInputValue = (inputId: string) => {
    const collected = collectedInputs.find(item => item.inputId === inputId);
    return collected && typeof collected.value === "string" ? collected.value : "";
  };

  const getNestedInputValue = (parentInputId: string, nestedInputId: string) => {
    const collected = collectedNestedInputs.find(item => 
      item.parentInputId === parentInputId && item.nestedInputId === nestedInputId
    );
    return collected && typeof collected.value === "string" ? collected.value : "";
  };

  const getImageFileName = (inputId: string, isNested = false, parentInputId?: string) => {
    if (isNested && parentInputId) {
      const collected = collectedNestedInputs.find(item => 
        item.parentInputId === parentInputId && item.nestedInputId === inputId
      );
      return collected && collected.value instanceof File ? collected.value.name : null;
    } else {
      const collected = collectedInputs.find(item => item.inputId === inputId);
      return collected && collected.value instanceof File ? collected.value.name : null;
    }
  };

  // Check if there are any inputs to collect
  const hasInputsToCollect = userInputs.length > 0 || nestedUserInputs.length > 0;

  if (!hasInputsToCollect) {
    // Auto-run if no inputs needed
    return null;
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Provide Inputs for {pipeline.name}</DialogTitle>
          <DialogDescription>
            Please provide the required inputs to run this pipeline
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* All Pipeline Inputs Combined */}
          {(userInputs.length > 0 || nestedUserInputs.length > 0) && (
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Pipeline Inputs</h4>
              
              {/* Main User Inputs */}
              {userInputs.map(input => (
                <div key={input.id} className="space-y-2">
                  <Label htmlFor={input.id} className="flex items-center gap-2">
                    {input.type === "text" ? (
                      <Type className="h-4 w-4 text-primary" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-primary" />
                    )}
                    {input.name}
                    <span className="text-destructive">*</span>
                  </Label>
                  
                  {input.description && (
                    <p className="text-xs text-muted-foreground">{input.description}</p>
                  )}

                  {/* Show guide image if available for image inputs */}
                  {input.type === "image" && input.guideImage && (
                    <div className="mb-2">
                      <Label className="text-xs text-muted-foreground mb-1 block">Guide Image:</Label>
                      <div 
                        className="cursor-pointer border rounded-lg p-2 bg-background hover:bg-muted/50 transition-colors"
                        onClick={() => setViewingGuideImage(input.guideImage!)}
                      >
                        <div className="flex items-center gap-2">
                          <img 
                            src={input.guideImage} 
                            alt="Guide image" 
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-xs font-medium">Click to view guide image</p>
                            <p className="text-xs text-muted-foreground">Reference for this input</p>
                          </div>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  )}

                  {input.type === "text" ? (
                    <Textarea
                      id={input.id}
                      value={getInputValue(input.id)}
                      onChange={(e) => updateInput(input.id, e.target.value, "text")}
                      placeholder={input.placeholder || input.exampleValue || `Enter ${input.name.toLowerCase()}...`}
                      rows={3}
                      className={errors[input.id] ? "border-destructive" : ""}
                    />
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(input.id, e)}
                        className="hidden"
                        id={`image-${input.id}`}
                      />
                      <label htmlFor={`image-${input.id}`} className="cursor-pointer">
                        {getImageFileName(input.id) ? (
                          <div className="space-y-2">
                            <ImageIcon className="h-8 w-8 mx-auto text-green-600" />
                            <p className="text-sm font-medium text-green-600">
                              {getImageFileName(input.id)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Click to change image
                            </p>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload {input.name.toLowerCase()}
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  )}

                  {errors[input.id] && (
                    <p className="text-xs text-destructive">{errors[input.id]}</p>
                  )}
                </div>
              ))}

              {/* Nested User Inputs from AI Generation */}
              {nestedUserInputs.map(({ parentInput, nestedInput }) => (
                <div key={`${parentInput.id}-${nestedInput.id}`} className="space-y-2 p-3 bg-primary/5 rounded-lg border-l-4 border-primary/30">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>For generating: {parentInput.name}</span>
                  </div>
                  
                  {/* Show guide image if available */}
                  {nestedInput.type === "image" && nestedInput.guideImage && (
                    <div className="mb-2">
                      <Label className="text-xs text-muted-foreground mb-1 block">Guide Image:</Label>
                      <div 
                        className="cursor-pointer border rounded-lg p-2 bg-background hover:bg-muted/50 transition-colors"
                        onClick={() => setViewingGuideImage(nestedInput.guideImage!)}
                      >
                        <div className="flex items-center gap-2">
                          <img 
                            src={nestedInput.guideImage} 
                            alt="Guide image" 
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-xs font-medium">Click to view guide image</p>
                            <p className="text-xs text-muted-foreground">Reference for this input</p>
                          </div>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Label htmlFor={`${parentInput.id}-${nestedInput.id}`} className="flex items-center gap-2">
                    {nestedInput.type === "text" ? (
                      <Type className="h-4 w-4 text-primary" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-primary" />
                    )}
                    {nestedInput.name}
                    <span className="text-destructive">*</span>
                  </Label>

                  {nestedInput.description && (
                    <p className="text-xs text-muted-foreground">{nestedInput.description}</p>
                  )}

                  {nestedInput.type === "text" ? (
                    <Textarea
                      id={`${parentInput.id}-${nestedInput.id}`}
                      value={getNestedInputValue(parentInput.id, nestedInput.id)}
                      onChange={(e) => updateNestedInput(parentInput.id, nestedInput.id, e.target.value, "text")}
                      placeholder={nestedInput.exampleValue || `Enter ${nestedInput.name.toLowerCase()}...`}
                      rows={2}
                      className={errors[`${parentInput.id}-${nestedInput.id}`] ? "border-destructive" : ""}
                    />
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-3 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(nestedInput.id, e, true, parentInput.id)}
                        className="hidden"
                        id={`nested-image-${parentInput.id}-${nestedInput.id}`}
                      />
                      <label htmlFor={`nested-image-${parentInput.id}-${nestedInput.id}`} className="cursor-pointer">
                        {getImageFileName(nestedInput.id, true, parentInput.id) ? (
                          <div className="space-y-1">
                            <ImageIcon className="h-6 w-6 mx-auto text-green-600" />
                            <p className="text-xs font-medium text-green-600">
                              {getImageFileName(nestedInput.id, true, parentInput.id)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Click to change
                            </p>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              Click to upload {nestedInput.name.toLowerCase()}
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  )}

                  {errors[`${parentInput.id}-${nestedInput.id}`] && (
                    <p className="text-xs text-destructive">{errors[`${parentInput.id}-${nestedInput.id}`]}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleRun} className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Run Pipeline
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* Guide Image Viewer Dialog */}
    <Dialog open={!!viewingGuideImage} onOpenChange={() => setViewingGuideImage(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Guide Image</DialogTitle>
          <DialogDescription>
            Reference image for input guidance
          </DialogDescription>
        </DialogHeader>
        
        {viewingGuideImage && (
          <div className="flex justify-center p-4">
            <img 
              src={viewingGuideImage} 
              alt="Guide image" 
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
            />
          </div>
        )}
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setViewingGuideImage(null)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}