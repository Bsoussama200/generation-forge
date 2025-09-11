import { Button } from "@/components/ui/button";
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
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-medium">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TemplateForge
            </h1>
            <span className="text-xs text-muted-foreground">AI</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" className="text-sm font-medium" asChild>
            <a href="/templates">Templates</a>
          </Button>
          <Button variant="ghost" className="text-sm font-medium">
            My Templates
          </Button>
          <Button variant="outline" className="space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </Button>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Token Balance */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-secondary border">
            <Coins className="h-4 w-4 text-token-gold" />
            <span className="text-sm font-medium">{user.tokens.toLocaleString()}</span>
            <Badge variant="secondary" className="text-xs">tokens</Badge>
          </div>

          {/* Buy Tokens Button */}
          <Button size="sm" className="bg-gradient-primary hover:opacity-90 shadow-soft">
            <Coins className="h-4 w-4 mr-2" />
            Buy Tokens
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
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