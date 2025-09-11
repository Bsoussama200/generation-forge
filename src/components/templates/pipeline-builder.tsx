import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  Image as ImageIcon, 
  Video, 
  Type, 
  Upload,
  HelpCircle
} from "lucide-react";

export interface Pipeline {
  id: string;
  name: string;
  type: "image" | "video";
  inputs: PipelineInput[];
}

export interface PipelineInput {
  id: string;
  name: string;
  type: "text" | "image";
  inputSource: "user" | "static";
  placeholder?: string;
  exampleValue?: string;
  guideImage?: string;
  staticValue?: string;
  staticImage?: string;
}

interface PipelineBuilderProps {
  pipelines: Pipeline[];
  onPipelinesChange: (pipelines: Pipeline[]) => void;
}

export function PipelineBuilder({ pipelines, onPipelinesChange }: PipelineBuilderProps) {
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addPipeline = (type: "image" | "video") => {
    if (pipelines.length >= 10) return;
    
    const newPipeline: Pipeline = {
      id: `pipeline-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Pipeline ${pipelines.length + 1}`,
      type,
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

  const movePipeline = (fromIndex: number, toIndex: number) => {
    const updated = [...pipelines];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onPipelinesChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
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
              <p className="text-sm text-muted-foreground mb-4">
                Add your first pipeline to start building your template
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => addPipeline("image")} className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Add Image Pipeline
                </Button>
                <Button onClick={() => addPipeline("video")} className="gap-2">
                  <Video className="h-4 w-4" />
                  Add Video Pipeline
                </Button>
              </div>
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
            <PipelineEditor
              pipeline={editingPipeline}
              onSave={savePipeline}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PipelineEditorProps {
  pipeline: Pipeline;
  onSave: (pipeline: Pipeline) => void;
  onCancel: () => void;
}

function PipelineEditor({ pipeline, onSave, onCancel }: PipelineEditorProps) {
  const [editedPipeline, setEditedPipeline] = useState<Pipeline>(pipeline);

  const addInput = (type: "text" | "image") => {
    const newInput: PipelineInput = {
      id: `input-${Date.now()}`,
      name: `${type} Input ${editedPipeline.inputs.length + 1}`,
      type,
      inputSource: "user",
      placeholder: type === "text" ? "Enter text..." : undefined,
      exampleValue: type === "text" ? "Example text" : undefined
    };
    
    setEditedPipeline({
      ...editedPipeline,
      inputs: [...editedPipeline.inputs, newInput]
    });
  };

  const updateInput = (inputId: string, updates: Partial<PipelineInput>) => {
    setEditedPipeline({
      ...editedPipeline,
      inputs: editedPipeline.inputs.map(input =>
        input.id === inputId ? { ...input, ...updates } : input
      )
    });
  };

  const deleteInput = (inputId: string) => {
    setEditedPipeline({
      ...editedPipeline,
      inputs: editedPipeline.inputs.filter(input => input.id !== inputId)
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
              variant="outline"
              size="sm"
              onClick={() => addInput("text")}
              className="gap-1"
            >
              <Type className="h-3 w-3" />
              Add Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addInput("image")}
              className="gap-1"
            >
              <ImageIcon className="h-3 w-3" />
              Add Image
            </Button>
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
                      <Type className="h-4 w-4 text-primary" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-primary" />
                    )}
                    <Badge variant="secondary">{input.type}</Badge>
                    <Badge variant={input.inputSource === "user" ? "default" : "outline"}>
                      {input.inputSource}
                    </Badge>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Input Name</Label>
                    <Input
                      value={input.name}
                      onChange={(e) => updateInput(input.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Input Source</Label>
                    <Select
                      value={input.inputSource}
                      onValueChange={(value: "user" | "static") =>
                        updateInput(input.id, { inputSource: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User Input</SelectItem>
                        <SelectItem value="static">Static Input</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {input.inputSource === "user" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        {input.type === "text" ? "Placeholder" : "Upload Instructions"}
                      </Label>
                      <Input
                        value={input.placeholder || ""}
                        onChange={(e) => updateInput(input.id, { placeholder: e.target.value })}
                        placeholder={input.type === "text" ? "Enter placeholder..." : "Upload your image"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Example Value</Label>
                      <Input
                        value={input.exampleValue || ""}
                        onChange={(e) => updateInput(input.id, { exampleValue: e.target.value })}
                        placeholder="Example to show users"
                      />
                    </div>
                  </div>
                )}

                {input.inputSource === "static" && (
                  <div className="space-y-2">
                    <Label>Static Value</Label>
                    {input.type === "text" ? (
                      <Textarea
                        value={input.staticValue || ""}
                        onChange={(e) => updateInput(input.id, { staticValue: e.target.value })}
                        placeholder="Enter static text value..."
                      />
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload static image
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {input.inputSource === "user" && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Guide Image
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Optional: Upload guide image to help users
                      </p>
                    </div>
                  </div>
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

      {/* Prompt Preview */}
      {editedPipeline.inputs.some(i => i.type === "text" && i.inputSource === "user") && (
        <div className="space-y-2">
          <Label>Generated Prompt Preview</Label>
          <div className="p-3 bg-muted rounded-lg">
            <code className="text-sm">{generatePromptPreview()}</code>
          </div>
        </div>
      )}

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