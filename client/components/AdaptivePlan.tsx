import React from "react";

export default function AdaptivePlan({ profile }: { profile: any }) {
  const [loading, setLoading] = React.useState(false);
  const [plan, setPlan] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [aiAvailable, setAiAvailable] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let mounted = true;
    fetch('/api/ai-status')
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        setAiAvailable(!!j?.available);
      })
      .catch(() => {
        if (!mounted) return;
        setAiAvailable(false);
      });
    return () => { mounted = false; };
  }, []);

  async function generate() {
    setError(null);
    setLoading(true);
    setPlan(null);
    try {
      const payload = { profile, goals: JSON.parse(localStorage.getItem("goals") || "[]") };
      const res = await fetch("/api/ai-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      // try parse JSON
      let data: any = null;
      try { data = JSON.parse(text); } catch { data = { plan: text }; }

      if (!res.ok) {
        const serverMsg = data?.error || data?.message || data?.detail || `Server responded ${res.status}`;
        setError(`Servis hatası: ${serverMsg}`);
        return;
      }

      setPlan(data.plan ?? String(data));

      // if the server returned structured analysis, persist as personality-profile and dispatch update
      try {
        if (data.analysis) {
          const profile = {
            createdAt: new Date().toISOString(),
            scores: data.analysis.scores || {},
            dominant: data.analysis.dominant || "",
            summary: data.plan ? (data.plan.split("\n").slice(0, 2).join(" ")) : "AI tarafından oluşturuldu",
            recommendedPomodoro: data.analysis.recommendedPomodoro || { work: 25, short: 5, long: 15 },
          };
          localStorage.setItem("personality-profile", JSON.stringify(profile));
          try {
            window.dispatchEvent(new CustomEvent("personality-updated", { detail: profile }));
          } catch {}
        }
        // save plan history
        const hist = JSON.parse(localStorage.getItem("ai-plan-history") || "[]");
        hist.unshift({ createdAt: new Date().toISOString(), plan: data.plan, analysis: data.analysis || null });
        localStorage.setItem("ai-plan-history", JSON.stringify(hist));
      } catch {}
    } catch (e: any) {
      setError(e?.message ?? "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Adaptif Çalışma Planı</h4>
        <div className="text-xs text-muted-foreground">{aiAvailable === false ? "AI servis kapalı" : "OpenAI ile oluşturulur"}</div>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        Profiliniz ve günlük hedefleriniz temel alınarak bir çalışma planı oluşturun.
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={generate}
          disabled={loading || aiAvailable === false}
          className="px-3 py-2 rounded-xl bg-primary text-primary-foreground"
        >
          {loading ? "Oluşturuluyor..." : "Plan Oluştur"}
        </button>
        <button
          onClick={() => {
            setPlan(null);
            setError(null);
          }}
          className="px-3 py-2 rounded-xl border"
        >
          Temizle
        </button>
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      {plan ? (
        <div className="mt-2 p-3 rounded-xl bg-background">
          <pre className="whitespace-pre-wrap text-sm">{plan}</pre>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">Henüz plan yok.</div>
      )}
    </div>
  );
}
