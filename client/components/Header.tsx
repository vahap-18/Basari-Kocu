import React from "react";
import { useTheme, type ThemeKey } from "@/components/ThemeProvider";
import { Palette } from "lucide-react";

const themeOptions: { key: ThemeKey; label: string }[] = [
  { key: "acik", label: "Açık" },
  { key: "koyu", label: "Koyu" },
  { key: "cesur", label: "Cesur" },
  { key: "sabir", label: "Sabır" },
  { key: "girisimci", label: "Girişimci" },
  { key: "samimi", label: "Samimi" },
  { key: "lider", label: "Lider" },
  { key: "korkusuz", label: "Korkusuz" },
  { key: "bilge", label: "Bilge" },
  { key: "kiz", label: "Aurora" },
  { key: "erkek", label: "Sapphire" },
];

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-accent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="2" y="2" width="20" height="20" rx="5" fill="white" opacity="0.06" />
              <path d="M6 12 L10 8 L14 12 L18 8" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="16" r="1.6" fill="white" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">Başarı Kulübü</h1>
            <p className="text-xs text-muted-foreground leading-tight">Sınav hazırlık koçun</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <Palette className="h-4 w-4" />
            <select
              className="bg-transparent text-sm px-2 py-1 rounded-md border"
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
            >
              {themeOptions.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

        </div>
      </div>
    </header>
  );
};
