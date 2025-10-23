import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  ArrowRight,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/ui/header";

const featuredTemplates = [
  {
    id: "1",
    title: "Viral TikTok",
    subtitle: "DANCE CHALLENGE",
    description: "Create engaging dance videos with AI-powered effects",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&h=600&fit=crop",
    badge: "Trending",
    cta: "EXPLORE VIRAL TIKTOK"
  },
  {
    id: "2", 
    title: "Professional",
    subtitle: "LINKEDIN HEADSHOTS",
    description: "Transform photos into professional business portraits",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop",
    badge: "Popular",
    cta: "CREATE HEADSHOT NOW"
  },
  {
    id: "3",
    title: "E-commerce",
    subtitle: "PRODUCT SHOWCASE",
    description: "Professional product photography with perfect lighting",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    badge: "New",
    cta: "BOOST YOUR SALES"
  }
];

const categoryTabs = [
  "Visual Effects",
  "Viral Content",
  "Professional",
  "E-commerce", 
  "Entertainment",
  "Social Media",
  "Marketing",
  "Education"
];

const communityTemplates = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
    title: "Cute Pet Portraits"
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
    title: "Birthday Videos"
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
    title: "Travel Highlights"
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop",
    title: "Fashion Lookbooks"
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop",
    title: "Corporate Videos"
  }
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="space-y-12 pb-16">
        {/* Category Tabs */}
        <div className="border-b border-border/50 bg-background/50 backdrop-blur sticky top-14 z-40">
          <div className="container">
            <div className="flex items-center gap-6 overflow-x-auto py-3 scrollbar-hide">
              {categoryTabs.map((tab, index) => (
                <button
                  key={tab}
                  className={`text-sm font-medium whitespace-nowrap pb-1 transition-colors hover:text-foreground ${
                    index === 0 
                      ? "text-foreground border-b-2 border-primary" 
                      : "text-muted-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Templates - Hero Grid */}
        <section className="container space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {featuredTemplates.map((template) => (
              <Link
                key={template.id}
                to="/templates"
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-card hover:scale-[1.02] transition-all duration-300"
                style={{
                  backgroundImage: `url(${template.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary/80 backdrop-blur text-foreground border-border/50 text-xs">
                    {template.badge}
                  </Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{template.title}</p>
                    <h3 className="text-3xl font-bold text-white tracking-tight">
                      {template.subtitle}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-300">
                    {template.description}
                  </p>

                  <Button 
                    variant="outline" 
                    className="w-full bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 group-hover:bg-white group-hover:text-black transition-all"
                  >
                    {template.cta}
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Community Section */}
        <section className="container space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-primary tracking-tight">
              COMMUNITY TEMPLATES
            </h2>
            <Button variant="link" className="text-foreground hover:text-primary" asChild>
              <Link to="/templates">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {communityTemplates.map((template) => (
              <Link
                key={template.id}
                to="/templates"
                className="group relative aspect-video rounded-xl overflow-hidden bg-card hover:scale-[1.02] transition-all duration-300"
              >
                <img 
                  src={template.image} 
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="h-12 w-12 text-white" />
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm font-medium text-white truncate">
                    {template.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary p-12 md:p-16 text-center">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Create?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of creators using FlexFlowLab to build stunning AI-powered content
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-base h-12"
                  asChild
                >
                  <Link to="/create">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Start Creating Free
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base h-12 border-border hover:bg-secondary"
                  asChild
                >
                  <Link to="/templates">
                    Browse Templates
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
