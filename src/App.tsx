import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/wedding/Navbar";
import ScrollToTop from "@/components/wedding/ScrollToTop";
import Landing from "./pages/Landing";
import OurStory from "./pages/OurStory";
import Accommodations from "./pages/Accommodations";
import Travel from "./pages/Travel";
import FinerDetails from "./pages/FinerDetails";
import FAQ from "./pages/FAQ";
import Excursions from "./pages/Excursions";
import Reservations from "./pages/Reservations";
import Admin from "./pages/Admin";
import RehearsalDinner from "./pages/RehearsalDinner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="noise-overlay" />
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/accommodations" element={<Accommodations />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/finer-details" element={<FinerDetails />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/excursions" element={<Excursions />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/rehearsal-dinner" element={<RehearsalDinner />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
