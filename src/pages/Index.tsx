import Hero from "@/components/wedding/Hero";
import CalendarSection from "@/components/wedding/CalendarSection";
import OrnamentDivider from "@/components/wedding/OrnamentDivider";
import FlightsSection from "@/components/wedding/FlightsSection";
import GroundTransport from "@/components/wedding/GroundTransport";
import BookSection from "@/components/wedding/BookSection";
import Footer from "@/components/wedding/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="noise-overlay" />
      <Hero />
      <CalendarSection />
      <OrnamentDivider />
      <FlightsSection />
      <OrnamentDivider />
      <GroundTransport />
      <OrnamentDivider />
      <BookSection />
      <Footer />
    </div>
  );
};

export default Index;
