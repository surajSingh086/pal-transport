import React from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Transport, TransportStatus } from "@/models/transport";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "./ImageUpload";

export interface AddVehicleFormValues {
  name: string;
  type: 'TRUCK' | 'VAN' | 'CAR';
  status: TransportStatus;
  capacity: string;
  location: string;
  truckNumber: string;
}

interface VehicleFormProps {
  onSubmit: (data: AddVehicleFormValues) => void;
  imageFile: File | null;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  onSubmit,
  imageFile,
  imagePreview,
  handleImageChange,
  isSubmitting,
  onCancel
}) => {
  const form = useForm<AddVehicleFormValues>({
    defaultValues: {
      name: '',
      type: 'TRUCK',
      status: TransportStatus.AVAILABLE,
      capacity: '',
      location: '',
      truckNumber: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 py-4">
          {/* Image Upload Section */}
          <ImageUpload 
            imagePreview={imagePreview} 
            onChange={handleImageChange} 
          />

          {/* Vehicle Details Form */}
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Vehicle name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter vehicle name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              rules={{ required: "Vehicle type is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TRUCK">Truck</SelectItem>
                      <SelectItem value="VAN">Van</SelectItem>
                      <SelectItem value="CAR">Car</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TransportStatus.AVAILABLE}>Available</SelectItem>
                      <SelectItem value={TransportStatus.IN_TRANSIT}>In Transit</SelectItem>
                      <SelectItem value={TransportStatus.MAINTENANCE}>Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="capacity"
              rules={{ 
                required: "Capacity is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Must be a number"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              rules={{ required: "Location is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="truckNumber"
            rules={{ required: "Truck number is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Truck Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter truck number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Vehicle
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleForm;
