import { NavLink, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function TopNav() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Customer App" },
    { to: "/admin", label: "Admin Dashboard" },
  ];

  return (
    <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-gold" />
        <span className="font-display text-lg font-bold tracking-tight">SEPHORA</span>
        <span className="text-[10px] font-body font-medium uppercase tracking-widest text-muted-foreground ml-1">AI Concierge</span>
      </div>

      <div className="flex items-center gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={`nav-link ${location.pathname === link.to ? "nav-link-active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Live Demo</span>
        <span className="w-2 h-2 rounded-full bg-insight-praise animate-pulse" />
      </div>
    </nav>
  );
}
