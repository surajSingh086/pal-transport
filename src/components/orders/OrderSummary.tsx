
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/models/client";
import { Order, OrderTransport, Payment } from "@/models/order";
import { Check, Truck, MapPin, User, Calendar, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface OrderSummaryProps {
  order: Order;
  onClose: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Order Created Successfully</h3>
        <p className="text-muted-foreground">
          Your order has been created with ID: {order.id}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">{order.client.companyName}</h4>
              <p className="text-sm text-muted-foreground">{order.client.contactEmail}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Contact Person:</span>
                <p>{order.client.contactPersonName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Contact Number:</span>
                <p>{order.client.contactNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transport Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{order.transport.size} transport</span>
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                {order.transport.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">From: {order.transport.source.city}, {order.transport.source.state}</p>
                  <p className="text-xs text-muted-foreground">{order.transport.source.addressLine1}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">To: {order.transport.destination.city}, {order.transport.destination.state}</p>
                  <p className="text-xs text-muted-foreground">{order.transport.destination.addressLine1}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Billing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Distance:</span>
                <span>{order.billing.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span>Rate per km:</span>
                <span>₹{order.billing.ratePerKm.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.billing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST ({order.billing.gstRate}%):</span>
                <span>₹{order.billing.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Total Amount:</span>
                <span>₹{order.billing.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Payment Type:</span>
                <span className="capitalize">{order.payment.paymentType}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="capitalize">{order.payment.paymentMode}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span>₹{order.payment.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-mono text-sm">{order.payment.transactionId}</span>
              </div>
              {order.payment.remainingAmount !== undefined && order.payment.remainingAmount > 0 && (
                <div className="flex justify-between">
                  <span>Remaining Amount:</span>
                  <span>₹{order.payment.remainingAmount.toFixed(2)}</span>
                </div>
              )}
              {order.payment.nextPaymentDate && (
                <div className="flex justify-between">
                  <span>Next Payment Date:</span>
                  <span>{order.payment.nextPaymentDate}</span>
                </div>
              )}
            </div>
            <div className="pt-2 border-t">
              <div className="flex gap-2 items-center">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Assigned Driver: {order.driverId}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/orders")}>
          View Orders
        </Button>
        <Button onClick={() => navigate("/orders/create")}>Create Another Order</Button>
      </div>
    </div>
  );
};

export default OrderSummary;
