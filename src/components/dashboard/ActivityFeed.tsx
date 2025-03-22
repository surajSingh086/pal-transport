
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      initials: "SJ",
    },
    action: "started delivery trip",
    target: "Los Angeles to San Francisco",
    time: "15 minutes ago",
    status: "in-progress",
  },
  {
    id: 2,
    user: {
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      initials: "JS",
    },
    action: "completed delivery",
    target: "Truck Alpha route",
    time: "1 hour ago",
    status: "completed",
  },
  {
    id: 3,
    user: {
      name: "System",
      avatar: "",
      initials: "SYS",
    },
    action: "flagged vehicle for maintenance",
    target: "Heavy Loader",
    time: "2 hours ago",
    status: "alert",
  },
  {
    id: 4,
    user: {
      name: "David Wilson",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      initials: "DW",
    },
    action: "scheduled new trip",
    target: "Seattle to Portland",
    time: "3 hours ago",
    status: "scheduled",
  },
  {
    id: 5,
    user: {
      name: "Jessica Miller",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      initials: "JM",
    },
    action: "canceled trip",
    target: "Miami to Orlando",
    time: "4 hours ago",
    status: "canceled",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "canceled":
      return <XCircle className="h-4 w-4 text-rose-500" />;
    case "alert":
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case "in-progress":
    case "scheduled":
    default:
      return <Clock className="h-4 w-4 text-blue-500" />;
  }
};

const ActivityFeed: React.FC = () => {
  return (
    <Card className="border-0 shadow-sm animate-fade-in" style={{ animationDelay: "300ms" }}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest activities in your transport system</CardDescription>
      </CardHeader>
      <CardContent className="max-h-80 overflow-auto">
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar className="h-9 w-9 border">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className={cn(
                  activity.user.name === "System" ? "bg-gray-100 text-gray-600" : "bg-primary/10 text-primary"
                )}>
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  <p className="text-sm font-medium leading-none">
                    {activity.user.name}
                  </p>
                  <div className="mx-2">{getStatusIcon(activity.status)}</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.action} <span className="font-medium text-foreground">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
