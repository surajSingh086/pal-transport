
import { Trip } from "../../models/transport";

// Mock data for trips
const mockTrips: Trip[] = [
  {
    id: "1",
    transportId: "2",
    driverId: "2",
    origin: "Los Angeles",
    destination: "San Francisco",
    startTime: "2023-11-01T08:00:00Z",
    endTime: "2023-11-01T16:00:00Z",
    status: "IN_PROGRESS",
    distance: 382
  },
  {
    id: "2",
    transportId: "1",
    driverId: "1",
    origin: "New York",
    destination: "Boston",
    startTime: "2023-11-02T09:00:00Z",
    endTime: "2023-11-02T14:00:00Z",
    status: "SCHEDULED",
    distance: 215
  },
  {
    id: "3",
    transportId: "3",
    driverId: "3",
    origin: "Chicago",
    destination: "Detroit",
    startTime: "2023-10-28T10:00:00Z",
    endTime: "2023-10-28T14:30:00Z",
    status: "COMPLETED",
    distance: 283
  },
  {
    id: "4",
    transportId: "5",
    driverId: "5",
    origin: "Seattle",
    destination: "Portland",
    startTime: "2023-11-03T07:30:00Z",
    endTime: "2023-11-03T10:30:00Z",
    status: "SCHEDULED",
    distance: 174
  },
  {
    id: "5",
    transportId: "4",
    driverId: "4",
    origin: "Miami",
    destination: "Orlando",
    startTime: "2023-10-30T08:00:00Z",
    endTime: "2023-10-30T12:00:00Z",
    status: "CANCELLED",
    distance: 235
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Trip service methods
export const getTrips = async (): Promise<Trip[]> => {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch('https://your-api.com/trips');
  // if (!response.ok) throw new Error('Failed to fetch trips');
  // return await response.json();
  
  await delay(800);
  return [...mockTrips];
};

export const getTripById = async (id: string): Promise<Trip | undefined> => {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch(`https://your-api.com/trips/${id}`);
  // if (!response.ok) throw new Error('Failed to fetch trip');
  // return await response.json();
  
  await delay(500);
  return mockTrips.find(t => t.id === id);
};

export const getTransportTrips = async (transportId: string): Promise<Trip[]> => {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch(`https://your-api.com/transports/${transportId}/trips`);
  // if (!response.ok) throw new Error('Failed to fetch transport trips');
  // return await response.json();
  
  await delay(600);
  return mockTrips.filter(t => t.transportId === transportId);
};

export const getDriverTrips = async (driverId: string): Promise<Trip[]> => {
  // TODO: Replace with actual API call
  // Example:
  // const response = await fetch(`https://your-api.com/drivers/${driverId}/trips`);
  // if (!response.ok) throw new Error('Failed to fetch driver trips');
  // return await response.json();
  
  await delay(600);
  return mockTrips.filter(t => t.driverId === driverId);
};
