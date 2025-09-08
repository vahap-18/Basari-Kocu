import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeKey =
  | "acik"
  | "koyu"
  | "cesur"
  | "sabir"
  | "girisimci"
  | "samimi"
  | "lider"
  | "korkusuz"
  | "bilge";

const DEFAULT_THEME: ThemeKey = "acik";

type ThemeContextValue = {
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem("app-theme") as ThemeKey | null;
    return saved ?? DEFAULT_THEME;
  });

  const isDark = useMemo(() => theme === "koyu", [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("app-theme", theme);
  }, [theme, isDark]);

  const value = useMemo(() => ({ theme, setTheme, isDark }), [theme, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
