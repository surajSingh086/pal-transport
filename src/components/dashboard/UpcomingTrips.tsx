
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const trips = [
  {
    id: "1",
    driver: "Sarah Johnson",
    origin: "Los Angeles",
    destination: "San Francisco",
    startTime: "2023-11-01T08:00:00Z",
    status: "in-progress",
  },
  {
    id: "2",
    driver: "John Smith",
    origin: "New York",
    destination: "Boston",
    startTime: "2023-11-02T09:00:00Z",
    status: "scheduled",
  },
  {
    id: "3",
    driver: "David Wilson",
    origin: "Seattle",
    destination: "Portland",
    startTime: "2023-11-03T07:30:00Z",
    status: "scheduled",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "in-progress":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "cancelled":
      return "bg-rose-100 text-rose-800 hover:bg-rose-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy • h:mm a");
};

const UpcomingTrips: React.FC = () => {
  return (
    <Card className="border-0 shadow-sm animate-fade-in" style={{ animationDelay: "250ms" }}>
      <CardHeader>
        <CardTitle>Upcoming Trips</CardTitle>
        <CardDescription>Schedule for the next few days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {trips.map((trip) => (
          <div key={trip.id} className="border rounded-lg p-4 bg-card transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <div className="font-medium">{trip.driver}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {formatDate(trip.startTime)}
                </div>
              </div>
              <Badge className={cn("font-normal transition-colors", getStatusColor(trip.status))}>
                {trip.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>From: <span className="font-medium">{trip.origin}</span></span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>To: <span className="font-medium">{trip.destination}</span></span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingTrips;
