
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Building, User, MapPin, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Clients = () => {
  const navigate = useNavigate();
  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={() => navigate("/clients/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Show skeletons while loading
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="relative">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Skeleton className="h-10 w-10 rounded-full mr-4" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="border-t p-4">
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : clients?.length ? (
          clients.map((client) => (
            <Card key={client.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate(`/clients/${client.id}`)}>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{client.companyName}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        {client.contactPersonName}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{client.contactNumber}</span>
                    </div>
                    {client.addresses.length > 0 && (
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <span>
                          {client.addresses[0].city}, {client.addresses[0].state}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t p-4 flex justify-end">
                  <Button size="sm" variant="ghost">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center bg-muted/30 rounded-lg py-12">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium text-muted-foreground mb-2">No clients yet</h3>
            <p className="text-muted-foreground mb-4">Add your first client to get started</p>
            <Button onClick={() => navigate("/clients/create")}>
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
