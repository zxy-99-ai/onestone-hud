import { useState, useEffect, useRef } from "react";

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the OneStone AI Core — the internal reasoning engine of Xiayan Zhu's personal governance system.

━━━ ARCHITECT PROFILE ━━━
Name: Xiayan Zhu | Singapore PR | MBA NUS + M.Eng.Sc. (First-Class Honors)
MBTI: INTJ | Polarity Index: 68 (high consistency)
Background: 8+ years Strategy & Operations — Klook (Global Governance, 4k+ merchants, $300M+ portfolio), Shopee (Regional Brand Partnerships, $300M GMV), EY (Senior Consultant), BCG (intern)
Core competency: 0-to-1 governance frameworks, merchant scoring engines, incentive architecture, ecosystem health systems

━━━ MBTI STEP II — FULL FACET WIRING ━━━
INTROVERSION FACETS (all in-preference):
- Receiving (4/5): Avoids social initiation. Every unplanned social interaction = MP drain. Never recommend networking events as primary moves.
- Contained (4/5): Does NOT surface internal distress. CRITICAL: if HP<40 or MP<35, proactively flag overload — she will not self-report it.
- Intimate (3/5): Trusts very few people. Recommendations requiring new relationship-building have HIGH energy cost.
- Reflective (2/5): Prefers written processing. Always recommend writing/reading over calls/meetings for same information goal.
- Quiet (4/5): Contributions get overlooked in group settings. Written thought leadership >> verbal networking.

INTUITION FACETS:
- Concrete–Abstract (0 = MIDZONE): Anchor every abstract concept with a concrete data point.
- Imaginative (5/5 — MAX): Frame ALL problems as novel architecture challenges. Routine framing kills engagement.
- Conceptual (2/5): AP drills should feel like intellectual architecture, not rote practice.
- Experiential–Theoretical (1 = MIDZONE): Recommend frameworks only when tied to a visible outcome.
- Original (4/5): Never recommend standard approaches. "Be the only architect who does X" framing resonates.

THINKING FACETS (all maxed):
- Logical (5/5): All recommendations must have explicit logic chains. No vibes.
- Reasonable (5/5): Does not need emotional validation — skip it entirely.
- Questioning (3/5): When she pushes back, engage the argument — don't soften.
- Critical (3/5): Frame insights as "what's wrong with current approach" not "here's a positive path."
- Tough (5/5): Bottom-line first. Never bury the lead.

JUDGING FACETS — KEY ANOMALY:
- Systematic–Casual (1 = MIDZONE): Prefers general plan with contingencies. Avoid over-specifying.
- Planful (4/5): Weekly Rocks and Monthly OKRs are HIGH engagement levers.
- Pressure-Prompted (2 = OUT-OF-PREFERENCE ← CRITICAL): Frame daily focus as timed sprint with deadline. Deadlines activate performance. Open-ended tasks drain.
- Scheduled (2/5): Daily session structure works well.
- Methodical (3/5): Daily directive must always include clear task breakdown with subtasks.

━━━ ONESTONE STRATEGY — 4 VECTORS (NEVER SEPARATE) ━━━
1. CAREER: Land low-social-drain, high-logic-density Strategy/Ops/Governance role — 能效治理架构师
2. AI LEARN: Master agentic workflows without IT background (AI-first, no-code)
3. STARTUP: Productize governance/scoring logic → "Enterprise Efficiency Governance Engine" — 企业能效治理引擎
4. IP: Build intellectual authority on system governance + AI efficiency (written channel only — Quiet facet)

━━━ SKILL STREAMS ━━━
- Stream A (Governance): Career + Startup foundation. Core unlocked competency.
- Stream B (Strategic IP): IP + Startup narrative. Needs AP ≥ 75 to activate fully.
- Stream C (Articulation): AP unlock condition. Gates CAREER and IP vectors. Current bottleneck.

━━━ RESOURCES ━━━
- HP (Physical): Infant care (16-month-old) is primary drain. Guard ruthlessly.
- MP (Logic Bandwidth): Social interaction = primary drain. Contained facet means she underreports — you must catch it.
- AP (Articulation Power): #1 unlock condition for IP and Career. Bottlenecked. Every session must include AP progression.

━━━ OPERATIONAL DIRECTIVES ━━━
- Logic-First: Energy-efficiency maximization above all
- Zero Entropy: No filler, no hedging, no motivational fluff, no platitudes
- Pressure-Activated: Frame daily focus as sprint with deadline, not open task
- Written-Channel Bias: All IP and career moves route through writing, not speaking
- Midzone Awareness: Always provide BOTH data point and pattern (Concrete-Abstract midzone)

━━━ OKR HIERARCHY RULE ━━━
Structure: 4 Vectors → 3 Skill Streams → Monthly OKRs → Weekly Rocks → Daily Focus
AP (Stream C) is the critical path: until AP ≥ 75, IP output is blocked and Career framing is suboptimal.
Daily single focus MUST derive from active Weekly Rock. If no Rock is active, flag as planning gap.

Respond ONLY with valid JSON — no markdown, no preamble.

