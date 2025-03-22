
import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ClientFormStep from "@/components/orders/ClientFormStep";
import { createClient } from "@/services/clientService";
import { ArrowLeft } from "lucide-react";

const CreateClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      const newClient = await createClient(data);
      
      toast({
        title: "Client created",
        description: `${newClient.companyName} has been added successfully.`,
      });
      
      navigate("/clients");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create client. Please try again.",
        variant: "destructive",
      });
    }
  };

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
        <h1 className="text-3xl font-bold">Create New Client</h1>
      </div>

      <div className="bg-background border rounded-lg p-6 shadow-sm">
        <ClientFormStep 
          onSubmit={handleSubmit}
          onBack={() => navigate(-1)}
          isCreateOrderFlow={false} // Explicitly set to false to show "Create Client" button
        />
      </div>
    </div>
  );
};

export default CreateClient;
