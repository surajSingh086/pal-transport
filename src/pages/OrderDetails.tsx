
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/services/orderService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Truck, MapPin, User, Calendar, IndianRupee, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatus } from "@/models/order";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id || ""),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Order Not Found</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Truck className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium text-muted-foreground mb-2">Order not found</h3>
            <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist or has been removed</p>
            <Button onClick={() => navigate("/orders")}>
              View All Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id?.slice(-6)}</h1>
            <p className="text-muted-foreground">
              Client: {order.client.companyName}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
          order.transport.status === OrderStatus.NEW ? "bg-blue-100 text-blue-800" : 
          order.transport.status === OrderStatus.IN_TRANSIT ? "bg-yellow-100 text-yellow-800" : 
          "bg-green-100 text-green-800"
        }`}>
          {order.transport.status}
        </div>
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/clients/${order.client.id}`)}
            >
              View Client Details
            </Button>
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
            {order.transport.truckId && (
              <div className="flex gap-2 pt-2 border-t">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Truck ID: {order.transport.truckId}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate("/orders")}>
          Back to Orders
        </Button>
        <Button>
          Print Invoice
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;
