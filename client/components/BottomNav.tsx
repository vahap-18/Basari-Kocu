import React from "react";
import { NavLink } from "react-router-dom";
import { Clock, Home, Lightbulb, Settings, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const items = [
  { to: "/", label: "Ana Sayfa", icon: Home },
  { to: "/pomodoro", label: "Pomodoro", icon: Clock },
  { to: "/kocluk", label: "Koçluk", icon: Lightbulb },
  { to: "/teknikler", label: "Teknikler", icon: Target },
  { to: "/ayarlar", label: "Ayarlar", icon: Settings },
] as const;

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t bg-gradient-to-t from-card/90 to-transparent backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-md px-2 py-2 relative">
        <ul className="flex justify-between items-center gap-2">
          {items.map(({ to, label, icon: Icon }, idx) => (
            <li key={to} className="flex-1">
              <NavLink to={to} className={({ isActive }) => cn(
                    "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs transition-all duration-150 justify-center",
                    isActive
                      ? "bg-primary/10 text-primary shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}>
                {({ isActive }) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: isActive ? -4 : 0, scale: isActive ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs justify-center"
                  >
                    <div className="w-7 h-7 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="sr-only">{label}</span>
                  </motion.div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
