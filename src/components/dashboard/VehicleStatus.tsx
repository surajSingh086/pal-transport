
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getTransports } from "@/services/transportService";

const getStatusColor = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "IN_TRANSIT":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "MAINTENANCE":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getVehicleInitials = (type: string) => {
  switch (type) {
    case "TRUCK":
      return "TK";
    case "VAN":
      return "VN";
    case "CAR":
      return "CR";
    default:
      return "VH";
  }
};

const VehicleStatus: React.FC = () => {
  // Use React Query to fetch real data
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getTransports,
  });
  
  // Show top 3 vehicles or use loading state
  const displayVehicles = isLoading ? [] : vehicles?.slice(0, 3) || [];

  return (
    <Card className="border-0 shadow-sm animate-fade-in" style={{ animationDelay: "200ms" }}>
      <CardHeader>
        <CardTitle>Fleet Status</CardTitle>
        <CardDescription>Current status of your transport vehicles</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={vehicle.imageUrl} alt={vehicle.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getVehicleInitials(vehicle.type)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {vehicle.name}
                      {vehicle.type === "TRUCK" && vehicle.truckNumber && ` (${vehicle.truckNumber})`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{vehicle.location}</p>
                  </div>
                </div>
                <Badge className={cn("font-normal transition-colors", getStatusColor(vehicle.status))}>
                  {vehicle.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleStatus;
