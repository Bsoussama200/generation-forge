import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Sparkles, 
  Rocket, 
  Code2, 
  Palette, 
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Templates",
    description: "Generate stunning content with cutting-edge AI technology",
    color: "text-primary"
  },
  {
    icon: Code2,
    title: "Custom Pipelines",
    description: "Build complex workflows with our visual pipeline builder",
    color: "text-accent"
  },
  {
    icon: Palette,
    title: "Creative Freedom",
    description: "Unlimited customization options for every creative need",
    color: "text-primary-glow"
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "Secure, scalable, and built for professional teams",
    color: "text-accent"
  }
];

const stats = [
  { icon: Users, value: "50K+", label: "Active Creators" },
  { icon: Star, value: "4.9/5", label: "User Rating" },
  { icon: TrendingUp, value: "1M+", label: "Templates Generated" },
  { icon: Rocket, value: "99.9%", label: "Uptime" }
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-primary-glow/10 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-gradient-primary rounded-lg cyber-glow">
              <Sparkles className="h-6 w-6 text-background" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FlexFlow AI
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hover:bg-primary/10" asChild>
              <Link to="/templates">Browse Templates</Link>
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90 shadow-glow" asChild>
              <Link to="/dashboard">
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <Badge className="bg-gradient-secondary border-accent/20 text-accent-foreground px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Next-Gen AI Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Create
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent animate-neon-flicker">
                {" "}Stunning{" "}
              </span>
              Content with AI
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into professional-grade content using our 
              advanced AI templates and visual pipeline builder.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 shadow-glow text-lg px-8 py-6 h-auto group"
              asChild
            >
              <Link to="/create">
                <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                Start Creating
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="neon-border text-lg px-8 py-6 h-auto hover:bg-primary/5"
              asChild
            >
              <Link to="/templates">
                <Sparkles className="h-5 w-5 mr-2" />
                Explore Templates
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-effect text-center p-6 hover:cyber-glow transition-all duration-300 group">
              <CardContent className="p-0 space-y-2">
                <stat.icon className="h-8 w-8 mx-auto text-primary group-hover:animate-pulse" />
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-32 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Powered by 
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                {" "}Advanced AI
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of content creation with our cutting-edge features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass-effect p-6 hover:cyber-glow transition-all duration-500 group hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="p-0 pb-4">
                  <div className={`p-3 rounded-lg bg-gradient-primary/10 w-fit group-hover:animate-pulse`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <Card className="glass-effect p-12 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
            <div className="relative z-10 space-y-6">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold">Ready to Transform Your Content?</h3>
                <p className="text-lg text-muted-foreground">
                  Join thousands of creators who are already using FlexFlow AI 
                  to build amazing content.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:opacity-90 shadow-glow text-lg px-8 py-6 h-auto"
                  asChild
                >
                  <Link to="/dashboard">
                    Start Free Trial
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="neon-border text-lg px-8 py-6 h-auto"
                  asChild
                >
                  <Link to="/templates">
                    View Examples
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-32 border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Sparkles className="h-5 w-5 text-background" />
              </div>
              <span className="font-semibold text-foreground">FlexFlow AI</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © 2024 FlexFlow AI. Crafted with ⚡ for creators.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}