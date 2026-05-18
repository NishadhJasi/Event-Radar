import { useState } from "react";
import GlowBackground from "../components/ui/GlowBackground";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import TrendingEvents from "../components/home/TrendingEvents";
import FeaturedColleges from "../components/home/FeaturedColleges";
import UpcomingHackathons from "../components/home/UpcomingHackathons";
import StatsSection from "../components/home/StatsSection";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <GlowBackground />
      <Navbar />
      <main>
        <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <TrendingEvents searchQuery={searchQuery} />
        <FeaturedColleges />
        <UpcomingHackathons />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
}
