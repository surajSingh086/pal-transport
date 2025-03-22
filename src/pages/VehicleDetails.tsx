
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!user) return null;

  const handleBack = () => {
    navigate('/vehicles');
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
            Back to Vehicles
          </Button>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Vehicle Details: {id}</h1>
            <p className="text-muted-foreground">
              This page is under construction. Vehicle details will be shown here.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VehicleDetails;
