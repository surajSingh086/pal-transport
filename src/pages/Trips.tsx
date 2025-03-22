import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { getTrips, getDriverById, getTransportById } from "@/services/transportService";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, MapPin, TruckIcon, User, Clock, ArrowRight } from "lucide-react";

const Trips: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const { data: trips, isLoading, error } = useQuery({
    queryKey: ["trips"],
    queryFn: getTrips,
  });

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "IN_PROGRESS":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800 hover:bg-rose-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy • h:mm a");
  };

  return (
    <div className="flex h-screen bg-secondary/30">
      {!isMobile && (
        <aside className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0">
          <Sidebar />
        </aside>
      )}
      <div className={cn("flex flex-col flex-1", !isMobile && "md:pl-64")}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Trips</h1>
            <p className="text-muted-foreground">
              Manage and track ongoing and scheduled trips
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              Error loading trips data
            </div>
          ) : (
            <div className="space-y-4">
              {trips?.map((trip, index) => (
                <Card 
                  key={trip.id} 
                  className="border-0 shadow-sm transition-all hover:shadow-md cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{trip.origin} to {trip.destination}</CardTitle>
                      <Badge className={cn("font-normal transition-colors", getStatusColor(trip.status))}>
                        {trip.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Departure</span>
                        </div>
                        <div className="text-sm">{formatDate(trip.startTime)}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <TruckIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Vehicle ID</span>
                        </div>
                        <div className="text-sm">{trip.transportId}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Driver ID</span>
                        </div>
                        <div className="text-sm">{trip.driverId}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Distance</span>
                        </div>
                        <div className="text-sm">{trip.distance} km</div>
                      </div>
                    </div>
                    
                    {trip.status === "IN_PROGRESS" && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            {trip.origin}
                          </div>
                          <div className="flex-1 px-2">
                            <div className="relative h-1 bg-gray-200 rounded-full">
                              <div className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full" style={{ width: "60%" }}></div>
                              <div className="absolute top-0 left-[60%] transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                            {trip.destination}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Trips;
