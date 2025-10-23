import { useState } from "react";
import { Header } from "@/components/ui/header";
import { TemplateFilters } from "@/components/templates/template-filters";
import { TemplateCard } from "@/components/templates/template-card";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

const mockTemplates = [
  {
    id: "1",
    title: "Viral TikTok Dance Challenge",
    description: "Create engaging dance challenge videos with trending music, effects, and perfect timing to go viral on social media.",
    category: ["Viral", "Entertainment"],
    tags: ["tiktok", "dance", "viral", "trending", "music"],
    tokenCost: 30,
    thumbnail: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=225&fit=crop",
    creator: {
      name: "Viral Studios",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
    },
    stats: {
      uses: 25600,
      rating: 4.9,
      likes: 3840
    }
  },
  {
    id: "2",
    title: "Professional LinkedIn Headshots",
    description: "Transform casual photos into professional headshots perfect for LinkedIn profiles, resumes, and business cards.",
    category: ["Professional", "Business"],
    tags: ["linkedin", "headshot", "professional", "business", "portrait"],
    tokenCost: 20,
    thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=225&fit=crop",
    creator: {
      name: "Pro Photos AI",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    stats: {
      uses: 18900,
      rating: 4.8,
      likes: 2156
    }
  },
  {
    id: "3",
    title: "Cute Pet Portrait Collection",
    description: "Turn your pet photos into adorable cartoon-style portraits with various artistic styles and backgrounds.",
    category: ["Pets", "Art"],
    tags: ["pets", "cute", "cartoon", "portrait", "animals"],
    tokenCost: 15,
    thumbnail: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=225&fit=crop",
    creator: {
      name: "Pet Art Studio",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    stats: {
      uses: 12400,
      rating: 4.9,
      likes: 1890
    }
  },
  {
    id: "4", 
    title: "Birthday Party Video Maker",
    description: "Create memorable birthday celebration videos with music, effects, and personalized messages for any age.",
    category: ["Events", "Birthday"],
    tags: ["birthday", "celebration", "party", "video", "memories"],
    tokenCost: 25,
    thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=225&fit=crop",
    creator: {
      name: "Celebration Pro",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9f64ecc?w=40&h=40&fit=crop&crop=face"
    },
    stats: {
      uses: 9876,
      rating: 4.7,
      likes: 1234
    }
  },
  {
    id: "5",
    title: "E-commerce Product Showcase",
    description: "Professional product photography with perfect lighting, backgrounds, and multiple angles to boost your sales.",
    category: ["Ecommerce", "Business"],
    tags: ["product", "ecommerce", "photography", "sales", "professional"],
    tokenCost: 35,
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop",
    creator: {
      name: "Commerce Studio",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    stats: {
      uses: 15600,
      rating: 4.8,
      likes: 987
    }
  },
  {
    id: "6",
    title: "Travel Destination Highlights",
    description: "Create stunning travel videos showcasing beautiful destinations with cinematic effects and perfect timing.",
    category: ["Travel", "Entertainment"],
    tags: ["travel", "destination", "cinematic", "vacation", "adventure"],
    tokenCost: 28,
    thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=225&fit=crop",
    creator: {
      name: "Travel Films",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face"
    },
    stats: {
      uses: 8765,
      rating: 4.6,
      likes: 1456
    }
  }
];

export default function Templates() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredTemplates, setFilteredTemplates] = useState(mockTemplates);

  const handleFiltersChange = (filters: any) => {
    let filtered = mockTemplates;
    
    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(template => 
        filters.categories.some((cat: string) => 
          template.category.includes(cat) || template.tags.includes(cat.toLowerCase())
        )
      );
    }
    
    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(template =>
        template.title.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.tags.some(tag => tag.includes(searchLower))
      );
    }
    
    // Sort
    switch (filters.sort) {
      case "newest":
        // For demo, reverse the order
        filtered = [...filtered].reverse();
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.stats.rating - a.stats.rating);
        break;
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.tokenCost - b.tokenCost);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.tokenCost - a.tokenCost);
        break;
      default: // popular
        filtered = [...filtered].sort((a, b) => b.stats.uses - a.stats.uses);
    }
    
    setFilteredTemplates(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">Templates</h1>
              <p className="text-muted-foreground mt-2">
                Discover AI-powered templates for every creative need
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <TemplateFilters onFiltersChange={handleFiltersChange} />

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Templates Grid */}
        <div className={
          viewMode === "grid" 
            ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
        }>
          {filteredTemplates.map((template) => (
            <TemplateCard 
              key={template.id} 
              template={template}
              className={viewMode === "list" ? "flex-row" : ""}
            />
          ))}
        </div>

        {/* Load More */}
        {filteredTemplates.length > 0 && (
          <div className="text-center pt-8">
            <Button variant="outline" size="lg">
              Load More Templates
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                <Grid className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <Button variant="outline" onClick={() => {
                setFilteredTemplates(mockTemplates);
                // Reset filters would go here
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}