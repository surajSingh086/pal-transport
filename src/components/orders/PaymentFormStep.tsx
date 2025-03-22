import React, { useState } from "react";
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
import { OrderTransport, PaymentMode, PaymentType, Payment } from "@/models/order";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, CreditCard, IndianRupee, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getCashTransactionId, getAvailableDrivers } from "@/services/orderService";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const paymentFormSchema = z.object({
  paymentType: z.enum(["COMPLETE", "PARTIAL"]),
  paymentMode: z.enum(["UPI", "CHEQUE", "CASH"]),
  amount: z.number().min(1, "Amount must be at least 1"),
  transactionId: z.string().min(1, "Transaction ID is required"),
  nextPaymentDate: z.date().optional(),
  remainingAmount: z.number().optional(),
  driverId: z.string().min(1, "Driver is required"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormStepProps {
  client: Client;
  transport: OrderTransport;
  billing: {
    distance: number;
    ratePerKm: number;
    subtotal: number;
    gstRate: number;
    gstAmount: number;
    totalAmount: number;
  };
  onSubmit: (data: { payment: Payment, driverId: string }) => void;
  onBack: () => void;
}

const PaymentFormStep: React.FC<PaymentFormStepProps> = ({
  client,
  transport,
  billing,
  onSubmit,
  onBack,
}) => {
  const [isGeneratingTransactionId, setIsGeneratingTransactionId] = useState(false);
  const { toast } = useToast();
  const [isPartial, setIsPartial] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentType: "COMPLETE",
      paymentMode: "UPI",
      amount: billing.totalAmount,
      transactionId: "",
      remainingAmount: 0,
    }
  });

  const { data: drivers, isLoading: driversLoading } = useQuery({
    queryKey: ["availableDrivers"],
    queryFn: getAvailableDrivers,
  });

  const paymentType = form.watch("paymentType");
  const paymentMode = form.watch("paymentMode");
  const paymentAmount = form.watch("amount");

  React.useEffect(() => {
    const newIsPartial = paymentType === "PARTIAL";
    setIsPartial(newIsPartial);
    
    if (newIsPartial) {
      const remaining = billing.totalAmount - paymentAmount;
      form.setValue("remainingAmount", remaining >= 0 ? remaining : 0);
    } else {
      form.setValue("amount", billing.totalAmount);
      form.setValue("remainingAmount", 0);
      form.setValue("nextPaymentDate", undefined);
    }
  }, [paymentType, paymentAmount, form, billing.totalAmount]);

  const generateCashTransactionId = async () => {
    if (paymentMode !== "CASH") return;

    setIsGeneratingTransactionId(true);
    try {
      const transactionId = await getCashTransactionId();
      form.setValue("transactionId", transactionId);
      toast({
        title: "Transaction ID generated",
        description: `Generated transaction ID: ${transactionId}`,
      });
    } catch (error) {
      toast({
        title: "Error generating transaction ID",
        description: "Could not generate transaction ID. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTransactionId(false);
    }
  };

  const handleSubmit = (values: PaymentFormValues) => {
    const paymentData: Payment = {
      amount: values.amount,
      paymentType: values.paymentType as PaymentType,
      paymentMode: values.paymentMode as PaymentMode,
      transactionId: values.transactionId,
      nextPaymentDate: values.nextPaymentDate ? format(values.nextPaymentDate, 'yyyy-MM-dd') : undefined,
      remainingAmount: values.remainingAmount,
    };

    onSubmit({ 
      payment: paymentData, 
      driverId: values.driverId 
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Details</h3>
        <p className="text-muted-foreground">
          Enter payment information and select driver
        </p>
      </div>

      <div className="bg-muted/30 p-4 rounded-md space-y-2">
        <div className="flex justify-between">
          <span>Client:</span>
          <span className="font-medium">{client.companyName}</span>
        </div>
        <div className="flex justify-between">
          <span>Route:</span>
          <span className="font-medium">{transport.source.city} to {transport.destination.city}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Amount:</span>
          <span className="font-medium">₹{billing.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Payment Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="COMPLETE" id="payment-complete" />
                          <label htmlFor="payment-complete" className="cursor-pointer">Complete Payment</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="PARTIAL" id="payment-partial" />
                          <label htmlFor="payment-partial" className="cursor-pointer">Partial Payment</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="CHEQUE">Cheque</SelectItem>
                        <SelectItem value="CASH">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          className="pl-9"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          readOnly={!isPartial}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isPartial && (
                <>
                  <FormField
                    control={form.control}
                    name="nextPaymentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Next Payment Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between p-3 bg-secondary/20 rounded-md">
                    <span>Remaining Amount:</span>
                    <span className="font-medium">₹{form.watch("remainingAmount")?.toFixed(2) || "0.00"}</span>
                  </div>
                </>
              )}

              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {paymentMode === "UPI"
                        ? "UPI Transaction ID"
                        : paymentMode === "CHEQUE"
                        ? "Cheque Number"
                        : "Cash Transaction ID"}
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      {paymentMode === "CASH" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={generateCashTransactionId}
                          disabled={isGeneratingTransactionId}
                        >
                          {isGeneratingTransactionId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CreditCard className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Driver</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {driversLoading ? (
                          <SelectItem value="loading" disabled>Loading drivers...</SelectItem>
                        ) : drivers && drivers.length > 0 ? (
                          drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No drivers available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-6 rounded-md border bg-background shadow-sm mt-auto">
                <h4 className="font-medium mb-4">Payment Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Bill Amount:</span>
                    <span>₹{billing.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Amount:</span>
                    <span>₹{form.watch("amount").toFixed(2)}</span>
                  </div>
                  {isPartial && (
                    <div className="flex justify-between">
                      <span>Remaining Amount:</span>
                      <span>₹{form.watch("remainingAmount")?.toFixed(2) || "0.00"}</span>
                    </div>
                  )}
                  {isPartial && form.watch("nextPaymentDate") && (
                    <div className="flex justify-between border-t pt-2">
                      <span>Next Payment Date:</span>
                      <span>{format(form.watch("nextPaymentDate"), "PPP")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Complete Order</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentFormStep;
