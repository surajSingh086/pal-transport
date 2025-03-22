
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getAvailableTrucks } from "@/services/orderService";
import { TransportSize } from "@/models/order";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TruckSelectionProps {
  form: UseFormReturn<any>;
  size: TransportSize;
}

const TruckSelection: React.FC<TruckSelectionProps> = ({ form, size }) => {
  const { toast } = useToast();
  
  const { data: availableTrucks, isLoading: trucksLoading, error: trucksError } = useQuery({
    queryKey: ["availableTrucks", size],
    queryFn: () => getAvailableTrucks(size),
    enabled: !!size,
    retry: 1,
    onError: (error) => {
      toast({
        title: "Error loading trucks",
        description: "Could not load available trucks. Using fallback data.",
        variant: "destructive"
      });
    }
  });

  // Get the current selected truck id
  const selectedTruckId = form.watch("truckId");
  
  // Find the selected truck object
  const selectedTruck = availableTrucks?.find(truck => truck.id === selectedTruckId);

  // Debug logging
  React.useEffect(() => {
    console.log("Truck selection:", {
      size,
      selectedTruckId,
      selectedTruck,
      availableTrucks,
      hasError: !!trucksError
    });
  }, [size, selectedTruckId, selectedTruck, availableTrucks, trucksError]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="truckId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Truck</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={trucksLoading}
            >
              <FormControl>
                <SelectTrigger>
                  {trucksLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Loading trucks...</span>
                    </div>
                  ) : trucksError ? (
                    <div className="flex items-center text-amber-500">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span>Error loading trucks</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select available truck" />
                  )}
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {trucksLoading ? (
                  <SelectItem value="loading" disabled>Loading trucks...</SelectItem>
                ) : trucksError ? (
                  <SelectItem value="error" disabled>Error loading trucks</SelectItem>
                ) : availableTrucks && availableTrucks.length > 0 ? (
                  availableTrucks.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id}>
                      {truck.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No trucks available</SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Display selected truck details */}
      {selectedTruck && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="text-sm">
              <div className="font-medium mb-1">Selected Truck:</div>
              <div>{selectedTruck.name}</div>
              {selectedTruck.capacity && (
                <div className="mt-1 text-muted-foreground">Capacity: {selectedTruck.capacity} kg</div>
              )}
              {selectedTruck.truckNumber && (
                <div className="text-muted-foreground">License: {selectedTruck.truckNumber}</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TruckSelection;
