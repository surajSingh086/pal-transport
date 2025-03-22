
import { Transport, TransportStatus } from "../../models/transport";

// Mock data for transports (to be used as fallback)
const mockTransports: Transport[] = [
  {
    id: "1",
    name: "Truck Alpha",
    type: "TRUCK",
    status: TransportStatus.AVAILABLE,
    capacity: 5000,
    location: "New York",
    imageUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2370&auto=format&fit=crop",
    truckNumber: "TK-001"
  },
  {
    id: "2",
    name: "Delivery Van 1",
    type: "VAN",
    status: TransportStatus.IN_TRANSIT,
    capacity: 1500,
    location: "Los Angeles",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2370&auto=format&fit=crop",
    truckNumber: "VN-001"
  },
  {
    id: "3",
    name: "Courier Car",
    type: "CAR",
    status: TransportStatus.AVAILABLE,
    capacity: 500,
    location: "Chicago",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2370&auto=format&fit=crop",
    truckNumber: "CR-001"
  },
  {
    id: "4",
    name: "Heavy Loader",
    type: "TRUCK",
    status: TransportStatus.MAINTENANCE,
    capacity: 8000,
    location: "Miami",
    imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2370&auto=format&fit=crop",
    truckNumber: "TK-002"
  },
  {
    id: "5",
    name: "Express Delivery",
    type: "VAN",
    status: TransportStatus.AVAILABLE,
    capacity: 1200,
    location: "Seattle",
    imageUrl: "https://images.unsplash.com/photo-1566207474742-0fa4adffcced?q=80&w=2369&auto=format&fit=crop",
    truckNumber: "VN-002"
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Base API URL - would be better in an environment variable
const API_BASE_URL = 'http://localhost:8080/api';

// Transport service methods
export const getTransports = async (): Promise<Transport[]> => {
  try {
    // First try to fetch from the actual API
    const response = await fetch(`${API_BASE_URL}/trucks`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch transports from API');
    }
    
    const data = await response.json();
    console.log('Successfully fetched transports from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching transports from API, falling back to mock data:', error);
    // If API call fails, use mock data as fallback
    await delay(500); // Simulate network request
    return [...mockTransports];
  }
};

export const getTransportById = async (id: string): Promise<Transport | undefined> => {
  try {
    // First try to fetch from the actual API
    const response = await fetch(`${API_BASE_URL}/trucks/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch transport with ID ${id} from API`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched transport with ID ${id} from API:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching transport with ID ${id}, falling back to mock data:`, error);
    // If API call fails, fall back to mock data
    await delay(500); // Simulate network request
    return mockTransports.find(t => t.id === id);
  }
};

// Vehicle image upload with updated URL
export const uploadVehicleImage = async (imageFile: File): Promise<string> => {
  try {
    // Updated URL for truck image uploads
    const formData = new FormData();
    formData.append('fileName', imageFile); // Keep parameter name as is
    
    const response = await fetch(`${API_BASE_URL}/uploads/images/trucks`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await response.json();
    console.log('Successfully uploaded image to API:', data);
    return data.imageUrl; // Return the image URL from the API response
  } catch (error) {
    console.error('Error uploading vehicle image, falling back to mock data:', error);
    // If API call fails, simulate successful upload with mock data
    await delay(800); // Simulate upload time
    return `https://images.unsplash.com/photo-${Date.now()}-${imageFile.name.substring(0, 8)}?auto=format&fit=crop`;
  }
};

// Vehicle creation - using the imageUrl received from the upload API
export const createVehicle = async (vehicleData: Omit<Transport, 'id'>): Promise<Transport> => {
  try {
    // Always attempt to create vehicle in the real API
    const response = await fetch(`${API_BASE_URL}/trucks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create vehicle');
    }
    
    const data = await response.json();
    console.log('Successfully created vehicle in API:', data);
    return data;
  } catch (error) {
    console.error('Error creating vehicle, falling back to mock data:', error);
    // If API call fails, simulate successful creation with mock data
    await delay(800); // Simulate creation time
    
    // Create a new mock transport with an ID
    const newTransport: Transport = {
      id: `mock-${Date.now()}`,
      ...vehicleData
    };
    
    // Add to mock data for future reference
    mockTransports.push(newTransport);
    
    return newTransport;
  }
};
