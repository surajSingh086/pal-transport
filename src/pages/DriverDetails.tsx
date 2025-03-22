
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDriverById } from '@/services/driverService';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Star, CarFront, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DriverDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const { data: driver, isLoading, error } = useQuery({
    queryKey: ['driver', id],
    queryFn: () => getDriverById(id || ''),
    enabled: !!id,
  });

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "ON_TRIP":
        return "bg-blue-100 text-blue-800";
      case "OFF_DUTY":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBack = () => {
    navigate('/drivers');
  };

  return (
    <div className="flex h-screen bg-secondary/30">
      {!isMobile && (
        <aside className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0">
          <Sidebar />
        </aside>
      )}
      <div className={cn("flex flex-col flex-1", !isMobile && "md:pl-64")}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Drivers
          </Button>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error || !driver ? (
            <div className="text-center py-12 text-destructive">
              Error loading driver data
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 border">
                  <AvatarImage src={driver.imageUrl} alt={driver.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {driver.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <h1 className="text-3xl font-bold">{driver.name}</h1>
                    <Badge className={cn("w-fit font-normal transition-colors", getStatusColor(driver.status))}>
                      {driver.status}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                    <span className="text-md font-medium">{driver.rating}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Driver Information</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Full Name</p>
                          <p className="font-medium">{driver.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone Number</p>
                          <p className="font-medium">{driver.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CarFront className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Vehicle Type</p>
                          <p className="font-medium capitalize">{driver.vehicleType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 flex items-center justify-center text-muted-foreground">
                          #
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">License Plate</p>
                          <p className="font-medium">{driver.licensePlate}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DriverDetails;
