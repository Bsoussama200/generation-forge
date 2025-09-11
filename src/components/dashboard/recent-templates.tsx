import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Clock, Star } from "lucide-react";

interface RecentTemplate {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  lastUsed: string;
  rating: number;
  creator: {
    name: string;
    avatar?: string;
  };
}

export function RecentTemplates() {
  const recentTemplates: RecentTemplate[] = [
    {
      id: "1",
      title: "Professional LinkedIn Banner",
      category: "Professional",
      thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop",
      lastUsed: "2 hours ago",
      rating: 4.8,
      creator: {
        name: "Alex Rivera",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
      }
    },
    {
      id: "2", 
      title: "Birthday Celebration Video",
      category: "Events",
      thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=225&fit=crop",
      lastUsed: "1 day ago",
      rating: 4.9,
      creator: {
        name: "Maria Santos",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b9f64ecc?w=40&h=40&fit=crop&crop=face"
      }
    },
    {
      id: "3",
      title: "Product Showcase Reel",
      category: "Ecommerce", 
      thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop",
      lastUsed: "3 days ago",
      rating: 4.7,
      creator: {
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
      }
    }
  ];

  return (
    <Card className="bg-gradient-card shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recently Used Templates</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTemplates.map((template) => (
          <div key={template.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer">
            {/* Thumbnail */}
            <div className="relative flex-shrink-0">
              <img
                src={template.thumbnail}
                alt={template.title}
                className="w-16 h-10 rounded-md object-cover"
              />
              <div className="absolute inset-0 bg-black/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                  {template.title}
                </h3>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Star className="h-3 w-3 fill-token-gold text-token-gold" />
                  <span className="text-xs text-muted-foreground">{template.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={template.creator.avatar} alt={template.creator.name} />
                      <AvatarFallback className="text-[8px] bg-gradient-primary text-primary-foreground">
                        {template.creator.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{template.creator.name}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{template.lastUsed}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}