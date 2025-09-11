import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Coins, FileText, Zap } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

function StatsCard({ title, value, change, icon, trend = "neutral" }: StatsCardProps) {
  return (
    <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-gradient-secondary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <Badge 
              variant={trend === "up" ? "default" : trend === "down" ? "destructive" : "secondary"}
              className="text-xs"
            >
              {trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
              {change}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const stats = [
    {
      title: "Token Balance",
      value: "2,847",
      change: "+247 today",
      icon: <Coins className="h-4 w-4 text-token-gold" />,
      trend: "up" as const
    },
    {
      title: "Templates Created",
      value: "12",
      change: "+2 this week",
      icon: <FileText className="h-4 w-4 text-primary" />,
      trend: "up" as const
    },
    {
      title: "Content Generated",
      value: "156",
      change: "+23 today",
      icon: <Zap className="h-4 w-4 text-info" />,
      trend: "up" as const
    },
    {
      title: "Templates Used",
      value: "89",
      change: "+12 this week",
      icon: <TrendingUp className="h-4 w-4 text-success" />,
      trend: "up" as const
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}