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
  | "bilge"
  | "kiz"
  | "erkek";

const DEFAULT_THEME: ThemeKey = "acik";

export type Gender = "female" | "male" | "other" | null;

type ThemeContextValue = {
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  isDark: boolean;
  gender: Gender;
  setGender: (g: Gender) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem("app-theme") as ThemeKey | null;
    return saved ?? DEFAULT_THEME;
  });

  const [gender, setGender] = useState<Gender>(() => {
    try {
      const v = localStorage.getItem("app-gender");
      return v === "female" || v === "male" || v === "other" ? (v as Gender) : null;
    } catch { return null; }
  });

  const isDark = useMemo(() => theme === "koyu", [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("app-theme", theme);
    try { localStorage.setItem("app-gender", gender ?? ""); } catch {}
  }, [theme, isDark, gender]);

  const value = useMemo(() => ({ theme, setTheme, isDark, gender, setGender }), [theme, isDark, gender]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
