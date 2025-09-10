import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.post("/api/client-log", express.json(), (req, res) => {
    try {
      console.error("[CLIENT LOG]", req.body);
    } catch (e) {
      console.error("[CLIENT LOG] parse error", e);
    }
    res.status(204).end();
  });

  // AI adaptive plan proxy (server-side) - requires OPENAI_API_KEY env var
  app.post("/api/ai-plan", async (req, res) => {
    try {
      const key = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
      if (!key)
        return res
          .status(400)
          .json({ error: "OpenAI API key not configured on server." });
      const body = req.body || {};
      const profile = body.profile || null;
      const goals = body.goals || [];

      const system = `You are an assistant that generates a concise adaptive study plan for a student preparing for exams. Provide a short, structured plan with daily blocks, suggested Pomodoro lengths, and tips. Be specific and actionable.`;
      const userPrompt = `Profile: ${JSON.stringify(profile)}\nGoals: ${JSON.stringify(goals)}\nRespond in Turkish. First provide a machine-readable JSON block labeled ANALYSIS_JSON with fields: scores (object of trait->0-5), recommendedPomodoro {work,short,long}, dominant (string). After the JSON block, provide a human-readable plan with sections: Summary, Weekly Plan, Recommended Pomodoro, Quick Tips.`;

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: system },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!r.ok) {
        const text = await r.text();
        return res.status(502).json({ error: "OpenAI error", detail: text });
      }
      const j = await r.json();
      const content = j.choices?.[0]?.message?.content || JSON.stringify(j);

      // try to extract JSON block labeled ANALYSIS_JSON
      let analysis: any = null;
      try {
        const m =
          content.match(/```json([\s\S]*?)```/i) ||
          content.match(/ANALYSIS_JSON:\s*(\{[\s\S]*\})/i);
        const jsonText = m ? m[1] || m[2] : null;
        if (jsonText) {
          analysis = JSON.parse(jsonText);
        } else {
          // fallback: try to find first {...}
          const firstObj = content.match(/\{[\s\S]*\}/);
          if (firstObj) analysis = JSON.parse(firstObj[0]);
        }
      } catch (e) {
        analysis = null;
      }

      // persist plan and analysis locally on server logs (not production storage)
      try {
        // noop for now, but we return both
      } catch {}

      res.json({ plan: content, analysis });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || String(e) });
    }
  });

  return app;

  return app;
}
