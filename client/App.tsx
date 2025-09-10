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
        // always send JSON via fetch so server's express.json can parse it
        fetch("/api/client-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }).catch(() => {});
      } catch {}
    }

    const onErr = (evt: any) => {
      report({
        type: "error",
        message: evt?.message || String(evt),
        filename: evt?.filename,
        lineno: evt?.lineno,
        colno: evt?.colno,
        stack: evt?.error?.stack,
      });
    };
    const onRej = (evt: any) => {
      report({ type: "unhandledrejection", reason: String(evt?.reason) });
    };
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);
    return () => {
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
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

class ErrorBoundary extends React.Component<any, { hasError: boolean; error?: any }>{
  constructor(props:any){
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(){
    return { hasError: true };
  }
  componentDidCatch(error:any, info:any){
    try{
      const body = JSON.stringify({ error: String(error), info });
      if(navigator && (navigator as any).sendBeacon){
        (navigator as any).sendBeacon('/api/client-log', body);
      } else {
        fetch('/api/client-log', { method: 'POST', headers:{ 'Content-Type': 'application/json' }, body }).catch(()=>{});
      }
    }catch{}
    // also log to console
    console.error('ErrorBoundary caught', error, info);
  }
  render(){
    if(this.state.hasError){
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-3">Uygulama hata verdi</h2>
            <p className="text-sm text-muted-foreground mb-4">Bir hata oluştu; konsolu kontrol edin veya bana hata mesajını gönderin.</p>
            <button onclick={() => location.reload()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">Yeniden Yükle</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
