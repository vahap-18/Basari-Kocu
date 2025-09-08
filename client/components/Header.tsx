import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Palette } from "lucide-react";

const themes: { key: Parameters<typeof useTheme>[0] extends never ? any : never } = {} as any; // type helper no-op

const themeOptions = [
  { key: "acik", label: "Açık" },
  { key: "koyu", label: "Koyu" },
  { key: "cesur", label: "Cesur" },
  { key: "sabir", label: "Sabır" },
  { key: "girisimci", label: "Girişimci" },
  { key: "samimi", label: "Samimi" },
  { key: "lider", label: "Lider" },
  { key: "korkusuz", label: "Korkusuz" },
  { key: "bilge", label: "Bilge" },
] as const;

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
          <div>
            <h1 className="text-base font-bold leading-tight">Odak+</h1>
            <p className="text-xs text-muted-foreground leading-tight">Sınav hazırlık koçun</p>
          </div>
        </div>
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
    </header>
  );
};
