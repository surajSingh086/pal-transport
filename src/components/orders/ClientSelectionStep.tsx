
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Client } from "@/models/client";
import { User, Plus, Search, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientSelectionStepProps {
  onSelectClient: (client: Client) => void;
  onCreateNew: () => void;
}

const ClientSelectionStep: React.FC<ClientSelectionStepProps> = ({
  onSelectClient,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const filteredClients = React.useMemo(() => {
    if (!clients) return [];
    return clients.filter(
      (client) =>
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Select Client</h3>
        <p className="text-muted-foreground">
          Choose an existing client or create a new one
        </p>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search clients..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" /> New Client
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <Skeleton className="h-10 w-10 rounded-full mr-4" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-9 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card
              key={client.id}
              className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => onSelectClient(client)}
            >
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">{client.companyName}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      {client.contactPersonName}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="rounded-full">
                    Select
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <p className="text-muted-foreground mb-4">No clients found matching your search</p>
            <Button onClick={onCreateNew}>
              <Plus className="mr-2 h-4 w-4" /> Create New Client
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSelectionStep;
