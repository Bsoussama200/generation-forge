import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, TrendingUp } from "lucide-react";

const categories = [
  "Visual Effects",
  "AI Workflows", 
  "Marketing Tools",
  "Content Creation",
  "Data Processing",
  "Integration Pipelines",
  "Automation",
  "Analytics",
];

const featuredTemplates = [
  {
    id: 1,
    title: "AI Content Generator",
    subtitle: "Next-gen template for content creation & automation",
    cta: "EXPLORE AI CONTENT",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    badge: "Featured"
  },
  {
    id: 2,
    title: "ADVANCED WORKFLOW AUTOMATION",
    subtitle: "Subscribe now and create without limits with premium automation tools",
    cta: "MORE AUTOMATION",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    badge: null,
    highlight: true
  },
  {
    id: 3,
    title: "Smart Analytics Dashboard",
    subtitle: "Advanced analytics with real-time insights",
    cta: "MEET ANALYTICS 3.0",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    badge: "New"
  }
];

const communityTemplates = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
    title: "AI Image Processing"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    title: "Data Visualization"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&q=80",
    title: "Workflow Orchestration"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    title: "Team Collaboration"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    title: "Business Intelligence"
  },
];

export default function Index() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Category Navigation */}
      <div className="border-b border-border/40 bg-background/50 backdrop-blur">
        <div className="container px-6">
          <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide py-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative whitespace-nowrap text-sm font-medium transition-colors pb-1 ${
                  activeCategory === category
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
                {activeCategory === category && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Templates Hero */}
      <section className="container px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
            >
              <img
                src={template.image}
                alt={template.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {template.badge && (
                <Badge className="absolute top-4 left-4 bg-muted/80 text-foreground border-0">
                  {template.badge}
                </Badge>
              )}

              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <p className="text-xs text-muted-foreground mb-2">{template.subtitle}</p>
                <h2 className={`font-bold mb-4 ${template.highlight ? 'text-3xl' : 'text-2xl'}`}>
                  {template.highlight ? (
                    <>
                      ADVANCED WORKFLOW{" "}
                      <span className="text-primary">AUTOMATION</span>
                    </>
                  ) : (
                    template.title
                  )}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit border-white/20 bg-white/10 backdrop-blur hover:bg-white/20 text-white"
                >
                  {template.cta}
                </Button>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 backdrop-blur hover:bg-white/30">
                  <Play className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="container px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            COMMUNITY <span className="text-primary">TEMPLATES</span>
          </h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            View All
            <TrendingUp className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {communityTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative overflow-hidden rounded-lg aspect-[3/4] cursor-pointer"
            >
              <img
                src={template.image}
                alt={template.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm font-medium text-white">{template.title}</p>
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 backdrop-blur hover:bg-white/30">
                  <Play className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Start Building with <span className="text-primary">YopaLab</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Create powerful automation workflows and AI-powered templates in minutes
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}