
import * as z from "zod";

// Define the form schema
export const driverFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  status: z.enum(["AVAILABLE", "ON_TRIP", "OFF_DUTY"]),
  rating: z.coerce.number().min(1).max(5),
  licensePlate: z.string().min(2, { message: "License plate is required" }),
  vehicleType: z.string().min(2, { message: "Vehicle type is required" }),
  phoneNumber: z.string().min(6, { message: "Phone number is required" }),
});

export type DriverFormValues = z.infer<typeof driverFormSchema>;

// Default form values
export const defaultDriverFormValues: DriverFormValues = {
  name: "",
  status: "AVAILABLE",
  rating: 4.5,
  licensePlate: "",
  vehicleType: "TRUCK",
  phoneNumber: "",
};
