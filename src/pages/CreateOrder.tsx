import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Steps } from "@/components/ui/steps";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/services/orderService";
import { createClient } from "@/services/clientService";
import { Client } from "@/models/client";
import { Order, OrderTransport, Payment } from "@/models/order";
import ClientSelectionStep from "@/components/orders/ClientSelectionStep";
import ClientFormStep from "@/components/orders/ClientFormStep";
import TransportFormStep from "@/components/orders/TransportFormStep";
import BillingFormStep from "@/components/orders/BillingFormStep";
import PaymentFormStep from "@/components/orders/PaymentFormStep";
import OrderSummary from "@/components/orders/OrderSummary";
import { ArrowLeft } from "lucide-react";

type StepType = "client-selection" | "client-form" | "transport" | "billing" | "payment" | "completed";

const CreateOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<StepType>("client-selection");
  const [client, setClient] = useState<Client | null>(null);
  const [transport, setTransport] = useState<OrderTransport | null>(null);
  const [billing, setBilling] = useState<any>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSelectClient = (selectedClient: Client) => {
    setClient(selectedClient);
    setCurrentStep("transport");
  };

  const handleCreateNewClient = () => {
    setCurrentStep("client-form");
  };

  const handleClientFormSubmit = async (data: any) => {
    try {
      const newClient = await createClient(data);
      setClient(newClient);
      toast({
        title: "Client created",
        description: `Client ${newClient.companyName} has been created successfully.`,
      });
      setCurrentStep("transport");
    } catch (error) {
      toast({
        title: "Error creating client",
        description: "There was an error creating the client. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTransportFormSubmit = (data: OrderTransport) => {
    setTransport(data);
    setCurrentStep("billing");
  };

  const handleBillingFormSubmit = (data: any) => {
    setBilling(data);
    setCurrentStep("payment");
  };

  const handlePaymentFormSubmit = async (data: { payment: Payment, driverId: string }) => {
    setPayment(data.payment);
    setDriverId(data.driverId);

    try {
      if (!client || !transport || !billing) {
        throw new Error("Missing required order data");
      }

      const orderData: Omit<Order, "id" | "createdAt" | "updatedAt"> = {
        client,
        transport,
        billing,
        payment: data.payment,
        driverId: data.driverId,
      };

      const createdOrder = await createOrder(orderData);
      setOrder(createdOrder);
      
      toast({
        title: "Order created",
        description: "Your order has been created successfully.",
      });

      setCurrentStep("completed");
    } catch (error) {
      toast({
        title: "Error creating order",
        description: "There was an error creating the order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    if (currentStep === "transport") {
      setCurrentStep("client-selection");
    } else if (currentStep === "billing") {
      setCurrentStep("transport");
    } else if (currentStep === "payment") {
      setCurrentStep("billing");
    } else if (currentStep === "client-form") {
      setCurrentStep("client-selection");
    }
  };

  const stepIndex = 
    currentStep === "client-selection" ? 0 : 
    currentStep === "client-form" ? 0 :
    currentStep === "transport" ? 1 : 
    currentStep === "billing" ? 2 : 
    currentStep === "payment" ? 3 : 
    currentStep === "completed" ? 4 : 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <h1 className="text-3xl font-bold">Create Order</h1>
      </div>

      {currentStep !== "completed" && (
        <Steps 
          steps={["Client", "Transport", "Billing", "Payment", "Completed"]} 
          currentStep={stepIndex} 
        />
      )}

      <div className="bg-background border rounded-lg p-6 shadow-sm">
        {currentStep === "client-selection" && (
          <ClientSelectionStep 
            onSelectClient={handleSelectClient} 
            onCreateNew={handleCreateNewClient} 
          />
        )}

        {currentStep === "client-form" && (
          <ClientFormStep 
            onSubmit={handleClientFormSubmit} 
            onBack={handleBack}
            isCreateOrderFlow={true}
          />
        )}

        {currentStep === "transport" && client && (
          <TransportFormStep 
            client={client} 
            onSubmit={handleTransportFormSubmit} 
            onBack={handleBack}
          />
        )}

        {currentStep === "billing" && client && transport && (
          <BillingFormStep 
            client={client} 
            transport={transport} 
            onSubmit={handleBillingFormSubmit} 
            onBack={handleBack}
          />
        )}

        {currentStep === "payment" && client && transport && billing && (
          <PaymentFormStep 
            client={client} 
            transport={transport} 
            billing={billing} 
            onSubmit={handlePaymentFormSubmit} 
            onBack={handleBack}
          />
        )}

        {currentStep === "completed" && order && (
          <OrderSummary 
            order={order} 
            onClose={() => navigate("/orders")} 
          />
        )}
      </div>
    </div>
  );
};

export default CreateOrder;
