
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Client, Address, AddressType } from "@/models/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, ArrowRight } from "lucide-react";

const clientFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactEmail: z.string().email("Invalid email address"),
  contactPersonName: z.string().min(2, "Contact name must be at least 2 characters"),
  contactNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  alternateContact: z.string()
    .regex(/^[0-9]*$/, "Phone number must contain only digits")
    .max(15, "Phone number must not exceed 15 digits")
    .optional()
    .or(z.literal('')),
  gstNumber: z.string()
    .regex(/^[0-9A-Z]{15}$/, "GST number must be 15 characters alphanumeric")
    .optional()
    .or(z.literal('')),
  addresses: z.array(
    z.object({
      addressLine1: z.string().min(3, "Address line 1 is required"),
      addressLine2: z.string().optional().or(z.literal('')),
      addressLine3: z.string().optional().or(z.literal('')),
      city: z.string().min(2, "City is required"),
      state: z.string().min(2, "State is required"),
      pinCode: z.string()
        .min(6, "PIN code must be at least 6 characters")
        .max(10, "PIN code must not exceed 10 characters"),
      country: z.string().min(2, "Country is required"),
      addressType: z.enum(["OFFICE", "BILLING", "TRANSPORT", "DRIVER"])
    })
  ).min(1, "At least one address is required")
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

// Function to transform Client model to form values
const clientToFormValues = (client: Client): ClientFormValues => {
  return {
    ...client,
    addresses: client.addresses.map(addr => ({
      ...addr,
      addressType: addr.addressType
    }))
  };
};

interface ClientFormStepProps {
  initialClient?: Client;
  onSubmit: (data: ClientFormValues) => void;
  onBack: () => void;
  isCreateOrderFlow?: boolean;
}

const ClientFormStep: React.FC<ClientFormStepProps> = ({
  initialClient,
  onSubmit,
  onBack,
  isCreateOrderFlow = false,
}) => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialClient 
      ? clientToFormValues(initialClient)
      : {
          companyName: "",
          contactEmail: "",
          contactPersonName: "",
          contactNumber: "",
          alternateContact: "",
          gstNumber: "",
          addresses: [
            {
              addressLine1: "",
              addressLine2: "",
              addressLine3: "",
              city: "",
              state: "",
              pinCode: "",
              country: "India",
              addressType: "OFFICE"
            }
          ]
        }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addresses"
  });

  const addAddress = () => {
    append({
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
      addressType: "OFFICE"
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">
          {initialClient ? "Edit Client" : "New Client"}
        </h3>
        <p className="text-muted-foreground">
          Enter client details and address information
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPersonName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact person name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alternateContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter alternate contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gstNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter GST number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium">Addresses</h4>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addAddress}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Address
              </Button>
            </div>

            {fields.map((field, index) => (
              <div 
                key={field.id} 
                className="border rounded-md p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">Address {index + 1}</h5>
                  {fields.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`addresses.${index}.addressType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Type*</FormLabel>
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
                            <SelectItem value="OFFICE">Office</SelectItem>
                            <SelectItem value="BILLING">Billing</SelectItem>
                            <SelectItem value="TRANSPORT">Transport</SelectItem>
                            <SelectItem value="DRIVER">Driver</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`addresses.${index}.addressLine1`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`addresses.${index}.addressLine2`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`addresses.${index}.addressLine3`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 3</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`addresses.${index}.city`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`addresses.${index}.state`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`addresses.${index}.pinCode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PIN Code*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`addresses.${index}.country`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country*</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">
              {isCreateOrderFlow ? (
                <>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Create Client
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ClientFormStep;
