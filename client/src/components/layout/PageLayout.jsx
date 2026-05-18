import Navbar from "./Navbar";
import GlowBackground from "../ui/GlowBackground";

export default function PageLayout({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 ${className}`}>
      <GlowBackground />
      <Navbar />
      <div className="relative pt-24 pb-16 px-4 sm:px-6">{children}</div>
    </div>
  );
}
