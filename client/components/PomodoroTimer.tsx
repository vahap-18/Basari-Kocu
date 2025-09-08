import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Mode = "work" | "short" | "long";

const DEFAULTS = {
  work: 25,
  short: 5,
  long: 15,
  cyclesBeforeLong: 4,
};

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(880, ctx.currentTime);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    o.stop(ctx.currentTime + 0.6);
  } catch {}
}

export const PomodoroTimer: React.FC<{ focusMusic?: boolean }> = ({ focusMusic = false }) => {
  const [mode, setMode] = useState<Mode>("work");
  const [musicOn, setMusicOn] = useState<boolean>(false);
  const audioRef = React.useRef<AudioBufferSourceNode | null>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);

  React.useEffect(() => {
    if (focusMusic || musicOn) {
      startNoise();
    } else {
      stopNoise();
    }
    return () => stopNoise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusMusic, musicOn]);

  function startNoise() {
    try {
      if (audioCtxRef.current) return;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.02; // gentle white noise
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start(0);
      audioCtxRef.current = ctx;
      audioRef.current = src;
    } catch (e) {}
  }

  function stopNoise() {
    try {
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current.disconnect();
        audioRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {}
  }
  const [minutes, setMinutes] = useState(DEFAULTS.work);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [focusGuard, setFocusGuard] = useState(true);
  const [screenDim, setScreenDim] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("pomodoro-settings");
    if (saved) {
      const s = JSON.parse(saved);
      setFocusGuard(!!s.focusGuard);
      setScreenDim(!!s.screenDim);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "pomodoro-settings",
      JSON.stringify({ focusGuard, screenDim })
    );
  }, [focusGuard, screenDim]);

  const totalSeconds = useMemo(() => minutes * 60 + seconds, [minutes, seconds]);

  useInterval(() => {
    if (!running) return;
    if (seconds > 0) {
      setSeconds((s) => s - 1);
    } else if (minutes > 0) {
      setMinutes((m) => m - 1);
      setSeconds(59);
    } else {
      beep();
      if (mode === "work") {
        const nextCycles = cycles + 1;
        setCycles(nextCycles);
        try {
          const v = Number(localStorage.getItem("pomodoro-sessions") || "0");
          localStorage.setItem("pomodoro-sessions", String(v + 1));
        } catch {}
        const isLong = nextCycles % DEFAULTS.cyclesBeforeLong === 0;
        switchMode(isLong ? "long" : "short");
      } else {
        switchMode("work");
      }
    }
  }, running ? 1000 : null);

  function switchMode(next: Mode) {
    setMode(next);
    if (next === "work") setTime(DEFAULTS.work, 0);
    if (next === "short") setTime(DEFAULTS.short, 0);
    if (next === "long") setTime(DEFAULTS.long, 0);
  }

  function setTime(m: number, s: number) {
    setMinutes(m);
    setSeconds(s);
  }

  function start() {
    setRunning(true);
    if (focusGuard && document.fullscreenElement == null) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }
  function pause() {
    setRunning(false);
  }
  function reset() {
    setRunning(false);
    switchMode("work");
    setCycles(0);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!running) return;
      if (["Escape", "F11"].includes(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true } as any);
  }, [running]);

  const pct = useMemo(() => {
    const total =
      mode === "work" ? DEFAULTS.work * 60 : mode === "short" ? DEFAULTS.short * 60 : DEFAULTS.long * 60;
    return 100 - Math.floor((totalSeconds / total) * 100);
  }, [mode, totalSeconds]);

  return (
    <div className="relative">
      {screenDim && running && (
        <div className="fixed inset-0 z-10 bg-background/95" />
      )}
      <div className={cn("relative z-20", screenDim && running ? "fixed inset-0 flex items-center justify-center" : "")}>
        <div className="w-full max-w-sm mx-auto">
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => switchMode("work")}
              className={cn(
                "px-3 py-1 rounded-full text-sm border",
                mode === "work" ? "bg-primary text-primary-foreground" : "bg-secondary"
              )}
            >
              Odak
            </button>
            <button
              onClick={() => switchMode("short")}
              className={cn(
                "px-3 py-1 rounded-full text-sm border",
                mode === "short" ? "bg-primary text-primary-foreground" : "bg-secondary"
              )}
            >
              Kısa Mola
            </button>
            <button
              onClick={() => switchMode("long")}
              className={cn(
                "px-3 py-1 rounded-full text-sm border",
                mode === "long" ? "bg-primary text-primary-foreground" : "bg-secondary"
              )}
            >
              Uzun Mola
            </button>
          </div>

          <div className="aspect-square rounded-3xl border flex items-center justify-center bg-gradient-to-br from-card to-muted relative overflow-hidden">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" className="stroke-muted" strokeWidth="6" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="46"
                className="stroke-primary"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${Math.PI * 2 * 46}`}
                strokeDashoffset={`${((100 - pct) / 100) * Math.PI * 2 * 46}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <div className="text-5xl tabular-nums font-bold">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <p className="text-sm text-muted-foreground capitalize mt-1">
                {mode === "work" ? "Odaklan" : mode === "short" ? "Kısa mola" : "Uzun mola"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {!running ? (
              <button onClick={start} className="col-span-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">
                Başlat
              </button>
            ) : (
              <button onClick={pause} className="col-span-2 py-3 rounded-xl bg-secondary font-semibold">
                Duraklat
              </button>
            )}
            <button onClick={reset} className="py-3 rounded-xl border font-semibold">
              Sıfırla
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <label className="flex items-center justify-between py-2 px-3 border rounded-xl">
              <span className="text-sm">Dikkat kalkanı (tam ekran)</span>
              <input type="checkbox" checked={focusGuard} onChange={(e) => setFocusGuard(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between py-2 px-3 border rounded-xl">
              <span className="text-sm">Ekranı sadeleştir</span>
              <input type="checkbox" checked={screenDim} onChange={(e) => setScreenDim(e.target.checked)} />
            </label>

            <label className="flex items-center justify-between py-2 px-3 border rounded-xl">
              <span className="text-sm">Odak sesi (düşük)</span>
              <input type="checkbox" checked={musicOn || focusMusic} onChange={(e) => setMusicOn(e.target.checked)} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
