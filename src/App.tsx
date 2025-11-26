import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Commandes from "./pages/Commandes";
import Livraisons from "./pages/Livraisons";
import Articles from "./pages/Articles";
import Clients from "./pages/Clients";
import Personnel from "./pages/Personnel";
import Postes from "./pages/Postes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/commandes" element={<Commandes />} />
          <Route path="/livraisons" element={<Livraisons />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/postes" element={<Postes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
