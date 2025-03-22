
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { getTransports } from "@/services/transportService";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddVehicleDialog from "@/components/vehicles/AddVehicleDialog";

const Vehicles: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const { data: vehicles, isLoading, error, refetch } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getTransports,
  });

  if (!user) return null;

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
              <h1 className="text-2xl font-bold">Vehicles</h1>
              <p className="text-muted-foreground">
                Manage and monitor your transport fleet
              </p>
            </div>
            <AddVehicleDialog onSuccess={() => refetch()} />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              Error loading vehicles data
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles?.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Vehicles;
