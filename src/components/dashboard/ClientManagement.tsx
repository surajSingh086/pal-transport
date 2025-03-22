
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Plus, User } from "lucide-react";
import { getClients } from "@/services/clientService";
import { Skeleton } from "@/components/ui/skeleton";

const ClientManagement = () => {
  const navigate = useNavigate();
  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Recent Clients</CardTitle>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => navigate("/clients/create")}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Client
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : clients && clients.length > 0 ? (
            clients.slice(0, 4).map((client) => (
              <div key={client.id} className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="font-medium text-sm">{client.companyName}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <User className="h-3 w-3 mr-1" />
                    {client.contactPersonName}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  View
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No clients found
            </div>
          )}
        </div>
        {clients && clients.length > 4 && (
          <Button 
            variant="link" 
            className="mt-2 w-full" 
            onClick={() => navigate("/clients")}
          >
            View all clients
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientManagement;
