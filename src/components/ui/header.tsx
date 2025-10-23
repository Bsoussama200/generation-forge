import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Coins, User, Settings, LogOut, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  // Mock user data - will be replaced with real auth
  const user = {
    name: "Sarah Chen",
    email: "sarah@example.com", 
    avatar: "",
    tokens: 2847
  };

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80", className)}>
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">
            FlexFlowLab
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" className="text-sm font-medium h-9" asChild>
            <a href="/">Explore</a>
          </Button>
          <Button variant="ghost" className="text-sm font-medium h-9" asChild>
            <a href="/templates">Templates</a>
          </Button>
          <Button variant="ghost" className="text-sm font-medium h-9" asChild>
            <a href="/create">Create</a>
          </Button>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {/* Token Balance */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-md bg-secondary/50 border border-border/50">
            <Coins className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-medium">{user.tokens.toLocaleString()}</span>
          </div>

          {/* Buy Tokens Button */}
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs font-medium">
            Get Credits
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-secondary text-foreground text-xs">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}