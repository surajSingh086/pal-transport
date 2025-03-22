
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Car, 
  Users, 
  Calendar, 
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Available Vehicles",
    value: "12",
    change: "+2",
    trend: "up",
    icon: <Car className="h-4 w-4" />,
  },
  {
    title: "Active Drivers",
    value: "8",
    change: "-1",
    trend: "down",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Ongoing Trips",
    value: "5",
    change: "+3",
    trend: "up",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    title: "Maintenance Alerts",
    value: "2",
    change: "0",
    trend: "neutral",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
];

const DashboardOverview: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden border-0 shadow-sm animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={cn(
              "p-2 rounded-full",
              stat.trend === "up" ? "bg-green-100 text-green-700" : 
              stat.trend === "down" ? "bg-rose-100 text-rose-700" : 
              "bg-gray-100 text-gray-700"
            )}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center pt-1 text-xs">
              {stat.trend === "up" ? (
                <>
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                  <span className="text-green-600">{stat.change}</span>
                </>
              ) : stat.trend === "down" ? (
                <>
                  <ArrowDownRight className="mr-1 h-3 w-3 text-rose-600" />
                  <span className="text-rose-600">{stat.change}</span>
                </>
              ) : (
                <span className="text-gray-500">No change</span>
              )}
              <span className="ml-1 text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardOverview;
