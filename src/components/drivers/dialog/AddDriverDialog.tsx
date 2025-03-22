import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createDriver, uploadDriverImage } from "@/services/transportService";
import { DriverForm } from "../form/DriverForm";
import { DriverFormValues } from "../form/DriverFormSchema";

export function AddDriverDialog() {
  const [open, setOpen] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (values: DriverFormValues) => {
    try {
      setIsSubmitting(true);
      
      // First upload the image if one was selected
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadDriverImage(imageFile);
      }
      
      // Ensure we provide all required fields from the Driver type
      const newDriver = await createDriver({
        name: values.name,
        status: values.status,
        rating: values.rating,
        licensePlate: values.licensePlate,
        vehicleType: values.vehicleType,
        phoneNumber: values.phoneNumber,
        imageUrl: imageUrl || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10) + 1}.jpg`
      });
      
      toast({
        title: "Success",
        description: `Driver ${newDriver.name} was successfully added`,
      });
      
      // Reset form and close dialog
      setImageFile(null);
      setOpen(false);
      
      // Refresh page after 1 second to show the new driver
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Error adding driver:", error);
      toast({
        title: "Error",
        description: "Failed to add driver. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hidden sm:flex">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new driver to your fleet.
          </DialogDescription>
        </DialogHeader>
        
        <DriverForm 
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          onImageSelected={setImageFile}
          imageFile={imageFile}
          isSubmitting={isSubmitting}
        />
        
      </DialogContent>
    </Dialog>
  );
}
