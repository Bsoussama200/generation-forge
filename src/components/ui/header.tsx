import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-14 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">FlexFlowLab</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="text-sm font-medium" asChild>
            <Link to="/">Explore</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-sm font-medium" asChild>
            <Link to="/templates">Templates</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-sm font-medium" asChild>
            <Link to="/create">Create</Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-sm font-medium">
            Community
          </Button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="text-sm font-medium hidden sm:inline-flex">
            Pricing
          </Button>
          <Button variant="ghost" size="sm" className="text-sm font-medium">
            Login
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}