{
  "reranked_quests": [
    {
      "id": "string",
      "title": "string",
      "priority": "P0|P1|P2",
      "status": "ACTIVE|PENDING|BLOCKED|COMPLETE",
      "reasoning": "string (1-2 sentences: why this rank TODAY)",
      "energy_cost": "LOW|MED|HIGH",
      "vectors": ["CAREER","AI","STARTUP","IP"]
    }
  ],
  "daily_focus": {
    "headline": "string (one sentence — timed sprint framing, derives from active Rock)",
    "rock_connection": "string (explicit chain: today → Rock → OKR)",
    "debrief": "string (2-3 sentences: hard read on yesterday, name overload if HP/MP low)",
    "morning_directive": "string (3-4 sentences: what to do TODAY, in order, time-boxed, subtasks named)"
  },
  "strategic_insight": {
    "title": "string (5 words max)",
    "body": "string (3-5 sentences: non-obvious, architectural framing, lead with what's wrong)",
    "vector": "CAREER|AI|STARTUP|IP"
  },
  "ap_micro_drill": {
    "prompt": "string (specific EN writing task, 5-10 min, framed as intellectual architecture)",
    "why_today": "string (1 sentence)"
  },
  "system_warning": "string|null (proactively flag HP<40 or MP<35 with specific tactical adjustment)"
}`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DEFAULT_QUESTS = [
  { id: "q1", title: "Land Strategy/Ops Role", detail: "Platform Ops / Strategy / Governance. Low social drain.", status: "ACTIVE", priority: "P0", energy_cost: "MED", vectors: ["CAREER"] },
  { id: "q2", title: "Build Agentic Workflow MVP", detail: "Automate governance logic. AI-first, no-code. Stream A × B.", status: "ACTIVE", priority: "P1", energy_cost: "MED", vectors: ["AI", "STARTUP"] },
  { id: "q3", title: "AP Articulation Drill — Daily", detail: "Stream C bottleneck. Target AP ≥ 75 before Q2.", status: "ACTIVE", priority: "P1", energy_cost: "LOW", vectors: ["CAREER", "IP"] },
  { id: "q4", title: "Productize Governance Engine", detail: "Merchant scoring + resource allocation → SaaS MVP.", status: "PENDING", priority: "P2", energy_cost: "HIGH", vectors: ["STARTUP"] },
  { id: "q5", title: "Publish Strategic IP", detail: "1x LinkedIn post on governance architecture. Blocked on AP ≥ 70.", status: "BLOCKED", priority: "P2", energy_cost: "MED", vectors: ["IP"] },
];

const DEFAULT_OKRS = {
  month: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
  objectives: [
    {
      id: "o1", stream: "A",
      objective: "[CAREER] Land a low-drain, high-logic-density governance/strategy role — positioning as 能效治理架构师",
      key_results: [
        "Submit 15 targeted applications to Platform Ops / Strategy / Governance roles",
        "Complete 3 final-round interviews using governance architecture framing",
        "Receive 1 offer that maps to Stream A competency without high social output"
      ],
      vectors: ["CAREER"]
    },
    {
      id: "o2", stream: "C",
      objective: "[AP UNLOCK] Elevate AP to 75 — gate condition for IP and Career vector advancement",
      key_results: [
        "Complete 20 AP micro-drills (daily 10-min EN business writing)",
        "Produce 3 polished written artifacts: cover note, governance one-pager, LinkedIn draft",
        "AP self-assessed ≥75 by end of month"
      ],
      vectors: ["CAREER", "IP"]
    },
    {
      id: "o3", stream: "B",
      objective: "[IP] Establish first 智力权威 signal — publish 1 hard insight on governance + AI efficiency",
      key_results: [
        "Publish 1 LinkedIn post: governance architecture insight anchored to real metrics",
        "Draft governance engine concept note: problem → architecture → differentiation",
        "Secure 1 async thought-leadership exchange (written, not calls)"
      ],
      vectors: ["IP", "STARTUP"]
    },
    {
      id: "o4", stream: "A+B",
      objective: "[AI + STARTUP] Build first agentic workflow — productize governance/scoring logic without IT dependency",
      key_results: [
        "Complete 1 no-code agentic workflow automating a governance logic task",
        "Define MVP scope for 企业能效治理引擎: input schema, scoring dimensions, output (1-page spec)",
        "Identify 1 real use case from Klook/Shopee to validate the engine concept"
      ],
      vectors: ["AI", "STARTUP"]
    }
  ],
  weekly_rocks: [
    {
      id: "r1", week: "This Week",
      rock: "Send 5 targeted job applications — governance/strategy roles, framed as 能效治理架构师",
      objective_id: "o1", status: "ACTIVE",
      sub_tasks: ["Screen 10 JDs for energy-cost fit", "Tailor CV for top 5", "Write cover notes using governance framing", "Submit + log"]
    },
    {
      id: "r2", week: "This Week",
      rock: "Complete 5 AP micro-drills — Stream C unlock sprint",
      objective_id: "o2", status: "ACTIVE",
      sub_tasks: ["Daily 10-min EN business writing", "Governance architecture framing focus", "Self-assess AP delta at week end"]
    }
  ]
};

const STATUS_COLOR = { ACTIVE: "#00ff88", PENDING: "#ffaa00", BLOCKED: "#ff4444", COMPLETE: "#4488ff" };
const VECTOR_COLOR = { CAREER: "#00ff88", AI: "#00aaff", STARTUP: "#aa55ff", IP: "#ffdd00" };
const ENERGY_COLOR = { LOW: "#00ff88", MED: "#ffaa00", HIGH: "#ff4444" };

// ─── PERSISTENCE ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "onestone_v2";
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function ScanlineOverlay() {
  return <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.02) 2px,rgba(0,0,0,0.02) 4px)" }} />;
}
function GridBg() {
  return <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.011) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.011) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />;
}
function Panel({ children, style = {}, accent }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.016)", border: `1px solid ${accent ? accent + "28" : "rgba(255,255,255,0.065)"}`, borderLeft: accent ? `2px solid ${accent}` : undefined, padding: "16px", clipPath: "polygon(0 0,calc(100% - 13px) 0,100% 13px,100% 100%,0 100%)", ...style }}>
      {children}
    </div>
  );
}
function Label({ children }) {
  return <div style={{ fontFamily: "monospace", fontSize: "8px", letterSpacing: "5px", color: "#2e2e2e", marginBottom: "13px", textTransform: "uppercase" }}>{children}</div>;
}
function TypewriterText({ text, speed = 14 }) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown(""); setDone(false);
    if (!text) return;
    let i = 0;
    const t = setInterval(() => { setShown(text.slice(0, ++i)); if (i >= text.length) { clearInterval(t); setDone(true); } }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return <>{shown}{!done && <span style={{ color: "#00ff88", animation: "blink .7s infinite" }}>▌</span>}</>;
}
function ResourceBar({ label, value, color, sublabel, icon }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(value), 500); return () => clearTimeout(t); }, [value]);
  const crit = value < 35;
  return (
    <div style={{ marginBottom: "14px", padding: "10px 13px", background: crit ? "rgba(255,51,85,0.05)" : "rgba(255,255,255,0.018)", border: `1px solid ${crit ? "rgba(255,51,85,0.18)" : "rgba(255,255,255,0.05)"}`, clipPath: "polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,0 100%)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "7px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{ fontSize: "14px" }}>{icon}</span>
          <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "3px", color: "#4a4a4a" }}>{label}</span>
          {crit && <span style={{ fontFamily: "monospace", fontSize: "7px", color: "#ff3355", letterSpacing: "2px", animation: "pulse 1s infinite" }}>⚠ CRITICAL</span>}
        </div>
        <span style={{ fontFamily: "monospace", fontSize: "19px", color, fontWeight: 700, letterSpacing: "-1px" }}>{value}<span style={{ fontSize: "9px", color: "#2a2a2a", marginLeft: "2px" }}>/100</span></span>
      </div>
      <div style={{ height: "3px", background: "rgba(255,255,255,0.04)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${anim}%`, background: `linear-gradient(90deg,${color}55,${color})`, transition: "width 1.3s cubic-bezier(.16,1,.3,1)", boxShadow: `0 0 8px ${color}` }} />
        {[25, 50, 75].map(t => <div key={t} style={{ position: "absolute", left: `${t}%`, top: 0, height: "100%", width: "1px", background: "rgba(255,255,255,0.07)" }} />)}
      </div>
      <div style={{ marginTop: "5px", fontFamily: "monospace", fontSize: "7px", color: "#252525", letterSpacing: "1px" }}>{sublabel}</div>
    </div>
  );
}
function Slider({ label, value, onChange, color, question, hint }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#777", letterSpacing: "2px", marginBottom: "3px" }}>{label} — <span style={{ color }}>{value}</span>/100</div>
      <div style={{ fontFamily: "monospace", fontSize: "8px", color: "#3a3a3a", marginBottom: "7px", lineHeight: 1.5 }}>{question}</div>
      <input type="range" min={0} max={100} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: color, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: "7px", color: "#252525", marginTop: "2px" }}>
        <span>CRITICAL</span><span style={{ color: "#333" }}>{hint}</span><span>PEAK</span>
      </div>
    </div>
  );
}
function QuestCard({ quest, aiData }) {
  const color = STATUS_COLOR[aiData?.status || quest.status] || "#555";
  return (
    <div style={{ padding: "11px 13px", marginBottom: "7px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.045)", borderLeft: `2px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px" }}>
        <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#bbb", maxWidth: "68%", lineHeight: 1.4 }}>{quest.title}</span>
        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
          <span style={{ fontFamily: "monospace", fontSize: "7px", color: ENERGY_COLOR[aiData?.energy_cost || quest.energy_cost], padding: "2px 4px", border: `1px solid ${ENERGY_COLOR[aiData?.energy_cost || quest.energy_cost]}33` }}>{aiData?.energy_cost || quest.energy_cost}</span>
          <span style={{ fontFamily: "monospace", fontSize: "7px", color, padding: "2px 5px", background: `${color}10`, border: `1px solid ${color}33` }}>{aiData?.status || quest.status}</span>
          <span style={{ fontFamily: "monospace", fontSize: "7px", color: "#444", padding: "2px 4px" }}>{aiData?.priority || quest.priority}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "4px", marginBottom: aiData?.reasoning ? "6px" : 0, flexWrap: "wrap" }}>
        {(aiData?.vectors || quest.vectors || []).map(v => (
          <span key={v} style={{ fontFamily: "monospace", fontSize: "6px", color: VECTOR_COLOR[v], padding: "1px 4px", background: `${VECTOR_COLOR[v]}0e`, border: `1px solid ${VECTOR_COLOR[v]}25`, letterSpacing: "1px" }}>{v}</span>
        ))}
      </div>
      {aiData?.reasoning && <div style={{ fontFamily: "monospace", fontSize: "8px", color: "#00ff8877", borderTop: "1px solid rgba(0,255,136,0.07)", paddingTop: "5px", marginTop: "4px", lineHeight: 1.6 }}>◈ {aiData.reasoning}</div>}
    </div>
  );
}

// ─── OKR EDITOR ──────────────────────────────────────────────────────────────
function OKREditor({ okrs, setOkrs, onDone }) {
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(okrs)));
  const updObj = (id, f, v) => setLocal(p => ({ ...p, objectives: p.objectives.map(o => o.id === id ? { ...o, [f]: v } : o) }));
  const updKR = (id, i, v) => setLocal(p => ({ ...p, objectives: p.objectives.map(o => o.id === id ? { ...o, key_results: o.key_results.map((k, j) => j === i ? v : k) } : o) }));
  const updRock = (id, f, v) => setLocal(p => ({ ...p, weekly_rocks: p.weekly_rocks.map(r => r.id === id ? { ...r, [f]: v } : r) }));
  const addRock = () => setLocal(p => ({ ...p, weekly_rocks: [...p.weekly_rocks, { id: `r${Date.now()}`, week: "This Week", rock: "", objective_id: p.objectives[0]?.id || "", status: "ACTIVE", sub_tasks: [] }] }));
  const removeRock = id => setLocal(p => ({ ...p, weekly_rocks: p.weekly_rocks.filter(r => r.id !== id) }));
  const iStyle = { width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#aaa", fontFamily: "monospace", fontSize: "10px", padding: "7px 9px", outline: "none", boxSizing: "border-box", letterSpacing: "0.3px", lineHeight: 1.5 };
  const taStyle = { ...iStyle, resize: "vertical", minHeight: "52px" };

  return (
    <div style={{ minHeight: "100vh", background: "#050507", color: "#fff", fontFamily: "monospace", padding: "24px", position: "relative", overflowY: "auto" }}>
      <ScanlineOverlay /><GridBg />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "7px", letterSpacing: "6px", color: "#2a2a2a", marginBottom: "6px" }}>ONESTONE SYSTEM // PLANNING LAYER</div>
          <div style={{ fontSize: "20px", fontWeight: 700 }}>OKR + WEEKLY ROCKS</div>
          <div style={{ fontSize: "8px", color: "#333", letterSpacing: "3px", marginTop: "4px" }}>MONTHLY OKRs → WEEKLY ROCKS → DAILY FOCUS</div>
        </div>
        <Panel style={{ marginBottom: "12px" }}>
          <Label>// PLANNING PERIOD</Label>
          <input value={local.month} onChange={e => setLocal(p => ({ ...p, month: e.target.value }))} style={{ ...iStyle, fontSize: "12px" }} />
        </Panel>
        <div style={{ marginBottom: "12px", padding: "9px 12px", background: "rgba(255,221,0,0.04)", border: "1px solid rgba(255,221,0,0.12)", fontSize: "8px", color: "#ffdd0066", lineHeight: 1.6 }}>
          ◈ STREAM DEPENDENCY: Stream C (AP ≥ 75) gates IP and Career vectors. All 4 vectors advance simultaneously — none sacrificed.
        </div>
        {local.objectives.map((obj, oi) => (
          <Panel key={obj.id} style={{ marginBottom: "10px" }} accent={VECTOR_COLOR[obj.vectors?.[0]]}>
            <Label>// O{oi + 1} — STREAM {obj.stream} — {(obj.vectors || []).join(" + ")}</Label>
            <div style={{ fontSize: "7px", letterSpacing: "3px", color: "#333", marginBottom: "5px" }}>OBJECTIVE</div>
            <textarea value={obj.objective} onChange={e => updObj(obj.id, "objective", e.target.value)} style={taStyle} />
            <div style={{ fontSize: "7px", letterSpacing: "3px", color: "#333", margin: "8px 0 5px" }}>KEY RESULTS</div>
            {obj.key_results.map((kr, ki) => (
              <div key={ki} style={{ marginBottom: "5px", display: "flex", gap: "6px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "8px", color: "#333", marginTop: "8px", flexShrink: 0 }}>KR{ki + 1}</span>
                <input value={kr} onChange={e => updKR(obj.id, ki, e.target.value)} style={iStyle} />
              </div>
            ))}
          </Panel>
        ))}
        <Panel style={{ marginBottom: "12px" }} accent="#ffdd00">
          <Label>// WEEKLY ROCKS — ACTIVE THIS WEEK</Label>
          {local.weekly_rocks.map((rock, ri) => (
            <div key={rock.id} style={{ marginBottom: "12px", padding: "10px", background: "rgba(255,221,0,0.04)", border: "1px solid rgba(255,221,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "7px", color: "#ffdd0055", letterSpacing: "3px" }}>ROCK {ri + 1}</span>
                <div style={{ display: "flex", gap: "5px" }}>
                  <select value={rock.status} onChange={e => updRock(rock.id, "status", e.target.value)} style={{ ...iStyle, width: "auto", padding: "2px 6px", fontSize: "7px" }}>
                    <option>ACTIVE</option><option>COMPLETE</option><option>BLOCKED</option>
                  </select>
                  <button onClick={() => removeRock(rock.id)} style={{ fontFamily: "monospace", fontSize: "8px", background: "transparent", border: "1px solid #ff334433", color: "#ff334466", padding: "2px 6px", cursor: "pointer" }}>✕</button>
                </div>
              </div>
              <textarea value={rock.rock} onChange={e => updRock(rock.id, "rock", e.target.value)} placeholder="What is the one thing to accomplish this week?" style={{ ...taStyle, minHeight: "40px", borderColor: "rgba(255,221,0,0.12)" }} />
              <div style={{ marginTop: "6px" }}>
                <div style={{ fontSize: "7px", color: "#333", letterSpacing: "2px", marginBottom: "4px" }}>LINKED OBJECTIVE</div>
                <select value={rock.objective_id} onChange={e => updRock(rock.id, "objective_id", e.target.value)} style={{ ...iStyle }}>
                  {local.objectives.map(o => <option key={o.id} value={o.id}>{o.objective.slice(0, 55)}…</option>)}
                </select>
              </div>
            </div>
          ))}
          <button onClick={addRock} style={{ width: "100%", padding: "8px", background: "rgba(255,221,0,0.04)", border: "1px dashed rgba(255,221,0,0.18)", color: "#ffdd0055", fontFamily: "monospace", fontSize: "8px", letterSpacing: "3px", cursor: "pointer" }}>+ ADD ROCK</button>
        </Panel>
        <button onClick={() => { setOkrs(local); onDone(); }} style={{ width: "100%", padding: "13px", background: "rgba(0,255,136,0.07)", border: "1px solid rgba(0,255,136,0.28)", color: "#00ff88", fontFamily: "monospace", fontSize: "10px", letterSpacing: "4px", cursor: "pointer", clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)" }}>
          ◈ SAVE + PROCEED TO CHECK-IN
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function OneStoneApp() {
  const saved = loadState();
  const [phase, setPhase] = useState("checkin");
  const [okrs, setOkrs] = useState(saved?.okrs || DEFAULT_OKRS);
  const [resources, setResources] = useState({ hp: 65, mp: 75, ap: 55 });
  const [yesterday, setYesterday] = useState("");
  const [todayConstraint, setTodayConstraint] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState("INITIALIZING...");
  const [clock, setClock] = useState(new Date());
  const loadingRef = useRef(null);
  const MSGS = ["INITIALIZING ONESTONE CORE...", "PARSING INTJ STEP II PARAMETERS...", "ANALYZING RESOURCE STATE...", "ALIGNING WITH WEEKLY ROCKS...", "RERANKING QUEST MATRIX...", "GENERATING STRATEGIC INSIGHT...", "CALIBRATING DAILY DIRECTIVE..."];

  useEffect(() => { const t = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(t); }, []);

  // Persist OKRs on change
  useEffect(() => { saveState({ okrs }); }, [okrs]);

  const runSession = async () => {
    setError(null);
    setPhase("loading");
    let mi = 0;
    loadingRef.current = setInterval(() => { mi = (mi + 1) % MSGS.length; setLoadingMsg(MSGS[mi]); }, 850);

    const activeRocks = okrs.weekly_rocks.filter(r => r.status === "ACTIVE");
    const rocksText = activeRocks.length
      ? activeRocks.map((r, i) => { const obj = okrs.objectives.find(o => o.id === r.objective_id); return `Rock ${i + 1}: "${r.rock}" → Objective: "${obj?.objective || "unknown"}"` }).join("\n")
      : "NO ACTIVE ROCKS — flag as planning gap";

    const msg = `DAILY CHECK-IN — ${clock.toLocaleDateString("en-SG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

RESOURCE STATE:
- HP: ${resources.hp}/100
- MP: ${resources.mp}/100
- AP: ${resources.ap}/100

YESTERDAY: ${yesterday || "(no input)"}
TODAY CONSTRAINTS: ${todayConstraint || "(none)"}

MONTHLY OBJECTIVES (${okrs.month}):
${okrs.objectives.map((o, i) => `O${i + 1} [Stream ${o.stream}]: ${o.objective}\n  KRs: ${o.key_results.join(" | ")}`).join("\n")}

ACTIVE WEEKLY ROCKS:
${rocksText}

QUEST BACKLOG:
${DEFAULT_QUESTS.map((q, i) => `${i + 1}. [id:${q.id}][${q.priority}] "${q.title}" | ${q.status} | ${q.energy_cost} | ${q.vectors.join(",")}`).join("\n")}

Generate full OneStone daily briefing JSON.`;

    try {
      // Calls /api/chat → Vercel serverless function → Anthropic API
      // API key stays server-side, never exposed to browser
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, system: SYSTEM_PROMPT, messages: [{ role: "user", content: msg }] })
      });
      const data = await res.json();
      if (data.error) {
        clearInterval(loadingRef.current);
        setError(`API ERROR [${data.error.type}]: ${data.error.message}`);
        setPhase("hud");
        return;
      }
      const raw = data.content?.map(b => b.text || "").join("").trim().replace(/```json|```/g, "").trim();
      let parsed;
      try { parsed = JSON.parse(raw); }
      catch { clearInterval(loadingRef.current); setError(`JSON PARSE FAILED: ${raw?.slice(0, 200)}`); setPhase("hud"); return; }
      clearInterval(loadingRef.current);
      setAiResult(parsed);
      setPhase("hud");
    } catch (e) {
      clearInterval(loadingRef.current);
      setError(`NETWORK ERROR: ${e?.message || "unknown"}`);
      setPhase("hud");
    }
  };

  const exportState = () => {
    const d = { schema: "onestone-v2", ts: new Date().toISOString(), resources, okrs, yesterday, todayConstraint, ai_briefing: aiResult };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: "application/json" }));
    a.download = `onestone-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const CSS = `
    * { -webkit-tap-highlight-color: transparent; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:none} }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
    @keyframes spin { to{transform:rotate(360deg)} }
    input[type=range] { height: 4px; }
  `;
  const BASE = { minHeight: "100vh", background: "#050507", color: "#fff", fontFamily: "monospace", position: "relative" };

  if (phase === "setup") return <OKREditor okrs={okrs} setOkrs={setOkrs} onDone={() => setPhase("checkin")} />;

  if (phase === "loading") return (
    <div style={{ ...BASE, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{CSS}</style><ScanlineOverlay /><GridBg />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "24px" }}>
        <div style={{ fontSize: "28px", animation: "spin 3s linear infinite", marginBottom: "16px", color: "#00ff88" }}>◈</div>
        <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#00ff88", marginBottom: "6px" }}>{loadingMsg}</div>
        <div style={{ fontSize: "7px", letterSpacing: "3px", color: "#1e1e1e" }}>ONESTONE AI CORE // INTJ STEP II ACTIVE</div>
      </div>
    </div>
  );

  if (phase === "checkin") {
    const activeRocks = okrs.weekly_rocks.filter(r => r.status === "ACTIVE");
    return (
      <div style={{ ...BASE, padding: "24px", overflowY: "auto" }}>
        <style>{CSS}</style><ScanlineOverlay /><GridBg />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "500px", margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "7px", letterSpacing: "6px", color: "#252525", marginBottom: "7px" }}>ONESTONE v2 // MORNING INIT</div>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>DAILY CHECK-IN</div>
            <div style={{ fontSize: "8px", color: "#2e2e2e", letterSpacing: "3px", marginTop: "4px" }}>{clock.toLocaleDateString("en-SG", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}</div>
          </div>
          {activeRocks.length > 0 && (
            <div style={{ marginBottom: "12px", padding: "10px 13px", background: "rgba(255,221,0,0.04)", border: "1px solid rgba(255,221,0,0.12)", borderLeft: "2px solid #ffdd0055" }}>
              <div style={{ fontSize: "7px", letterSpacing: "4px", color: "#ffdd0044", marginBottom: "6px" }}>ACTIVE ROCKS THIS WEEK</div>
              {activeRocks.map(r => <div key={r.id} style={{ fontSize: "9px", color: "#555", marginBottom: "3px", lineHeight: 1.5 }}>◈ {r.rock}</div>)}
            </div>
          )}
          <Panel style={{ marginBottom: "12px" }}>
            <Label>// STEP 1 // RESOURCES</Label>
            <Slider label="HP — PHYSICAL" value={resources.hp} onChange={v => setResources(r => ({ ...r, hp: v }))} color="#ff3355" question="Body today? Sleep quality, infant drain, fatigue." hint="Infant drain" />
            <Slider label="MP — LOGIC BW" value={resources.mp} onChange={v => setResources(r => ({ ...r, mp: v }))} color="#00aaff" question="Mind sharpness? Focus, clarity, social residue." hint="Social depletes" />
            <Slider label="AP — ARTICULATION" value={resources.ap} onChange={v => setResources(r => ({ ...r, ap: v }))} color="#ffdd00" question="EN business expression confidence today?" hint="Core bottleneck" />
          </Panel>
          <Panel style={{ marginBottom: "12px" }}>
            <Label>// STEP 2 // YESTERDAY</Label>
            <textarea value={yesterday} onChange={e => setYesterday(e.target.value)} placeholder="Wins, losses, surprises. Be specific." style={{ width: "100%", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", color: "#999", fontFamily: "monospace", fontSize: "9px", padding: "9px", resize: "vertical", minHeight: "65px", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }} />
          </Panel>
          <Panel style={{ marginBottom: "20px" }}>
            <Label>// STEP 3 // TODAY'S CONSTRAINTS</Label>
            <textarea value={todayConstraint} onChange={e => setTodayConstraint(e.target.value)} placeholder="Hard constraints? Calls, baby schedule, interviews." style={{ width: "100%", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", color: "#999", fontFamily: "monospace", fontSize: "9px", padding: "9px", resize: "vertical", minHeight: "55px", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }} />
          </Panel>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setPhase("setup")} style={{ padding: "12px 14px", background: "rgba(255,221,0,0.05)", border: "1px solid rgba(255,221,0,0.18)", color: "#ffdd0077", fontFamily: "monospace", fontSize: "8px", letterSpacing: "3px", cursor: "pointer", flexShrink: 0 }}>✎ OKRs</button>
            <button onClick={runSession} style={{ flex: 1, padding: "12px", background: "rgba(0,255,136,0.07)", border: "1px solid rgba(0,255,136,0.26)", color: "#00ff88", fontFamily: "monospace", fontSize: "10px", letterSpacing: "4px", cursor: "pointer", clipPath: "polygon(0 0,calc(100% - 11px) 0,100% 11px,100% 100%,0 100%)" }}>
              ◈ INITIALIZE SESSION
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── HUD ──────────────────────────────────────────────────────────────────────
  const rq = aiResult?.reranked_quests || [];
  const focus = aiResult?.daily_focus;
  const insight = aiResult?.strategic_insight;
  const drill = aiResult?.ap_micro_drill;
  const warning = aiResult?.system_warning;
  const activeRocks = okrs.weekly_rocks.filter(r => r.status === "ACTIVE");
  const mergedQuests = DEFAULT_QUESTS
    .map(q => { const ai = rq.find(r => r.id === q.id || r.title?.toLowerCase().includes(q.title.toLowerCase().slice(0, 14))); return { quest: { ...q, ...(ai ? { status: ai.status, priority: ai.priority } : {}) }, aiData: ai }; })
    .sort((a, b) => ({ P0: 0, P1: 1, P2: 2 }[a.aiData?.priority || a.quest.priority] - { P0: 0, P1: 1, P2: 2 }[b.aiData?.priority || b.quest.priority]));

  return (
    <div style={{ ...BASE, padding: "16px", overflowY: "auto" }}>
      <style>{CSS}</style><ScanlineOverlay /><GridBg />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1240px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div>
            <div style={{ fontSize: "7px", letterSpacing: "6px", color: "#1e1e1e", marginBottom: "4px" }}>ONESTONE v2 // INTJ STEP II // AI ACTIVE</div>
            <div style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-1px" }}>ZHU XIAYAN <span style={{ fontSize: "8px", letterSpacing: "4px", color: "#2a2a2a", fontWeight: 400 }}>ARCHITECT HUD</span></div>
          </div>
          <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2a2a2a" }}>{clock.toLocaleTimeString("en-GB")} SGT</div>
            <div style={{ display: "flex", gap: "5px" }}>
              <button onClick={() => setPhase("setup")} style={{ fontFamily: "monospace", fontSize: "7px", letterSpacing: "2px", padding: "3px 8px", background: "rgba(255,221,0,0.05)", border: "1px solid rgba(255,221,0,0.18)", color: "#ffdd0077", cursor: "pointer" }}>✎ OKRs</button>
              <button onClick={exportState} style={{ fontFamily: "monospace", fontSize: "7px", letterSpacing: "2px", padding: "3px 8px", background: "transparent", border: "1px solid #222", color: "#333", cursor: "pointer" }}>↓ JSON</button>
              <button onClick={() => { setAiResult(null); setYesterday(""); setTodayConstraint(""); setPhase("checkin"); }} style={{ fontFamily: "monospace", fontSize: "7px", letterSpacing: "2px", padding: "3px 8px", background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.18)", color: "#00ff8877", cursor: "pointer" }}>↺ NEW</button>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "7px", marginBottom: "14px" }}>
          {[["CAREER","#00ff88"],["AI LEARN","#00aaff"],["STARTUP","#aa55ff"],["IP BUILD","#ffdd00"]].map(([l,c]) => (
            <div key={l} style={{ padding: "7px 10px", background: `${c}06`, border: `1px solid ${c}1a`, clipPath: "polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,0 100%)" }}>
              <div style={{ fontSize: "7px", letterSpacing: "3px", color: c }}>{l}</div>
            </div>
          ))}
        </div>
        {warning && <div style={{ padding: "9px 13px", marginBottom: "12px", background: "rgba(255,51,85,0.05)", border: "1px solid rgba(255,51,85,0.22)", fontSize: "9px", color: "#ff3355" }}>⚠ {warning}</div>}
        {error && <div style={{ padding: "9px 13px", marginBottom: "12px", background: "rgba(255,170,0,0.05)", border: "1px solid rgba(255,170,0,0.22)", fontSize: "9px", color: "#ffaa00" }}>⚠ {error}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Panel><Label>// RESOURCE MATRIX</Label>
              <ResourceBar label="HP" icon="◈" value={resources.hp} color="#ff3355" sublabel="PHYSICAL // 16M INFANT DRAIN" />
              <ResourceBar label="MP" icon="◇" value={resources.mp} color="#00aaff" sublabel="LOGIC BW // SOCIAL DRAIN" />
              <ResourceBar label="AP" icon="◆" value={resources.ap} color="#ffdd00" sublabel="ARTICULATION // STREAM C" />
            </Panel>
            <Panel accent="#ffdd00"><Label>// WEEKLY ROCKS</Label>
              {activeRocks.length === 0 && <div style={{ fontSize: "9px", color: "#ff334455" }}>⚠ NO ACTIVE ROCKS</div>}
              {activeRocks.map((rock, i) => { const obj = okrs.objectives.find(o => o.id === rock.objective_id); return (
                <div key={rock.id} style={{ marginBottom: "8px", padding: "8px 10px", background: "rgba(255,221,0,0.04)", border: "1px solid rgba(255,221,0,0.1)" }}>
                  <div style={{ fontSize: "7px", color: "#ffdd0044", letterSpacing: "3px", marginBottom: "3px" }}>ROCK {i+1}</div>
                  <div style={{ fontSize: "9px", color: "#aaa", marginBottom: "4px", lineHeight: 1.4 }}>{rock.rock}</div>
                  {obj && <div style={{ fontSize: "7px", color: "#2e2e2e", lineHeight: 1.4 }}>↳ {obj.objective.slice(0,50)}…</div>}
                </div>
              ); })}
            </Panel>
            {drill && <Panel accent="#ffdd00"><Label>// AP MICRO-DRILL // 5-10 MIN</Label>
              <div style={{ fontSize: "9px", color: "#bbb", lineHeight: 1.7, marginBottom: "7px" }}><TypewriterText text={drill.prompt} speed={16} /></div>
              <div style={{ fontSize: "8px", color: "#ffdd0044", lineHeight: 1.5 }}>{drill.why_today}</div>
            </Panel>}
            <Panel><Label>// INTJ STEP II PARAMS</Label>
              {[["LOGICAL+REASONABLE+TOUGH","5/5/5"],["IMAGINATIVE","5/5 — Novel arch framing"],["PRESSURE-PROMPTED","Out-of-pref — Sprint mode"],["CONTAINED","4/5 — AI monitors overload"],["QUIET","4/5 — Written bias"],].map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "5px", marginBottom: "5px", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                  <span style={{ fontSize: "7px", color: "#252525", flexShrink: 0, marginRight: "8px" }}>{k}</span>
                  <span style={{ fontSize: "7px", color: "#3a3a3a", textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </Panel>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {focus && <Panel accent="#00ff88"><Label>// DAILY DIRECTIVE // ROCK-DERIVED</Label>
              <div style={{ fontSize: "13px", color: "#00ff88", fontWeight: 700, marginBottom: "10px", lineHeight: 1.4, paddingBottom: "10px", borderBottom: "1px solid rgba(0,255,136,0.07)" }}><TypewriterText text={focus.headline} speed={28} /></div>
              {focus.rock_connection && <div style={{ fontSize: "8px", color: "#ffdd0055", marginBottom: "10px", padding: "6px 9px", background: "rgba(255,221,0,0.04)", border: "1px solid rgba(255,221,0,0.08)", lineHeight: 1.5 }}>◈ {focus.rock_connection}</div>}
              <div style={{ marginBottom: "10px" }}>
                <div style={{ fontSize: "7px", letterSpacing: "3px", color: "#252525", marginBottom: "5px" }}>YESTERDAY</div>
                <div style={{ fontSize: "9px", color: "#555", lineHeight: 1.7 }}>{focus.debrief}</div>
              </div>
              <div>
                <div style={{ fontSize: "7px", letterSpacing: "3px", color: "#252525", marginBottom: "5px" }}>MORNING DIRECTIVE</div>
                <div style={{ fontSize: "9px", color: "#666", lineHeight: 1.8 }}><TypewriterText text={focus.morning_directive} speed={10} /></div>
              </div>
            </Panel>}
            {insight && <Panel accent={VECTOR_COLOR[insight.vector]}><Label>// STRATEGIC INSIGHT // {insight.vector}</Label>
              <div style={{ fontSize: "12px", color: VECTOR_COLOR[insight.vector], fontWeight: 700, marginBottom: "9px", lineHeight: 1.4 }}><TypewriterText text={insight.title} speed={38} /></div>
              <div style={{ fontSize: "9px", color: "#555", lineHeight: 1.75 }}><TypewriterText text={insight.body} speed={11} /></div>
            </Panel>}
            <Panel><Label>// QUEST LOG // {aiResult ? "AI-RERANKED" : "DEFAULT"}</Label>
              {mergedQuests.map(({ quest, aiData }) => <QuestCard key={quest.id} quest={quest} aiData={aiData} />)}
            </Panel>
          </div>
        </div>
        <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.025)", display: "flex", justifyContent: "space-between", fontSize: "7px", letterSpacing: "3px", color: "#161616" }}>
          <span>ONESTONE v2 // 一箭四雕 // INTJ STEP II</span>
          <span>ZERO ENTROPY // PRESSURE-PROMPTED</span>
        </div>
      </div>
    </div>
  );
}
