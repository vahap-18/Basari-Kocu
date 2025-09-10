import React from "react";
import { NavLink } from "react-router-dom";
import { X, Home, Clock, Lightbulb, Target, Settings, Palette } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export const MobileMenu: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { theme, setTheme } = useTheme();
  return (
    <div
      className={
        "fixed inset-0 z-50 pointer-events-none transition-all " + (open ? "pointer-events-auto" : "")
      }
      aria-hidden={!open}
    >
      <div
        className={
          "absolute inset-0 bg-black/40 backdrop-blur transition-opacity " + (open ? "opacity-100" : "opacity-0")
        }
        onClick={onClose}
      />

      <aside
        className={
          "absolute right-0 top-0 h-full w-72 bg-card shadow-2xl p-4 transform transition-transform " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Gezinme</div>
          <button onClick={onClose} className="p-2 rounded-md border">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="space-y-2">
          <NavLink to="/" onClick={onClose} className={({ isActive }) => "flex items-center gap-3 px-3 py-2 rounded-md " + (isActive ? "bg-primary/10 text-primary" : "hover:bg-muted") }>
            <Home className="w-5 h-5" /> Ana Sayfa
          </NavLink>
          <NavLink to="/pomodoro" onClick={onClose} className={({ isActive }) => "flex items-center gap-3 px-3 py-2 rounded-md " + (isActive ? "bg-primary/10 text-primary" : "hover:bg-muted") }>
            <Clock className="w-5 h-5" /> Pomodoro
          </NavLink>
          <NavLink to="/kocluk" onClick={onClose} className={({ isActive }) => "flex items-center gap-3 px-3 py-2 rounded-md " + (isActive ? "bg-primary/10 text-primary" : "hover:bg-muted") }>
            <Lightbulb className="w-5 h-5" /> Koçluk
          </NavLink>
          <NavLink to="/teknikler" onClick={onClose} className={({ isActive }) => "flex items-center gap-3 px-3 py-2 rounded-md " + (isActive ? "bg-primary/10 text-primary" : "hover:bg-muted") }>
            <Target className="w-5 h-5" /> Teknikler
          </NavLink>
          <NavLink to="/ayarlar" onClick={onClose} className={({ isActive }) => "flex items-center gap-3 px-3 py-2 rounded-md " + (isActive ? "bg-primary/10 text-primary" : "hover:bg-muted") }>
            <Settings className="w-5 h-5" /> Ayarlar
          </NavLink>
        </nav>

        <div className="mt-6">
          <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4" /> Tema
          </div>
          <select
            className="w-full rounded-md border px-3 py-2 bg-transparent"
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
          >
            <option value="acik">Açık</option>
            <option value="koyu">Koyu</option>
            <option value="cesur">Cesur</option>
            <option value="sabir">Sabır</option>
            <option value="girisimci">Girişimci</option>
            <option value="samimi">Samimi</option>
            <option value="lider">Lider</option>
            <option value="korkusuz">Korkusuz</option>
            <option value="bilge">Bilge</option>
            <option value="kiz">Aurora</option>
            <option value="erkek">Sapphire</option>
          </select>
        </div>
      </aside>
    </div>
  );
};

export default MobileMenu;
