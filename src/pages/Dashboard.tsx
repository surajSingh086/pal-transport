
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import VehicleStatus from "@/components/dashboard/VehicleStatus";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import UpcomingTrips from "@/components/dashboard/UpcomingTrips";
import ClientManagement from "@/components/dashboard/ClientManagement";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!user) return null;

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
          <div className="flex flex-col space-y-2 py-1">
            <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your transport operations today.
            </p>
          </div>
          
          <div className="space-y-6 mt-6">
            <DashboardOverview />
            
            <div className="grid gap-6 md:grid-cols-2">
              <VehicleStatus />
              <UpcomingTrips />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <ClientManagement />
              <ActivityFeed />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
