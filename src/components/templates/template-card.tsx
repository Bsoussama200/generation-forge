import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coins, Star, Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: {
    id: string;
    title: string;
    description: string;
    category: string[];
    tags: string[];
    tokenCost: number;
    thumbnail: string;
    creator: {
      name: string;
      avatar?: string;
    };
    stats: {
      uses: number;
      rating: number;
      likes: number;
    };
  };
  className?: string;
}

export function TemplateCard({ template, className }: TemplateCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-medium hover:-translate-y-1 bg-gradient-card border-border/50",
      className
    )}>
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gradient-secondary">
        <img
          src={template.thumbnail}
          alt={template.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=225&fit=crop";
          }}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Quick actions on hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button size="sm" variant="secondary" className="shadow-soft">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button size="sm" className="bg-gradient-primary shadow-soft">
            Use Template
          </Button>
        </div>

        {/* Token cost badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-background/90 text-foreground border-border/50 shadow-soft">
            <Coins className="h-3 w-3 mr-1 text-token-gold" />
            {template.tokenCost}
          </Badge>
        </div>
      </div>

      <CardHeader className="space-y-3">
        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {template.category.slice(0, 2).map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
          {template.category.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{template.category.length - 2}
            </Badge>
          )}
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {template.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {template.description}
          </p>
        </div>
      </CardHeader>

      <CardFooter className="flex items-center justify-between pt-0">
        {/* Creator */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={template.creator.avatar} alt={template.creator.name} />
            <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
              {template.creator.name[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{template.creator.name}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-token-gold text-token-gold" />
            <span>{template.stats.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-3 w-3" />
            <span>{template.stats.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{template.stats.uses}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}