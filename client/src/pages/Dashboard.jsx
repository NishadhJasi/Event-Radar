import { useNavigate } from "react-router-dom";
import GlowBackground from "../components/ui/GlowBackground";
import Button from "../components/ui/Button";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      <GlowBackground />
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-10 max-w-lg w-full text-center border border-white/10 shadow-2xl">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-2xl mb-6">
            🚀
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Event Radar <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-slate-400 mb-8">
            You&apos;re signed in. Your events and registrations will appear here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button to="/" variant="secondary" size="md">
              Back to home
            </Button>
            <Button variant="outline" size="md" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
