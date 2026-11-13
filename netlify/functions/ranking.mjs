import { getStore } from "@netlify/blobs";
export const config = { path: "/api/ranking" };
const H = { "content-type": "application/json", "cache-control": "no-store" };
const clamp = (n, max) => Math.max(0, Math.min(max, Math.floor(Number(n) || 0)));
export default async (req) => {
  const store = getStore("ranking");
  const data = (await store.get("board", { type: "json" })) || {};
  if (req.method === "POST") {
    let b; try { b = await req.json(); } catch { return new Response("{}", { status: 400, headers: H }); }
    const id = String(b.id || "").slice(0, 40), name = String(b.name || "").replace(/[^\p{L}\p{N} _.-]/gu, "").trim().slice(0, 16);
    if (id.length < 8 || !name) return new Response("{}", { status: 400, headers: H });
    const o = data[id] || { stage: 0, leagues: 0, dex: 0 };
    data[id] = { name, stage: Math.max(o.stage, clamp(b.stage, 500)), leagues: Math.max(o.leagues, clamp(b.leagues, 500)), dex: Math.max(o.dex, clamp(b.dex, 386)) };
    const keys = Object.keys(data); if (keys.length > 2000) delete data[keys[0]];
    await store.setJSON("board", data);
    return new Response("{}", { status: 200, headers: H });
  }
  const all = Object.values(data);
  const top = (f) => [...all].sort(f).slice(0, 50);
  return new Response(JSON.stringify({ stage: top((a, b) => b.stage - a.stage || b.leagues - a.leagues), dex: top((a, b) => b.dex - a.dex) }), { headers: H });
};
