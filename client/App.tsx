import "./global.css";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Pomodoro from "./pages/Pomodoro";
import Kocluk from "./pages/Kocluk";
import Teknikler from "./pages/Teknikler";
import Ayarlar from "./pages/Ayarlar";
import PersonalityExam from "./pages/PersonalityExam";
import { ThemeProvider } from "@/components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => {
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // client-side global error reporter
    function report(payload: any) {
      try {
        const body = JSON.stringify(payload);
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/client-log', body);
        } else {
          fetch('/api/client-log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }).catch(()=>{});
        }
      } catch {}
    }

    const onErr = (evt: any) => {
      report({ type: 'error', message: evt?.message || String(evt), filename: evt?.filename, lineno: evt?.lineno, colno: evt?.colno, stack: evt?.error?.stack });
    };
    const onRej = (evt: any) => {
      report({ type: 'unhandledrejection', reason: String(evt?.reason) });
    };
    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onRej);
    return () => {
      window.removeEventListener('error', onErr);
      window.removeEventListener('unhandledrejection', onRej);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pomodoro" element={<Pomodoro />} />
              <Route path="/kocluk" element={<Kocluk />} />
              <Route path="/teknikler" element={<Teknikler />} />
              <Route path="/ayarlar" element={<Ayarlar />} />
              <Route path="/test/personality" element={<PersonalityExam />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
