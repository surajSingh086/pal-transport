
// Define the TransportStatus enum
export enum TransportStatus {
  AVAILABLE = "AVAILABLE",
  IN_TRANSIT = "IN_TRANSIT",
  MAINTENANCE = "MAINTENANCE"
}

// Define the Transport interface
export interface Transport {
  id: string;
  name: string;
  type: 'TRUCK' | 'VAN' | 'CAR';
  status: TransportStatus;
  capacity: number;
  location: string;
  imageUrl: string;
  truckNumber: string;
}

// Define the Trip interface
export interface Trip {
  id: string;
  transportId: string;
  driverId: string;
  origin: string;
  destination: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  distance: number;
}

// Export Driver type from driver.ts (only once)
export type { Driver } from "./driver";
