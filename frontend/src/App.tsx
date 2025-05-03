
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context Providers
import { AuthProvider } from "@/context/AuthContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { MarketProvider } from "@/context/MarketContext";

// Layouts
import MainLayout from "@/components/layout/MainLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import PortfoliosList from "./pages/Portfolios/PortfoliosList";
import PortfolioDetail from "./pages/Portfolios/PortfolioDetail";
import PortfolioCreate from "./pages/Portfolios/PortfolioCreate";
import MarketOverview from "./pages/Market/MarketOverview";
import AssetDetail from "./pages/Market/AssetDetail";
import TransactionsList from "./pages/Transactions/TransactionsList";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PortfolioProvider>
        <MarketProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <MainLayout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Portfolio Routes */}
                  <Route path="/portfolios" element={<PortfoliosList />} />
                  <Route path="/portfolios/:id" element={<PortfolioDetail />} />
                  <Route path="/portfolios/create" element={<PortfolioCreate />} />
                  
                  {/* Market Routes */}
                  <Route path="/market" element={<MarketOverview />} />
                  <Route path="/market/:ticker" element={<AssetDetail />} />
                  
                  {/* Transaction Routes */}
                  <Route path="/transactions" element={<TransactionsList />} />
                  
                  {/* Settings */}
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* Redirect /dashboard to / for authenticated users */}
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  
                  {/* Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </BrowserRouter>
          </TooltipProvider>
        </MarketProvider>
      </PortfolioProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
