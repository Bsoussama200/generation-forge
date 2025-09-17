import { Header } from "@/components/ui/header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentTemplates } from "@/components/dashboard/recent-templates";
import { TemplateCard } from "@/components/templates/template-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Sparkles, Plus, Zap } from "lucide-react";

const recommendedTemplates = [
  {
    id: "rec-1",
    title: "Viral Instagram Reel",
    description: "Create engaging short-form videos with trending music and effects that capture attention and drive engagement.",
    category: ["Viral", "Social Media"],
    tags: ["instagram", "reels", "viral", "trending"],
    tokenCost: 25,
    thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=225&fit=crop",
    creator: {
      name: "Content Creator Pro",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
    },
    stats: {
      uses: 15600,
      rating: 4.9,
      likes: 2340
    }
  },
  {
    id: "rec-2", 
    title: "Pet Portrait Generator",
    description: "Transform your pet photos into stunning artistic portraits with various styles and backgrounds.",
    category: ["Pets", "Art"],
    tags: ["pets", "portrait", "art", "cute"],
    tokenCost: 15,
    thumbnail: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=225&fit=crop",
    creator: {
      name: "PetArt Studio",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    stats: {
      uses: 8900,
      rating: 4.8,
      likes: 1567
    }
  },
  {
    id: "rec-3",
    title: "E-commerce Product Showcase", 
    description: "Professional product photography with perfect lighting, backgrounds, and multiple angles to boost sales.",
    category: ["Ecommerce", "Professional"],
    tags: ["product", "ecommerce", "photography", "professional"],
    tokenCost: 35,
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop",
    creator: {
      name: "Commerce Pro",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    stats: {
      uses: 12400,
      rating: 4.7,
      likes: 890
    }
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 text-center text-white shadow-strong">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to TemplateLab AI
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Create stunning content with AI-powered templates. From viral videos to professional designs, 
              transform your ideas into reality with just a few clicks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-medium" asChild>
                <a href="/create">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Template
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <a href="/templates">
                  <Zap className="h-5 w-5 mr-2" />
                  Browse Templates
                </a>
              </Button>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-float" />
            <div className="absolute top-1/3 right-20 w-16 h-16 bg-white rounded-full animate-float" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-float" style={{ animationDelay: "2s" }} />
          </div>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Recommended Templates */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Recommended for You</h2>
                <p className="text-muted-foreground">Templates picked based on your interests and usage</p>
              </div>
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {recommendedTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-6">
            <RecentTemplates />

            {/* Quick Actions */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trending Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Viral Content", "Professional", "E-commerce", "Events", "Pets"].map((category, index) => (
                  <div key={category} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-primary" />
                      <span className="font-medium group-hover:text-primary transition-colors">{category}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Token Purchase CTA */}
            <Card className="bg-gradient-secondary border-primary/20 shadow-soft">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="p-3 bg-gradient-primary rounded-full w-fit mx-auto">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Running low on tokens?</h3>
                    <p className="text-sm text-muted-foreground">
                      Get more tokens to keep creating amazing content
                    </p>
                  </div>
                  <Button className="w-full bg-gradient-primary shadow-soft">
                    Buy Tokens
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}