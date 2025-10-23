import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coins, Star, Heart, Play } from "lucide-react";
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
    <Card className={cn("overflow-hidden hover:scale-[1.02] transition-all duration-300 group bg-card border-border/50", className)}>
      <div className="relative aspect-video overflow-hidden bg-secondary">
        <img 
          src={template.thumbnail}
          alt={template.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-secondary/80 backdrop-blur text-foreground border-border/50 text-xs">
            {template.category[0]}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3 space-y-2">
        <h3 className="text-base line-clamp-1 group-hover:text-primary transition-colors font-semibold">
          {template.title}
        </h3>
        <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
          {template.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="font-medium">{template.stats.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Play className="h-3.5 w-3.5" />
            <span>{(template.stats.uses / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            <span>{(template.stats.likes / 1000).toFixed(1)}K</span>
          </div>
        </div>

        {/* Creator & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={template.creator.avatar} alt={template.creator.name} />
              <AvatarFallback className="text-[10px]">{template.creator.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">{template.creator.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Coins className="h-3 w-3 text-primary" />
              <span className="font-medium">{template.tokenCost}</span>
            </div>
            <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
              Use
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}