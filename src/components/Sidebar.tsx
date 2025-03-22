
import React from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Car, Home, Users, Calendar, Clock, Settings, FileBarChart, Package, Building } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <Home className="h-4 w-4" /> },
  { name: "Vehicles", path: "/vehicles", icon: <Car className="h-4 w-4" /> },
  { name: "Drivers", path: "/drivers", icon: <Users className="h-4 w-4" /> },
  { name: "Clients", path: "/clients", icon: <Building className="h-4 w-4" /> },
  { name: "Orders", path: "/orders", icon: <Package className="h-4 w-4" /> },
  { name: "Trips", path: "/trips", icon: <Calendar className="h-4 w-4" /> },
  { name: "History", path: "/history", icon: <Clock className="h-4 w-4" /> },
  { name: "Reports", path: "/reports", icon: <FileBarChart className="h-4 w-4" /> },
  { name: "Settings", path: "/settings", icon: <Settings className="h-4 w-4" /> },
];

export function Sidebar() {
  return (
    <div className="w-full h-full max-w-xs flex flex-col bg-background border-r">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="font-semibold text-lg">PAL-Transport</span>
      </div>
      <div className="flex-1 overflow-auto py-4 px-4">
        <nav className="grid gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
        <Separator className="my-4" />
        <div className="rounded-md bg-secondary/50 p-4">
          <div className="mb-2 text-sm font-semibold">Need help?</div>
          <p className="mb-4 text-xs text-muted-foreground">
            Contact our support team for assistance with your transportation management.
          </p>
          <Button size="sm" variant="outline" className="w-full">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
