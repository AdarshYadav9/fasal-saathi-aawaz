import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkAuthProvider } from "@/contexts/ClerkAuthContext";
import Index from "./pages/Index";
import LanguageTest from "./pages/LanguageTest";
import MarketPricesTest from "./components/MarketPricesTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ClerkAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Index />} />
            <Route path="/advice" element={<Index />} />
            <Route path="/pests" element={<Index />} />
            <Route path="/market" element={<Index />} />
            <Route path="/chat" element={<Index />} />
            <Route path="/language-test" element={<LanguageTest />} />
            <Route path="/market-test" element={<MarketPricesTest />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ClerkAuthProvider>
  </QueryClientProvider>
);

export default App;
