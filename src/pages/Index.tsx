
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Redirect to dashboard if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4 md:px-6 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
            PAL-Transport Management System
          </h1>
          <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Streamline your transport operations with our comprehensive fleet and driver management platform
          </p>
        </div>
        <div className="mx-auto max-w-md space-y-4 mt-8">
          <Button 
            size="lg" 
            className="w-full font-semibold"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
          <p className="text-sm text-muted-foreground">
            New to PAL-Transport? Contact your administrator for access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
