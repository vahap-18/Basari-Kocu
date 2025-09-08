import React from "react";
import { NavLink } from "react-router-dom";
import { Clock, Home, Lightbulb, Settings, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Ana Sayfa", icon: Home },
  { to: "/pomodoro", label: "Pomodoro", icon: Clock },
  { to: "/kocluk", label: "Koçluk", icon: Lightbulb },
  { to: "/teknikler", label: "Teknikler", icon: Target },
  { to: "/ayarlar", label: "Ayarlar", icon: Settings },
] as const;

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <ul className="flex justify-around px-2 py-1">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-md text-xs",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
