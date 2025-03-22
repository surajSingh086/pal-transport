
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Client, Address, AddressType } from "@/models/client";
import { OrderStatus, TransportSize, OrderTransport } from "@/models/order";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { calculateDistance } from "@/services/orderService";

import AddressSelection from "./transport/AddressSelection";
import AddressForm from "./transport/AddressForm";
import TruckSelection from "./transport/TruckSelection";

// Define the form schema using zod
const transportFormSchema = z.object({
  status: z.enum(["NEW", "IN_TRANSIT", "DELIVERED"]),
  size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
  useExistingSourceAddress: z.boolean().optional(),
  sourceAddressId: z.string().optional(),
  source: z.object({
    addressLine1: z.string().min(3, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    addressLine3: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pinCode: z.string().min(6, "PIN code is required"),
    country: z.string().min(2, "Country is required"),
    addressType: z.enum(["OFFICE", "BILLING", "TRANSPORT", "DRIVER"])
  }).optional(),
  useExistingDestinationAddress: z.boolean().optional(),
  destinationAddressId: z.string().optional(),
  destination: z.object({
    addressLine1: z.string().min(3, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    addressLine3: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pinCode: z.string().min(6, "PIN code is required"),
    country: z.string().min(2, "Country is required"),
    addressType: z.enum(["OFFICE", "BILLING", "TRANSPORT", "DRIVER"])
  }).optional(),
  truckId: z.string().optional(),
  distance: z.number().optional(),
});

interface TransportFormStepProps {
  client: Client;
  onSubmit: (data: OrderTransport) => void;
  onBack: () => void;
}

const TransportFormStep: React.FC<TransportFormStepProps> = ({
  client,
  onSubmit,
  onBack,
}) => {
  const [size, setSize] = React.useState<TransportSize>(TransportSize.MEDIUM);
  const [useExistingSource, setUseExistingSource] = React.useState(false);
  const [useExistingDestination, setUseExistingDestination] = React.useState(false);
  const [selectedSourceId, setSelectedSourceId] = React.useState<string | null>(null);
  const [selectedDestinationId, setSelectedDestinationId] = React.useState<string | null>(null);
  const [distance, setDistance] = React.useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof transportFormSchema>>({
    resolver: zodResolver(transportFormSchema),
    defaultValues: {
      status: OrderStatus.NEW,
      size: TransportSize.MEDIUM,
      source: {
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
        addressType: AddressType.TRANSPORT
      },
      destination: {
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
        addressType: AddressType.TRANSPORT
      },
    }
  });

  // Calculate distance when both source and destination addresses are selected
  useEffect(() => {
    const fetchDistance = async () => {
      if (
        (useExistingSource && selectedSourceId) && 
        (useExistingDestination && selectedDestinationId)
      ) {
        try {
          console.log("Calculating distance between", selectedSourceId, "and", selectedDestinationId);
          const calculatedDistance = await calculateDistance(selectedSourceId, selectedDestinationId);
          setDistance(calculatedDistance);
          form.setValue("distance", calculatedDistance);
          toast({
            title: "Distance calculated",
            description: `The distance between the two locations is approximately ${calculatedDistance} km.`,
          });
        } catch (error) {
          console.error("Error calculating distance:", error);
          toast({
            title: "Error calculating distance",
            description: "Could not calculate the distance between locations.",
            variant: "destructive",
          });
        }
      }
    };

    fetchDistance();
  }, [selectedSourceId, selectedDestinationId, useExistingSource, useExistingDestination, form, toast]);

  const handleSubmit = (values: z.infer<typeof transportFormSchema>) => {
    console.log("Transport form submitted:", values);
    let sourceAddress: Address;
    let destinationAddress: Address;

    if (useExistingSource && selectedSourceId) {
      const found = client.addresses.find(addr => addr.id === selectedSourceId);
      if (!found) {
        toast({
          title: "Error",
          description: "Source address not found",
          variant: "destructive",
        });
        return;
      }
      sourceAddress = found;
    } else {
      if (!values.source) {
        toast({
          title: "Error",
          description: "Source address is required",
          variant: "destructive",
        });
        return;
      }
      sourceAddress = values.source as Address;
    }

    if (useExistingDestination && selectedDestinationId) {
      const found = client.addresses.find(addr => addr.id === selectedDestinationId);
      if (!found) {
        toast({
          title: "Error",
          description: "Destination address not found",
          variant: "destructive",
        });
        return;
      }
      destinationAddress = found;
    } else {
      if (!values.destination) {
        toast({
          title: "Error",
          description: "Destination address is required",
          variant: "destructive",
        });
        return;
      }
      destinationAddress = values.destination as Address;
    }

    const transportData: OrderTransport = {
      status: values.status as OrderStatus,
      size: values.size as TransportSize,
      source: sourceAddress,
      destination: destinationAddress,
      truckId: values.truckId,
      distance: distance || 0,
    };

    console.log("Transport data being submitted:", transportData);
    onSubmit(transportData);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "size") {
        setSize(value.size as TransportSize);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Transport Details</h3>
        <p className="text-muted-foreground">
          Enter transport details and select available truck
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status*</FormLabel>
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
                      <SelectItem value={OrderStatus.NEW}>New</SelectItem>
                      <SelectItem value={OrderStatus.IN_TRANSIT}>In Transit</SelectItem>
                      <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport Size*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TransportSize.SMALL}>Small</SelectItem>
                      <SelectItem value={TransportSize.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={TransportSize.LARGE}>Large</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Source Address */}
          <div className="space-y-4 border rounded-md p-4">
            <h4 className="font-medium">Source Address</h4>
            
            {client.addresses && client.addresses.length > 0 && (
              <AddressSelection 
                addresses={client.addresses}
                useExisting={useExistingSource}
                setUseExisting={setUseExistingSource}
                selectedAddressId={selectedSourceId}
                setSelectedAddressId={setSelectedSourceId}
                addressType="source"
              />
            )}

            {!useExistingSource && (
              <AddressForm form={form} prefix="source" />
            )}
          </div>

          {/* Destination Address */}
          <div className="space-y-4 border rounded-md p-4">
            <h4 className="font-medium">Destination Address</h4>
            
            {client.addresses && client.addresses.length > 0 && (
              <AddressSelection 
                addresses={client.addresses}
                useExisting={useExistingDestination}
                setUseExisting={setUseExistingDestination}
                selectedAddressId={selectedDestinationId}
                setSelectedAddressId={setSelectedDestinationId}
                addressType="destination"
              />
            )}

            {!useExistingDestination && (
              <AddressForm form={form} prefix="destination" />
            )}
          </div>

          {/* Display calculated distance if available */}
          {distance && (
            <div className="p-4 bg-muted rounded-md">
              <p className="font-medium">Calculated Distance: {distance} km</p>
            </div>
          )}

          {/* Truck Selection */}
          <TruckSelection form={form} size={size} />

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TransportFormStep;
