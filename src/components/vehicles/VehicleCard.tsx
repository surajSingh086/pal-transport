
import React from "react";
import { Transport } from "@/models/transport";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, Package, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface VehicleCardProps {
  vehicle: Transport;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const navigate = useNavigate();
  
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

  const handleManage = () => {
    navigate(`/vehicles/${vehicle.id}`);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-sm transition-all hover:shadow-md animate-fade-in">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={vehicle.imageUrl}
          alt={vehicle.name}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
        <Badge 
          className={cn(
            "absolute top-3 right-3 font-normal transition-colors", 
            getStatusColor(vehicle.status)
          )}
        >
          {vehicle.status}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{vehicle.name}</CardTitle>
        <CardDescription className="capitalize">{vehicle.type}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pb-0">
        <div className="flex items-center text-sm">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{vehicle.location}</span>
        </div>
        <div className="flex items-center text-sm">
          <Package className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Capacity: {vehicle.capacity} kg</span>
        </div>
        {/* Display truck number for truck type vehicles */}
        {vehicle.type === "TRUCK" && vehicle.truckNumber && (
          <div className="flex items-center text-sm">
            <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Truck #: {vehicle.truckNumber}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant="outline" size="sm" className="w-full" onClick={handleManage}>
          <Settings className="mr-2 h-4 w-4" />
          Manage
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
