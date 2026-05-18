import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const publicLinks = [
  { label: "Home", href: "/", isRoute: true },
  { label: "Events", href: "/events", isRoute: true },
  { label: "About", href: "/#about", isRoute: false },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout, isOrganizer } = useAuth();

  const dashboardPath = isOrganizer ? "/organizer-dashboard" : "/student-dashboard";

  const authLinks = isAuthenticated
    ? [
        { label: "Dashboard", href: dashboardPath, isRoute: true },
        ...(isOrganizer
          ? [
              { label: "Create Event", href: "/create-event", isRoute: true },
              { label: "Manage Events", href: "/manage-events", isRoute: true },
            ]
          : [{ label: "My Registrations", href: "/my-registrations", isRoute: true }]),
        ...(!isOrganizer ? [] : [{ label: "Browse Events", href: "/events", isRoute: true }]),
      ]
    : [];

  const allLinks = [...publicLinks, ...authLinks];

  const NavItem = ({ link, onClick }) =>
    link.isRoute ? (
      <Link
        to={link.href}
        onClick={onClick}
        className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
      >
        {link.label}
      </Link>
    ) : (
      <a
        href={link.href}
        onClick={onClick}
        className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
      >
        {link.label}
      </a>
    );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="max-w-7xl mx-auto glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl shadow-black/20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            ER
          </span>
          <span className="font-bold text-lg sm:text-xl text-white tracking-tight">
            Event <span className="text-gradient">Radar</span>
          </span>
        </Link>

        <ul className="hidden xl:flex items-center gap-6">
          {allLinks.map((link) => (
            <li key={link.label}>
              <NavItem link={link} />
            </li>
          ))}
        </ul>

        <div className="hidden xl:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-xs text-slate-500 capitalize hidden 2xl:inline">
                {user?.name} · {user?.role}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button to="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button to="/signup" variant="primary" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="xl:hidden p-2 rounded-lg text-slate-300 hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="xl:hidden max-w-7xl mx-auto mt-2 glass rounded-2xl p-4 flex flex-col gap-2"
          >
            {allLinks.map((link) => (
              <div key={link.label} className="px-4 py-3 rounded-xl hover:bg-white/5">
                <NavItem link={link} onClick={() => setOpen(false)} />
              </div>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              {isAuthenticated ? (
                <Button variant="secondary" size="sm" onClick={() => { logout(); setOpen(false); }}>
                  Logout
                </Button>
              ) : (
                <>
                  <Button to="/login" variant="secondary" size="sm" onClick={() => setOpen(false)}>
                    Login
                  </Button>
                  <Button to="/signup" variant="primary" size="sm" onClick={() => setOpen(false)}>
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
