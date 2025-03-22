
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus, Truck, User } from "lucide-react";
import { Order, OrderStatus } from "@/models/order";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders
  });

  React.useEffect(() => {
    if (error) {
      console.error("Error in orders query:", error);
      toast({
        title: "Error loading orders",
        description: "There was a problem fetching orders. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button onClick={() => navigate("/orders/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Show skeletons while loading
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="relative">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : orders?.length ? (
          orders.map((order: Order) => (
            <Card key={order.id} className="shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{order.client.companyName}</CardTitle>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.transport.status === OrderStatus.NEW ? "bg-blue-100 text-blue-800" : 
                    order.transport.status === OrderStatus.IN_TRANSIT ? "bg-yellow-100 text-yellow-800" : 
                    "bg-green-100 text-green-800"
                  }`}>
                    {order.transport.status}
                  </div>
                </div>
                <CardDescription>Order #{order.id?.slice(-6)}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 pb-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>{order.client.contactPersonName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>
                    {order.transport.source.city} to {order.transport.destination.city}
                  </span>
                </div>
                <div className="text-sm font-medium mt-2">
                  Total Amount: ₹{order.billing.totalAmount.toLocaleString('en-IN')}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" onClick={() => navigate(`/orders/${order.id}`)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center bg-muted/30 rounded-lg py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium text-muted-foreground mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">Create your first order to get started</p>
            <Button onClick={() => navigate("/orders/create")}>
              <Plus className="mr-2 h-4 w-4" /> Create Order
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
