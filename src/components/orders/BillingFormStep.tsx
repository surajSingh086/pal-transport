
import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Client } from "@/models/client";
import { OrderTransport } from "@/models/order";
import { calculateDistance } from "@/services/orderService";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Define the form schema using zod
const billingFormSchema = z.object({
  distance: z.number().min(1, "Distance must be at least 1 km"),
  ratePerKm: z.number().min(1, "Rate must be at least 1"),
  gstRate: z.number().min(0, "GST rate cannot be negative").max(100, "GST rate cannot exceed 100%"),
  subtotal: z.number(),
  gstAmount: z.number(),
  totalAmount: z.number(),
});

type BillingFormValues = z.infer<typeof billingFormSchema>;

interface BillingFormStepProps {
  client: Client;
  transport: OrderTransport;
  onSubmit: (data: BillingFormValues) => void;
  onBack: () => void;
}

const BillingFormStep: React.FC<BillingFormStepProps> = ({
  client,
  transport,
  onSubmit,
  onBack,
}) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const form = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: {
      distance: 0,
      ratePerKm: 15,
      gstRate: 18,
      subtotal: 0,
      gstAmount: 0,
      totalAmount: 0,
    }
  });

  const calculateBilling = async () => {
    setIsCalculating(true);
    try {
      // Calculate distance using the service
      const distance = await calculateDistance(
        transport.source.id || "source",
        transport.destination.id || "destination"
      );

      const ratePerKm = form.getValues("ratePerKm");
      const gstRate = form.getValues("gstRate");
      
      const subtotal = distance * ratePerKm;
      const gstAmount = (subtotal * gstRate) / 100;
      const totalAmount = subtotal + gstAmount;

      form.setValue("distance", distance);
      form.setValue("subtotal", subtotal);
      form.setValue("gstAmount", gstAmount);
      form.setValue("totalAmount", totalAmount);

      toast({
        title: "Distance calculated",
        description: `The distance between ${transport.source.city} and ${transport.destination.city} is ${distance} km.`,
      });
    } catch (error) {
      toast({
        title: "Error calculating distance",
        description: "Could not calculate the distance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // Calculate billing when component mounts
  useEffect(() => {
    calculateBilling();
  }, []);

  // Recalculate billing when rate or GST changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "ratePerKm" || name === "gstRate") {
        const distance = form.getValues("distance");
        const ratePerKm = form.getValues("ratePerKm");
        const gstRate = form.getValues("gstRate");
        
        const subtotal = distance * ratePerKm;
        const gstAmount = (subtotal * gstRate) / 100;
        const totalAmount = subtotal + gstAmount;

        form.setValue("subtotal", subtotal);
        form.setValue("gstAmount", gstAmount);
        form.setValue("totalAmount", totalAmount);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Billing Details</h3>
        <p className="text-muted-foreground">
          Review and confirm the billing information
        </p>
      </div>

      <div className="bg-muted/30 p-4 rounded-md space-y-2">
        <div className="flex justify-between">
          <span>Source:</span>
          <span className="font-medium">{transport.source.city}, {transport.source.state}</span>
        </div>
        <div className="flex justify-between">
          <span>Destination:</span>
          <span className="font-medium">{transport.destination.city}, {transport.destination.state}</span>
        </div>
        <div className="flex justify-between">
          <span>Transport Size:</span>
          <span className="font-medium">{transport.size.charAt(0).toUpperCase() + transport.size.slice(1)}</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (km)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          readOnly
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={calculateBilling}
                        disabled={isCalculating}
                      >
                        {isCalculating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Recalculate"
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ratePerKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate per km (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gstRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Rate (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted/20 p-6 rounded-md space-y-6">
              <h4 className="font-medium">Billing Summary</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{form.watch("subtotal").toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({form.watch("gstRate")}%):</span>
                  <span>₹{form.watch("gstAmount").toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span>₹{form.watch("totalAmount").toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Continue to Payment</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BillingFormStep;
