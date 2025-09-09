export function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getStoredIndex(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj.date === getTodayKey() && typeof obj.index === "number") return obj.index;
    return null;
  } catch {
    return null;
  }
}

export function storeIndex(key: string, index: number) {
  try {
    localStorage.setItem(key, JSON.stringify({ date: getTodayKey(), index }));
  } catch {}
}

export function pickDailyIndex(listLength: number, key: string): number {
  const stored = getStoredIndex(key);
  if (stored != null) return stored;
  // deterministic daily index based on date
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth()+1) * 100 + today.getDate();
  const idx = seed % listLength;
  try { storeIndex(key, idx); } catch {}
  return idx;
}

export function pickRandomAndStore(listLength: number, key: string): number {
  const idx = Math.floor(Math.random() * listLength);
  storeIndex(key, idx);
  return idx;
}
