
import { Address, Client } from "./client";
import { Driver } from "./driver";
import { Transport } from "./transport";

export enum OrderStatus {
  NEW = "NEW",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED"
}

export enum TransportSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE"
}

export enum PaymentMode {
  UPI = "UPI",
  CHEQUE = "CHEQUE",
  CASH = "CASH"
}

export enum PaymentType {
  COMPLETE = "COMPLETE",
  PARTIAL = "PARTIAL"
}

export interface OrderTransport {
  id?: string;
  status: OrderStatus;
  source: Address;
  destination: Address;
  size: TransportSize;
  truckId?: string;
  distance?: number;
}

export interface Payment {
  id?: string;
  amount: number;
  paymentType: PaymentType;
  paymentMode: PaymentMode;
  transactionId: string;
  nextPaymentDate?: string;
  remainingAmount?: number;
}

export interface Order {
  id?: string;
  order: {
    id: string;
    orderDate?: string;
    orderStatus?: string;
    clientId?: number;
    status?: Order;
    transportId?: number;
    driverId?: number;
    billId?: number;
    paymentId?: number;
  },
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
  payment: Payment;
  driverId?: string;
  createdAt?: string;
  updatedAt?: string;
}
