
import { Driver } from "../../models/transport";

// Mock data for drivers
const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "John Smith",
    status: "AVAILABLE",
    rating: 4.8,
    licensePlate: "NYC-1234",
    vehicleType: "TRUCK",
    phoneNumber: "212-555-1234",
    imageUrl: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    status: "ON_TRIP",
    rating: 4.9,
    licensePlate: "LA-5678",
    vehicleType: "VAN",
    phoneNumber: "310-555-5678",
    imageUrl: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: "3",
    name: "Michael Chen",
    status: "AVAILABLE",
    rating: 4.7,
    licensePlate: "CHI-9012",
    vehicleType: "CAR",
    phoneNumber: "312-555-9012",
    imageUrl: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    id: "4",
    name: "Jessica Miller",
    status: "OFF_DUTY",
    rating: 4.6,
    licensePlate: "MIA-3456",
    vehicleType: "TRUCK",
    phoneNumber: "305-555-3456",
    imageUrl: "https://randomuser.me/api/portraits/women/4.jpg"
  },
  {
    id: "5",
    name: "David Wilson",
    status: "AVAILABLE",
    rating: 4.9,
    licensePlate: "SEA-7890",
    vehicleType: "VAN",
    phoneNumber: "206-555-7890",
    imageUrl: "https://randomuser.me/api/portraits/men/5.jpg"
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Base API URL
const API_BASE_URL = 'http://localhost:8080/api';

// Driver service methods
export const getDrivers = async (): Promise<Driver[]> => {
  try {
    // Try to fetch from the actual API
    const response = await fetch(`${API_BASE_URL}/drivers`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch drivers from API');
    }
    
    const data = await response.json();
    console.log('Successfully fetched drivers from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching drivers from API, falling back to mock data:', error);
    // If API call fails, use mock data as fallback
    await delay(800);
    return [...mockDrivers];
  }
};

export const getDriverById = async (id: string): Promise<Driver | undefined> => {
  try {
    // Try to fetch from the actual API
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch driver with ID ${id} from API`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched driver with ID ${id} from API:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching driver with ID ${id}, falling back to mock data:`, error);
    // If API call fails, fall back to mock data
    await delay(500);
    return mockDrivers.find(d => d.id === id);
  }
};

// Driver image upload 
export const uploadDriverImage = async (imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('fileName', imageFile);
    
    const response = await fetch(`${API_BASE_URL}/uploads/images/drivers`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload driver image');
    }
    
    const data = await response.json();
    console.log('Successfully uploaded driver image to API:', data);
    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading driver image, falling back to mock URL:', error);
    await delay(800);
    return `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10) + 1}.jpg`;
  }
};

// Create driver
export const createDriver = async (driverData: Omit<Driver, 'id'>): Promise<Driver> => {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create driver');
    }
    
    const data = await response.json();
    console.log('Successfully created driver in API:', data);
    return data;
  } catch (error) {
    console.error('Error creating driver, falling back to mock data:', error);
    await delay(800);
    
    const newDriver: Driver = {
      id: `mock-${Date.now()}`,
      ...driverData
    };
    
    mockDrivers.push(newDriver);
    return newDriver;
  }
};
