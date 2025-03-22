
import React, { useState } from "react";
import { Car } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Transport } from "@/models/transport";
import { createVehicle, uploadVehicleImage } from "@/services/transportService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VehicleForm, { AddVehicleFormValues } from "./VehicleForm";

const AddVehicleDialog: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: AddVehicleFormValues) => {
    if (!imageFile) {
      toast({
        title: "Error",
        description: "Please upload a vehicle image",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Step 1: Upload image
      const imageUrl = await uploadVehicleImage(imageFile);
      
      // Step 2: Create vehicle with the image URL
      const newVehicle: Omit<Transport, 'id'> = {
        name: data.name,
        type: data.type,
        status: data.status,
        capacity: Number(data.capacity),
        location: data.location,
        imageUrl: imageUrl,
        truckNumber: data.truckNumber,
      };
      
      await createVehicle(newVehicle);
      
      // Success - both operations completed
      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });
      
      // Reset form and close dialog
      resetForm();
      
      // Trigger refresh of vehicle list
      if (onSuccess) onSuccess();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
      console.error("Add vehicle error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hidden sm:flex">
          <Car className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Enter the details of the new vehicle to add to your fleet.
          </DialogDescription>
        </DialogHeader>
        
        <VehicleForm
          onSubmit={onSubmit}
          imageFile={imageFile}
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          isSubmitting={isSubmitting}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleDialog;
