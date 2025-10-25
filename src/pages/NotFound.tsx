import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-forest-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-medium bg-white/90 backdrop-blur-sm border-0">
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-field rounded-full flex items-center justify-center shadow-medium mb-6">
            <div className="text-3xl">🌾</div>
          </div>
          
          <h1 className="text-6xl font-poppins font-bold text-forest-500 mb-4">404</h1>
          <h2 className="text-2xl font-poppins font-semibold text-foreground mb-2">
            Page Not Found
          </h2>
          <p className="text-muted-foreground font-inter mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full bg-gradient-field text-white font-poppins font-semibold hover:shadow-medium transition-all duration-300">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Link>
            </Button>
            
            <Button variant="outline" onClick={() => window.history.back()} className="w-full font-inter">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
