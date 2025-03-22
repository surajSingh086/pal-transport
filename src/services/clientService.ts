
import { Client, Address, AddressType } from "@/models/client";
import { delay, API_BASE_URL } from "@/services/serviceUtils";

// Mock data for clients will be used as fallback if API calls fail
const mockClients: Client[] = [
  {
    id: "client-1",
    companyName: "ABC Logistics",
    contactPersonName: "John Doe",
    contactEmail: "john@abclogistics.com",
    contactNumber: "9876543210",
    addresses: [
      {
        id: "addr-1",
        addressLine1: "123 Main Street",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "400001",
        country: "India",
        addressType: AddressType.OFFICE
      }
    ]
  },
  {
    id: "client-2",
    companyName: "XYZ Transport",
    contactPersonName: "Jane Smith",
    contactEmail: "jane@xyztransport.com",
    contactNumber: "8765432109",
    addresses: [
      {
        id: "addr-2",
        addressLine1: "789 Business Park",
        city: "Bangalore",
        state: "Karnataka",
        pinCode: "560001",
        country: "India",
        addressType: AddressType.OFFICE
      }
    ]
  }
];

// Helper function to handle API calls
const callApi = async (endpoint: string, method: string = 'GET', data?: any) => {
  try {
    console.log(`Making ${method} request to ${endpoint}`, data);
    
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    // Check if the response has content before parsing as JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error(`API error for ${endpoint}:`, error);
    throw error;
  }
};

export const getClients = async (): Promise<Client[]> => {
  try {
    // Make a real API call to GET /clients endpoint
    const response = await callApi('/clients');
    console.log("Clients fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error fetching clients:", error);
    console.log("Falling back to mock data");
    // Fallback to mock data if API call fails
    return [...mockClients];
  }
};

export const getClientById = async (id: string): Promise<Client> => {
  try {
    // Make a real API call to GET /clients/{id} endpoint
    const response = await callApi(`/clients/${id}`);
    console.log("Client fetched by ID:", id, response);
    return response;
  } catch (error) {
    console.error("Error fetching client by ID:", error);
    console.log("Falling back to mock data");
    // Fallback to mock data if API call fails
    const client = mockClients.find(c => c.id === id);
    if (!client) {
      throw new Error('Client not found');
    }
    return { ...client };
  }
};

export const createClient = async (client: Omit<Client, "id">): Promise<Client> => {
  try {
    // Make a real API call to POST /clients endpoint
    const response = await callApi('/clients', 'POST', client);
    console.log("Client created successfully:", response);
    return response;
  } catch (error) {
    console.error("Error creating client:", error);
    console.log("Falling back to mock implementation");
    // Fallback to mock implementation if API call fails
    
    // Ensure each address has an ID
    const addressesWithIds = client.addresses.map(address => ({
      ...address,
      id: address.id || `addr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }));
    
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}`,
      addresses: addressesWithIds
    };
    
    mockClients.push(newClient);
    return { ...newClient };
  }
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  try {
    // Make a real API call to PUT /clients/{id} endpoint
    const response = await callApi(`/clients/${id}`, 'PUT', client);
    console.log("Client updated successfully:", id, response);
    return response;
  } catch (error) {
    console.error("Error updating client:", error);
    console.log("Falling back to mock implementation");
    // Fallback to mock implementation if API call fails
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Client not found');
    }
    
    // If addresses are being updated, ensure each has an ID
    let updatedAddresses: Address[] | undefined;
    if (client.addresses) {
      updatedAddresses = client.addresses.map(address => ({
        ...address,
        id: address.id || `addr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      }));
    }
    
    const updatedClient: Client = {
      ...mockClients[index],
      ...client,
      addresses: updatedAddresses || mockClients[index].addresses
    };
    
    mockClients[index] = updatedClient;
    return { ...updatedClient };
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    // Make a real API call to DELETE /clients/{id} endpoint
    await callApi(`/clients/${id}`, 'DELETE');
    console.log("Client deleted successfully:", id);
  } catch (error) {
    console.error("Error deleting client:", error);
    console.log("Falling back to mock implementation");
    // Fallback to mock implementation if API call fails
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Client not found');
    }
    mockClients.splice(index, 1);
  }
};
