
import { LoginCredentials, AuthResponse, User } from "../models/user";

// Mock user data
// TODO: Replace with actual backend API authentication
// This is just for development/testing purposes
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password123",
    name: "Admin User",
    role: "admin" as const
  },
  {
    id: "2",
    email: "user@example.com",
    password: "password123",
    name: "Regular User",
    role: "user" as const
  }
];

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // TODO: Replace with actual API call to your authentication endpoint
  // Example:
  // const response = await fetch('https://your-api.com/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(credentials)
  // });
  // if (!response.ok) throw new Error('Invalid credentials');
  // return await response.json();
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = mockUsers.find(u => 
    u.email === credentials.email && u.password === credentials.password
  );
  
  if (!user) {
    throw new Error("Invalid credentials");
  }
  
  // Generate a mock token
  const token = `mock-jwt-token-${Date.now()}`;
  
  // Return the user without the password and with the token
  const { password, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token
  };
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error("Error parsing user from localStorage:", e);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token") && !!getCurrentUser();
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const setAuthData = (authResponse: AuthResponse): void => {
  localStorage.setItem("token", authResponse.token);
  localStorage.setItem("user", JSON.stringify(authResponse.user));
};
