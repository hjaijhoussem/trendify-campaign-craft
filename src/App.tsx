import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductAdd from "./pages/ProductAdd";
import ProductAddManual from "./pages/ProductAddManual";
import ProductAddCsv from "./pages/ProductAddCsv";
import ProductAddUrl from "./pages/ProductAddUrl";
import Trends from "./pages/Trends";
import Campaigns from "./pages/Campaigns";
import CampaignGenerator from "./pages/CampaignGenerator";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/add" element={<ProductAdd />} />
                <Route path="/products/add/manual" element={<ProductAddManual />} />
                <Route path="/products/add/csv" element={<ProductAddCsv />} />
                <Route path="/products/add/url" element={<ProductAddUrl />} />
                <Route path="/trends" element={<Trends />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/campaign-generator" element={<CampaignGenerator />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
