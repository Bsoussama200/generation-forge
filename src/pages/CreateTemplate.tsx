import { useState } from "react";
import { Header } from "@/components/ui/header";
import { PipelineBuilder, type Pipeline } from "@/components/templates/pipeline-builder";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Upload, Sparkles, Save, TestTube, Eye } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const categories = [
  "Ecommerce", "Viral", "Funny", "Pets", "Events", "Professional", 
  "Real Estate", "Food", "Fashion", "Travel", "Education", "Health", "Fitness"
];

export default function CreateTemplate() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [tokenCost, setTokenCost] = useState(20);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Saving draft...");
  };

  const handleTestTemplate = () => {
    // TODO: Implement test template functionality
    console.log("Testing template...");
  };

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log("Publishing template...");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <a href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </a>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Create New Template</h1>
            <p className="text-muted-foreground">
              Build AI-powered templates that others can use to create amazing content
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Template Details */}
            <Card className="bg-gradient-card shadow-soft">
              <Accordion type="single" collapsible>
                <AccordionItem value="template-details" className="border-none">
                  <AccordionTrigger className="px-6 pt-6 pb-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold">
                        1
                      </div>
                      Template Details
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6">
                      {/* Template Name */}
                      <div className="space-y-2">
                        <Label htmlFor="template-name">Template Name *</Label>
                        <Input
                          id="template-name"
                          placeholder="e.g., Viral Instagram Reel Maker"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what your template does and what kind of content it creates..."
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>

                      {/* Categories */}
                      <div className="space-y-3">
                        <Label>Categories *</Label>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                          {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => handleCategoryToggle(category)}
                              />
                              <label
                                htmlFor={category}
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                        {selectedCategories.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedCategories.map((category) => (
                              <Badge key={category} variant="secondary">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                          id="tags"
                          placeholder="e.g., viral, social media, trending (comma-separated)"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Separate tags with commas to help users discover your template
                        </p>
                      </div>

                      {/* Token Cost */}
                      <div className="space-y-2">
                        <Label htmlFor="token-cost">Token Cost per Generation</Label>
                        <Select value={tokenCost.toString()} onValueChange={(value) => setTokenCost(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 tokens</SelectItem>
                            <SelectItem value="15">15 tokens</SelectItem>
                            <SelectItem value="20">20 tokens</SelectItem>
                            <SelectItem value="25">25 tokens</SelectItem>
                            <SelectItem value="30">30 tokens</SelectItem>
                            <SelectItem value="35">35 tokens</SelectItem>
                            <SelectItem value="50">50 tokens</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Cover Image Upload */}
                      <div className="space-y-2">
                        <Label>Cover Image</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Recommended: 400x225px, JPG or PNG
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Step 2: Pipeline Builder */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold">
                    2
                  </div>
                  Pipeline Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PipelineBuilder
                  pipelines={pipelines}
                  onPipelinesChange={setPipelines}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {templateName ? (
                  <div className="space-y-3">
                    <div className="aspect-video bg-gradient-secondary rounded-lg flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{templateName}</h3>
                      {description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {description}
                        </p>
                      )}
                    </div>
                    {selectedCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedCategories.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Fill in the details to see a preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-gradient-card shadow-soft">
              <CardContent className="pt-6 space-y-3">
                <Button 
                  onClick={handleSaveDraft}
                  variant="outline" 
                  className="w-full gap-2"
                  disabled={!templateName}
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                
                <Button 
                  onClick={handleTestTemplate}
                  variant="outline" 
                  className="w-full gap-2"
                  disabled={!templateName || !description}
                >
                  <TestTube className="h-4 w-4" />
                  Test Template
                </Button>
                
                <Button 
                  onClick={handlePublish}
                  className="w-full gap-2 bg-gradient-primary shadow-soft"
                  disabled={!templateName || !description || selectedCategories.length === 0}
                >
                  <Sparkles className="h-4 w-4" />
                  Publish Template
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Templates can only be published after testing with at least one example output
                </p>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-secondary border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Tips for Success
                </h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Choose clear, descriptive names</li>
                  <li>• Explain exactly what your template creates</li>
                  <li>• Select relevant categories for discoverability</li>
                  <li>• Test thoroughly before publishing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}