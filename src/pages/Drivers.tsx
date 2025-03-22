
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { getDrivers } from "@/services/driverService";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Star, CarFront } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { AddDriverDialog } from "@/components/drivers";

const Drivers: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { data: drivers, isLoading, error } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  });

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "ON_TRIP":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "OFF_DUTY":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleViewDetails = (driverId: string) => {
    navigate(`/drivers/${driverId}`);
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Drivers</h1>
              <p className="text-muted-foreground">
                Manage your driver workforce
              </p>
            </div>
            <AddDriverDialog />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              Error loading drivers data
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {drivers?.map((driver) => (
                <Card key={driver.id} className="border-0 shadow-sm transition-all hover:shadow-md animate-fade-in">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={driver.imageUrl} alt={driver.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {driver.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{driver.name}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                        <span className="text-sm">{driver.rating}</span>
                      </div>
                    </div>
                    <Badge className={cn("font-normal transition-colors", getStatusColor(driver.status))}>
                      {driver.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-0">
                    <div className="flex items-center text-sm">
                      <CarFront className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {driver.vehicleType} • {driver.licensePlate}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{driver.phoneNumber}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleViewDetails(driver.id)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Drivers;
