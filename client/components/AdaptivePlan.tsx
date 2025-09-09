import React, { useState } from "react";

export default function AdaptivePlan({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setPlan(data.plan ?? String(data));
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
        <div className="text-xs text-muted-foreground">OpenAI ile oluşturulur</div>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        Profiliniz ve günlük hedefleriniz temel alınarak bir çalışma planı oluşturun.
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={generate}
          disabled={loading}
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
