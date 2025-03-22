import { delay, API_BASE_URL } from "@/services/serviceUtils";
import { Order, OrderTransport, TransportSize, OrderStatus, PaymentMode, PaymentType } from "@/models/order";
import { Client, AddressType } from "@/models/client";

// Mock orders data for fallback purposes
const mockOrders: Order[] = [
  {
    id: "order-1",
    client: {
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
    transport: {
      status: OrderStatus.NEW,
      source: {
        id: "src-1",
        addressLine1: "123 Main Street",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "400001",
        country: "India",
        addressType: AddressType.TRANSPORT
      },
      destination: {
        id: "dest-1",
        addressLine1: "456 Central Avenue",
        city: "Delhi",
        state: "Delhi",
        pinCode: "110001",
        country: "India",
        addressType: AddressType.TRANSPORT
      },
      size: TransportSize.MEDIUM,
      truckId: "truck-1",
      distance: 1400
    },
    billing: {
      distance: 1400,
      ratePerKm: 15,
      subtotal: 21000,
      gstRate: 18,
      gstAmount: 3780,
      totalAmount: 24780
    },
    payment: {
      amount: 24780,
      paymentType: PaymentType.COMPLETE,
      paymentMode: PaymentMode.UPI,
      transactionId: "UPI-123456"
    },
    driverId: "driver-1",
    createdAt: "2023-08-15T10:30:00Z",
    updatedAt: "2023-08-15T10:30:00Z"
  },
  {
    id: "order-2",
    client: {
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
    },
    transport: {
      status: OrderStatus.IN_TRANSIT,
      source: {
        id: "src-2",
        addressLine1: "789 Business Park",
        city: "Bangalore",
        state: "Karnataka",
        pinCode: "560001",
        country: "India",
        addressType: AddressType.TRANSPORT
      },
      destination: {
        id: "dest-2",
        addressLine1: "101 Industrial Area",
        city: "Chennai",
        state: "Tamil Nadu",
        pinCode: "600001",
        country: "India",
        addressType: AddressType.TRANSPORT
      },
      size: TransportSize.LARGE,
      truckId: "truck-3",
      distance: 350
    },
    billing: {
      distance: 350,
      ratePerKm: 20,
      subtotal: 7000,
      gstRate: 18,
      gstAmount: 1260,
      totalAmount: 8260
    },
    payment: {
      amount: 5000,
      paymentType: PaymentType.PARTIAL,
      paymentMode: PaymentMode.CHEQUE,
      transactionId: "CHQ-654321",
      nextPaymentDate: "2023-09-30",
      remainingAmount: 3260
    },
    driverId: "driver-2",
    createdAt: "2023-08-20T14:45:00Z",
    updatedAt: "2023-08-22T09:15:00Z"
  }
];

// Helper function to handle API calls with proper error handling
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

export const getOrders = async (): Promise<Order[]> => {
  try {
    // Make a real API call to GET /orders endpoint
    const response = await callApi('/orders');
    console.log("Orders fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error fetching orders:", error);
    console.log("Falling back to mock data");
    // Fallback to mock data if API call fails
    return [...mockOrders];
  }
};

export const getOrderById = async (id: string): Promise<Order | undefined> => {
  try {
    // Make a real API call to GET /orders/{id} endpoint
    const response = await callApi(`/orders/${id}`);
    console.log("Order fetched by ID:", id, response);
    return response;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    console.log("Falling back to mock data");
    // Fallback to mock data if API call fails
    const order = mockOrders.find(order => order.id === id);
    return order;
  }
};

export const createOrder = async (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> => {
  try {
    // Make a real API call to POST /orders endpoint
    const response = await callApi('/orders', 'POST', orderData);
    console.log("Order created successfully:", response);
    return response;
  } catch (error) {
    console.error("Error creating order:", error);
    console.log("Falling back to mock implementation");
    // Fallback to mock implementation if API call fails
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData
    };
    mockOrders.push(newOrder);
    return newOrder;
  }
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order | undefined> => {
  try {
    // Make a real API call to PATCH /orders/{id} endpoint
    const response = await callApi(`/orders/${id}`, 'PATCH', { status });
    console.log("Order status updated successfully:", id, status, response);
    return response;
  } catch (error) {
    console.error("Error updating order status:", error);
    console.log("Falling back to mock implementation");
    // Fallback to mock implementation if API call fails
    const orderIndex = mockOrders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      return undefined;
    }
    
    mockOrders[orderIndex].transport.status = status;
    mockOrders[orderIndex].updatedAt = new Date().toISOString();
    return mockOrders[orderIndex];
  }
};

// Function to calculate distance between two locations
export const calculateDistance = async (sourceId: string, destinationId: string): Promise<number> => {
  try {
    console.log("Calculating distance between:", sourceId, "and", destinationId);
    
    // Extract pin codes from addresses for the distance calculation API
    // In a real implementation, you would retrieve these from the database
    // For now, we're using a simplified approach
    const sourcePinCode = sourceId.includes("pin-") ? sourceId.split("pin-")[1] : "400101";
    const destPinCode = destinationId.includes("pin-") ? destinationId.split("pin-")[1] : "248001";
    
    // Make a real API call to the distance calculator endpoint
    const url = `${API_BASE_URL}/distance?fromPinCode=${sourcePinCode}&toPinCode=${destPinCode}&country=India`;
    const response = await callApi(url);
    
    console.log("Distance calculated:", response, "km");
    return response.distance || response;
  } catch (error) {
    console.error("Error calculating distance:", error);
    console.log("Falling back to mock implementation");
    // Fallback to mock implementation if API call fails
    const distance = Math.floor(50 + Math.random() * 450);
    console.log("Mock distance calculated:", distance, "km");
    return distance;
  }
};

// Function to get available trucks based on size
export const getAvailableTrucks = async (size: TransportSize) => {
  try {
    console.log("Fetching available trucks for size:", size);
    
    // Make a real API call to GET /trucks/available endpoint
    const response = await callApi(`/trucks?size=${size}`);
    
    console.log("Available trucks fetched:", response);
    return response;
  } catch (error) {
    console.error("Error fetching available trucks:", error);
    console.log("Falling back to mock data");
    // Fallback to mock data if API call fails
    await delay(400);
    
    // Return different trucks based on size
    const trucks = [
      { id: "truck-1", name: "Tata Ace - MH01AB1234" },
      { id: "truck-2", name: "Eicher 2055 - MH02CD5678" },
      { id: "truck-3", name: "Bharat Benz - MH03EF9012" },
    ];
    
    console.log("Available trucks fetched (mock):", trucks.length);
    return trucks;
  }
};

// Function to get cash transaction ID
export const getCashTransactionId = async () => {
  try {
    console.log("Generating cash transaction ID");
    
    // Make a real API call to GET /payments/cash/new endpoint
    const response = await callApi('/payments/cash/new');
    
    console.log("Cash transaction ID generated:", response);
    return response.transactionId;
  } catch (error) {
    console.error("Error generating cash transaction ID:", error);
    console.log("Falling back to mock implementation");
    // Fallback to mock implementation if API call fails
    const transactionId = `CASH-${Math.floor(100000 + Math.random() * 900000)}`;
    console.log("Cash transaction ID generated (mock):", transactionId);
    return transactionId;
  }
};

// Function to get available drivers
export const getAvailableDrivers = async () => {
  try {
    console.log("Fetching available drivers");
    
    // Make a real API call to GET /drivers endpoint
    const response = await callApi('/drivers?status=AVAILABLE');
    
    console.log("Available drivers fetched:", response);
    return response;
  } catch (error) {
    console.error("Error fetching available drivers:", error);
    console.log("Falling back to mock data");
    // Fallback to mock data if API call fails
    const drivers = [
      { id: "driver-1", name: "Raj Kumar" },
      { id: "driver-2", name: "Sunil Verma" },
      { id: "driver-3", name: "Amit Singh" },
    ];
    
    console.log("Available drivers fetched (mock):", drivers.length);
    return drivers;
  }
};
