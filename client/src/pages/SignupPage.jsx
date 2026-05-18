import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(
        user.role === "organizer" ? "/organizer-dashboard" : "/student-dashboard",
        { replace: true }
      );
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <AuthLayout title="Create your account" subtitle="Join Event Radar as a student or organizer">
        <form className="space-y-5" onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-xl glass-light text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-xl glass-light text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-xl glass-light text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
          />

          <div>
            <p className="text-sm text-slate-400 mb-3">I am joining as a:</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "student", label: "Student", desc: "Discover & register" },
                { value: "organizer", label: "Organizer", desc: "Create & manage" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-xl p-4 border transition-all ${
                    formData.role === option.value
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-white/10 glass-light hover:border-white/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={formData.role === option.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <p className="font-semibold text-white text-sm">{option.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{option.desc}</p>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-slate-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition">
            Log in
          </Link>
        </p>
      </AuthLayout>
    </div>
  );
}
