import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createServer } from '../../server';

let originalFetch: any;

describe('POST /api/ai-plan', () => {
  beforeEach(() => {
    originalFetch = globalThis.fetch;
    process.env.OPENAI_API_KEY = 'test-key';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.OPENAI_API_KEY;
  });

  it('returns plan and parsed analysis when OpenAI responds with JSON block', async () => {
    const fakeContent = "```json\n{\n  \"scores\": { \"focus\": 5, \"procrastinate\": 2 },\n  \"recommendedPomodoro\": { \"work\": 25, \"short\": 5, \"long\": 15 },\n  \"dominant\": \"focus\"\n}\n```\n\nSummary: This is a plan.";

    globalThis.fetch = vi.fn(async (url: string, opts: any) => {
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: fakeContent } }] }),
      } as any;
    });

    const app = createServer();
    const server = await new Promise<any>((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    const port = (server.address() as any).port;

    const res = await fetch(`http://127.0.0.1:${port}/api/ai-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: { dummy: true }, goals: [] }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.plan).toBeTruthy();
    expect(json.analysis).toBeTruthy();
    expect(json.analysis.scores).toBeTruthy();
    expect(json.analysis.dominant).toBe('focus');

    await new Promise((r) => server.close(r));
  });
});
