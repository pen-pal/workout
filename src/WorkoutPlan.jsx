import { useState, useEffect, useRef } from "react";

const accent = "#22c55e";
const dark = "#0f172a";
const card = "#1e293b";
const muted = "#94a3b8";
const light = "#f1f5f9";

const weeks = [
  {
    week: 1,
    label: "Week 1 — Foundation",
    rpe: "RPE 7",
    rpeNote: "Leaves ~3 reps in the tank. Focus on form.",
    intensity: "100%",
    tag: "BUILD",
    tagColor: "#3b82f6",
    days: [
      {
        day: "Day 1 — Push (Chest / Shoulders / Triceps)",
        exercises: [
          { name: "Barbell Bench Press", sets: 4, reps: "6–8", rest: "2–3 min", note: "Establish working weight" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "8–10", rest: "90s", note: "" },
          { name: "Cable Lateral Raise", sets: 3, reps: "12–15", rest: "60s", note: "" },
          { name: "Overhead Press (DB)", sets: 3, reps: "8–10", rest: "90s", note: "" },
          { name: "Triceps Rope Pushdown", sets: 3, reps: "12–15", rest: "60s", note: "" },
          { name: "Overhead Triceps Extension", sets: 2, reps: "12", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 2 — Pull (Back / Biceps)",
        exercises: [
          { name: "Barbell Deadlift", sets: 4, reps: "5", rest: "3 min", note: "King of all pulls" },
          { name: "Barbell Bent-Over Row", sets: 4, reps: "6–8", rest: "2 min", note: "" },
          { name: "Lat Pulldown (Wide Grip)", sets: 3, reps: "8–10", rest: "90s", note: "" },
          { name: "Seated Cable Row", sets: 3, reps: "10–12", rest: "90s", note: "" },
          { name: "Dumbbell Curl", sets: 3, reps: "10–12", rest: "60s", note: "" },
          { name: "Face Pulls", sets: 3, reps: "15", rest: "60s", note: "Great for shoulder health" },
        ],
      },
      {
        day: "Day 3 — Legs (Quad Focus)",
        exercises: [
          { name: "Barbell Back Squat", sets: 4, reps: "6–8", rest: "3 min", note: "Depth to parallel or below" },
          { name: "Leg Press", sets: 3, reps: "10–12", rest: "2 min", note: "" },
          { name: "Dumbbell Lunges", sets: 3, reps: "10/leg", rest: "90s", note: "" },
          { name: "Leg Extension", sets: 3, reps: "12–15", rest: "60s", note: "" },
          { name: "Standing Calf Raise", sets: 4, reps: "15–20", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 4 — Push (Shoulders Focus)",
        exercises: [
          { name: "Seated DB Overhead Press", sets: 4, reps: "8–10", rest: "2 min", note: "" },
          { name: "Incline Barbell Press", sets: 3, reps: "8–10", rest: "90s", note: "" },
          { name: "Cable Lateral Raise", sets: 4, reps: "15", rest: "60s", note: "" },
          { name: "Cable Front Raise", sets: 3, reps: "12", rest: "60s", note: "" },
          { name: "Dips (Triceps)", sets: 3, reps: "8–10", rest: "90s", note: "Add weight if bodyweight is easy" },
          { name: "Triceps Overhead Cable Ext.", sets: 3, reps: "12", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 5 — Pull (Back Thickness / Biceps)",
        exercises: [
          { name: "Pull-Ups / Weighted Pull-Ups", sets: 4, reps: "5–8", rest: "2 min", note: "Add weight if 8 is easy" },
          { name: "T-Bar Row", sets: 4, reps: "8–10", rest: "2 min", note: "" },
          { name: "Single Arm DB Row", sets: 3, reps: "10/side", rest: "90s", note: "" },
          { name: "Cable Curl (EZ bar)", sets: 3, reps: "10–12", rest: "60s", note: "" },
          { name: "Hammer Curl", sets: 3, reps: "12", rest: "60s", note: "" },
          { name: "Rear Delt Cable Fly", sets: 3, reps: "15", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 6 — Legs (Hamstring / Glute Focus)",
        exercises: [
          { name: "Romanian Deadlift", sets: 4, reps: "8–10", rest: "2 min", note: "Feel the stretch at the bottom" },
          { name: "Leg Curl (Lying)", sets: 4, reps: "10–12", rest: "90s", note: "" },
          { name: "Bulgarian Split Squat", sets: 3, reps: "8/leg", rest: "90s", note: "" },
          { name: "Hip Thrust (Barbell)", sets: 4, reps: "10–12", rest: "90s", note: "" },
          { name: "Seated Calf Raise", sets: 4, reps: "15–20", rest: "60s", note: "" },
        ],
      },
    ],
  },
  {
    week: 2,
    label: "Week 2 — Load Up",
    rpe: "RPE 8",
    rpeNote: "Leaves ~2 reps in the tank. Start feeling the burn.",
    intensity: "100%",
    tag: "BUILD",
    tagColor: "#f59e0b",
    days: [
      {
        day: "Day 1 — Push",
        exercises: [
          { name: "Barbell Bench Press", sets: 4, reps: "6–8", rest: "2–3 min", note: "Add 2.5–5kg vs Week 1" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "8–10", rest: "90s", note: "Add 2kg each side if 10 reps were clean" },
          { name: "Cable Lateral Raise", sets: 3, reps: "12–15", rest: "60s", note: "Add 1 set if energy allows" },
          { name: "Overhead Press (DB)", sets: 4, reps: "8–10", rest: "90s", note: "+1 set vs Week 1" },
          { name: "Triceps Rope Pushdown", sets: 3, reps: "12–15", rest: "60s", note: "Add weight" },
          { name: "Overhead Triceps Extension", sets: 3, reps: "12", rest: "60s", note: "+1 set vs Week 1" },
        ],
      },
      {
        day: "Day 2 — Pull",
        exercises: [
          { name: "Barbell Deadlift", sets: 4, reps: "5", rest: "3 min", note: "Add 5kg vs Week 1" },
          { name: "Barbell Bent-Over Row", sets: 4, reps: "6–8", rest: "2 min", note: "Add 2.5kg" },
          { name: "Lat Pulldown (Wide Grip)", sets: 4, reps: "8–10", rest: "90s", note: "+1 set" },
          { name: "Seated Cable Row", sets: 3, reps: "10–12", rest: "90s", note: "Add weight" },
          { name: "Dumbbell Curl", sets: 3, reps: "10–12", rest: "60s", note: "Add 1–2kg per hand" },
          { name: "Face Pulls", sets: 3, reps: "15", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 3 — Legs (Quad Focus)",
        exercises: [
          { name: "Barbell Back Squat", sets: 4, reps: "6–8", rest: "3 min", note: "Add 5kg vs Week 1" },
          { name: "Leg Press", sets: 4, reps: "10–12", rest: "2 min", note: "+1 set, add weight" },
          { name: "Dumbbell Lunges", sets: 3, reps: "10/leg", rest: "90s", note: "Heavier DBs" },
          { name: "Leg Extension", sets: 3, reps: "12–15", rest: "60s", note: "Add weight" },
          { name: "Standing Calf Raise", sets: 4, reps: "15–20", rest: "60s", note: "Add weight" },
        ],
      },
      {
        day: "Day 4 — Push (Shoulders Focus)",
        exercises: [
          { name: "Seated DB Overhead Press", sets: 4, reps: "8–10", rest: "2 min", note: "Add 2kg per hand" },
          { name: "Incline Barbell Press", sets: 4, reps: "8–10", rest: "90s", note: "+1 set" },
          { name: "Cable Lateral Raise", sets: 4, reps: "15", rest: "60s", note: "" },
          { name: "Cable Front Raise", sets: 3, reps: "12", rest: "60s", note: "" },
          { name: "Dips (Triceps)", sets: 4, reps: "8–10", rest: "90s", note: "+1 set, add weight if easy" },
          { name: "Triceps Overhead Cable Ext.", sets: 3, reps: "12", rest: "60s", note: "Add weight" },
        ],
      },
      {
        day: "Day 5 — Pull",
        exercises: [
          { name: "Pull-Ups / Weighted Pull-Ups", sets: 4, reps: "5–8", rest: "2 min", note: "Add more weight" },
          { name: "T-Bar Row", sets: 4, reps: "8–10", rest: "2 min", note: "Add weight" },
          { name: "Single Arm DB Row", sets: 4, reps: "10/side", rest: "90s", note: "+1 set" },
          { name: "Cable Curl (EZ bar)", sets: 3, reps: "10–12", rest: "60s", note: "Add weight" },
          { name: "Hammer Curl", sets: 3, reps: "12", rest: "60s", note: "Add 2kg" },
          { name: "Rear Delt Cable Fly", sets: 3, reps: "15", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 6 — Legs (Hamstring / Glute Focus)",
        exercises: [
          { name: "Romanian Deadlift", sets: 4, reps: "8–10", rest: "2 min", note: "Add 5kg" },
          { name: "Leg Curl (Lying)", sets: 4, reps: "10–12", rest: "90s", note: "Add weight" },
          { name: "Bulgarian Split Squat", sets: 4, reps: "8/leg", rest: "90s", note: "+1 set" },
          { name: "Hip Thrust (Barbell)", sets: 4, reps: "10–12", rest: "90s", note: "Add 5–10kg" },
          { name: "Seated Calf Raise", sets: 4, reps: "15–20", rest: "60s", note: "Add weight" },
        ],
      },
    ],
  },
  {
    week: 3,
    label: "Week 3 — Peak Effort",
    rpe: "RPE 9",
    rpeNote: "Leaves ~1 rep in tank. Push hard — this is the money week.",
    intensity: "100%",
    tag: "BUILD",
    tagColor: "#ef4444",
    days: [
      {
        day: "Day 1 — Push",
        exercises: [
          { name: "Barbell Bench Press", sets: 5, reps: "5–6", rest: "3 min", note: "Add 2.5–5kg vs Week 2" },
          { name: "Incline Dumbbell Press", sets: 4, reps: "8–10", rest: "90s", note: "+1 set" },
          { name: "Cable Lateral Raise", sets: 4, reps: "12–15", rest: "60s", note: "+1 set" },
          { name: "Overhead Press (DB)", sets: 4, reps: "8–10", rest: "90s", note: "Add weight" },
          { name: "Triceps Rope Pushdown", sets: 4, reps: "12–15", rest: "60s", note: "+1 set" },
          { name: "Overhead Triceps Extension", sets: 3, reps: "10–12", rest: "60s", note: "Add weight" },
        ],
      },
      {
        day: "Day 2 — Pull",
        exercises: [
          { name: "Barbell Deadlift", sets: 4, reps: "4–5", rest: "3 min", note: "Heaviest yet — brace hard" },
          { name: "Barbell Bent-Over Row", sets: 5, reps: "6–8", rest: "2 min", note: "+1 set" },
          { name: "Lat Pulldown (Wide Grip)", sets: 4, reps: "8–10", rest: "90s", note: "Add weight" },
          { name: "Seated Cable Row", sets: 4, reps: "10–12", rest: "90s", note: "+1 set" },
          { name: "Dumbbell Curl", sets: 4, reps: "10–12", rest: "60s", note: "+1 set" },
          { name: "Face Pulls", sets: 3, reps: "15", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 3 — Legs (Quad Focus)",
        exercises: [
          { name: "Barbell Back Squat", sets: 5, reps: "5–6", rest: "3 min", note: "Add 5kg vs Week 2" },
          { name: "Leg Press", sets: 4, reps: "10–12", rest: "2 min", note: "Add weight" },
          { name: "Dumbbell Lunges", sets: 4, reps: "10/leg", rest: "90s", note: "+1 set" },
          { name: "Leg Extension", sets: 4, reps: "12–15", rest: "60s", note: "+1 set" },
          { name: "Standing Calf Raise", sets: 4, reps: "15–20", rest: "60s", note: "Add weight" },
        ],
      },
      {
        day: "Day 4 — Push (Shoulders Focus)",
        exercises: [
          { name: "Seated DB Overhead Press", sets: 5, reps: "8", rest: "2 min", note: "+1 set, add weight" },
          { name: "Incline Barbell Press", sets: 4, reps: "8–10", rest: "90s", note: "Add weight" },
          { name: "Cable Lateral Raise", sets: 4, reps: "15", rest: "60s", note: "" },
          { name: "Cable Front Raise", sets: 3, reps: "12", rest: "60s", note: "" },
          { name: "Dips (Triceps)", sets: 4, reps: "8–10", rest: "90s", note: "More weight" },
          { name: "Triceps Overhead Cable Ext.", sets: 4, reps: "10–12", rest: "60s", note: "+1 set" },
        ],
      },
      {
        day: "Day 5 — Pull",
        exercises: [
          { name: "Pull-Ups / Weighted Pull-Ups", sets: 5, reps: "5–6", rest: "2 min", note: "+1 set, more weight" },
          { name: "T-Bar Row", sets: 4, reps: "8–10", rest: "2 min", note: "Add weight" },
          { name: "Single Arm DB Row", sets: 4, reps: "10/side", rest: "90s", note: "Add weight" },
          { name: "Cable Curl (EZ bar)", sets: 4, reps: "10–12", rest: "60s", note: "+1 set" },
          { name: "Hammer Curl", sets: 3, reps: "12", rest: "60s", note: "Add weight" },
          { name: "Rear Delt Cable Fly", sets: 4, reps: "15", rest: "60s", note: "+1 set" },
        ],
      },
      {
        day: "Day 6 — Legs (Hamstring / Glute Focus)",
        exercises: [
          { name: "Romanian Deadlift", sets: 5, reps: "8–10", rest: "2 min", note: "+1 set, add weight" },
          { name: "Leg Curl (Lying)", sets: 4, reps: "10–12", rest: "90s", note: "Add weight" },
          { name: "Bulgarian Split Squat", sets: 4, reps: "8/leg", rest: "90s", note: "Add weight" },
          { name: "Hip Thrust (Barbell)", sets: 4, reps: "10–12", rest: "90s", note: "Heaviest yet" },
          { name: "Seated Calf Raise", sets: 4, reps: "15–20", rest: "60s", note: "Add weight" },
        ],
      },
    ],
  },
  {
    week: 4,
    label: "Week 4 — Deload 🔋",
    rpe: "RPE 5–6",
    rpeNote: "Very comfortable. Let your body recover and adapt.",
    intensity: "60%",
    tag: "DELOAD",
    tagColor: "#8b5cf6",
    deloadNote: "Use 60% of Week 3 weights. Drop ALL sets to 3 and reps to 8–10 max. This is NOT a weak week — this is when muscles grow from Weeks 1–3.",
    days: [
      {
        day: "Day 1 — Push (Deload)",
        exercises: [
          { name: "Barbell Bench Press", sets: 3, reps: "8", rest: "2 min", note: "60% of Week 3 weight" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "8", rest: "90s", note: "" },
          { name: "Cable Lateral Raise", sets: 2, reps: "12", rest: "60s", note: "" },
          { name: "Overhead Press (DB)", sets: 3, reps: "8", rest: "90s", note: "" },
          { name: "Triceps Rope Pushdown", sets: 2, reps: "12", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 2 — Pull (Deload)",
        exercises: [
          { name: "Barbell Deadlift", sets: 3, reps: "4", rest: "2 min", note: "Light — focus on technique" },
          { name: "Barbell Bent-Over Row", sets: 3, reps: "8", rest: "90s", note: "60% weight" },
          { name: "Lat Pulldown", sets: 3, reps: "8", rest: "90s", note: "" },
          { name: "Dumbbell Curl", sets: 2, reps: "10", rest: "60s", note: "" },
          { name: "Face Pulls", sets: 2, reps: "15", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 3 — Legs (Deload)",
        exercises: [
          { name: "Barbell Back Squat", sets: 3, reps: "6–8", rest: "2 min", note: "60% weight, perfect form" },
          { name: "Leg Press", sets: 3, reps: "10", rest: "90s", note: "" },
          { name: "Leg Extension", sets: 2, reps: "12", rest: "60s", note: "" },
          { name: "Standing Calf Raise", sets: 3, reps: "15", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 4 — Push (Deload)",
        exercises: [
          { name: "Seated DB Overhead Press", sets: 3, reps: "8", rest: "90s", note: "60% weight" },
          { name: "Incline Barbell Press", sets: 3, reps: "8", rest: "90s", note: "" },
          { name: "Cable Lateral Raise", sets: 2, reps: "12", rest: "60s", note: "" },
          { name: "Dips (Bodyweight)", sets: 2, reps: "8", rest: "60s", note: "Bodyweight only" },
        ],
      },
      {
        day: "Day 5 — Pull (Deload)",
        exercises: [
          { name: "Pull-Ups (Bodyweight)", sets: 3, reps: "5–6", rest: "90s", note: "No added weight" },
          { name: "T-Bar Row", sets: 3, reps: "8", rest: "90s", note: "60% weight" },
          { name: "Cable Curl (EZ bar)", sets: 2, reps: "10", rest: "60s", note: "" },
          { name: "Hammer Curl", sets: 2, reps: "10", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 6 — Legs (Deload)",
        exercises: [
          { name: "Romanian Deadlift", sets: 3, reps: "8", rest: "90s", note: "60% weight, slow and controlled" },
          { name: "Leg Curl (Lying)", sets: 3, reps: "10", rest: "60s", note: "" },
          { name: "Hip Thrust (Barbell)", sets: 3, reps: "10", rest: "90s", note: "60% weight" },
          { name: "Seated Calf Raise", sets: 3, reps: "15", rest: "60s", note: "" },
        ],
      },
    ],
  },
];

const weightStrategy = [
  { rule: "Add weight when", detail: "You complete ALL reps of ALL sets with perfect form and still have energy left (RPE felt lower than target)." },
  { rule: "Add reps first", detail: "If you hit the top of the rep range (e.g. 8 on a 6–8 range), stay at same weight and try for 9–10 next session. Once you hit 10, add weight." },
  { rule: "How much to add", detail: "Big barbell lifts (Squat, Deadlift, Bench): +2.5–5 kg. Dumbbells / cables: +1–2 kg. Never skip the small plates." },
  { rule: "If you fail a set", detail: "Stay at the same weight next session. If you fail again, DROP 10% of the weight and rebuild. Failure 2 sessions in a row = too heavy." },
  { rule: "Log everything", detail: "Write down every weight and rep. You can't progress what you don't track." },
];

const DONE_KEY = "workout.doneSets.v1";

// localStorage helpers, guarded for private mode / quota errors.
function loadDone() {
  try {
    const raw = localStorage.getItem(DONE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
function saveDone(obj) {
  try {
    localStorage.setItem(DONE_KEY, JSON.stringify(obj));
  } catch {
    /* ignore */
  }
}

// Parse a rest string ("90s", "2 min", "2–3 min", "3 min") into seconds.
// For a range, use the upper bound (fuller recovery).
function parseRest(rest) {
  if (!rest) return 0;
  const nums = (rest.match(/\d+/g) || []).map(Number);
  if (nums.length === 0) return 0;
  const value = Math.max(...nums);
  return /min/i.test(rest) ? value * 60 : value;
}

function formatTime(totalSeconds) {
  // ceil so the readout shows 0:01 until truly elapsed (never 0:00 before finish)
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const timerBtn = {
  background: "transparent", color: "#e2e8f0", border: "1px solid #334155",
  borderRadius: 10, padding: "10px 12px", fontSize: 13, fontWeight: 700,
  cursor: "pointer", touchAction: "manipulation", whiteSpace: "nowrap",
  minHeight: 44, WebkitUserSelect: "none", userSelect: "none",
};

export default function WorkoutPlan() {
  const [activeWeek, setActiveWeek] = useState(0);
  const [activeDay, setActiveDay] = useState(0);

  const week = weeks[activeWeek];
  const day = week.days[activeDay];

  // ----- Per-exercise "done" check-off (persisted) -----
  const [done, setDone] = useState(loadDone);
  useEffect(() => { saveDone(done); }, [done]);

  const exKey = (w, d, name) => `${w}:${d}:${name}`;
  const toggleDone = (name) =>
    setDone((prev) => {
      const key = exKey(activeWeek, activeDay, name);
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  const resetDay = () =>
    setDone((prev) => {
      const prefix = `${activeWeek}:${activeDay}:`;
      const next = {};
      for (const k of Object.keys(prev)) if (!k.startsWith(prefix)) next[k] = prev[k];
      return next;
    });
  const doneCount = day.exercises.filter(
    (ex) => done[exKey(activeWeek, activeDay, ex.name)]
  ).length;

  // ----- Rest timer -----
  // timer: null | { total, label, endAt(ms)|null, pausedRemaining(s)|null, finished }
  const [timer, setTimer] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const audioRef = useRef(null);
  const finishedRef = useRef(false);

  const isRunning = !!(timer && timer.endAt != null && !timer.finished);
  const remaining = timer
    ? timer.pausedRemaining != null
      ? timer.pausedRemaining
      : Math.max(0, (timer.endAt - now) / 1000)
    : 0;

  // Tick only while running.
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [isRunning]);

  function beep() {
    try {
      const ctx = audioRef.current;
      if (!ctx) return;
      ctx.resume?.();
      const t0 = ctx.currentTime;
      [0, 0.3, 0.6].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.0001, t0 + offset);
        gain.gain.exponentialRampToValueAtTime(0.3, t0 + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + offset + 0.18);
        osc.start(t0 + offset);
        osc.stop(t0 + offset + 0.2);
      });
    } catch { /* ignore */ }
  }

  // Fire once when the timer reaches zero (running, or paused exactly at 0).
  useEffect(() => {
    if (timer && !timer.finished && remaining <= 0 && !finishedRef.current) {
      finishedRef.current = true;
      setTimer((t) => (t ? { ...t, finished: true, endAt: null } : t));
      navigator.vibrate?.([200, 100, 200]);
      beep();
    }
  }, [isRunning, remaining]);

  // iOS freezes JS timers when the PWA is backgrounded. On return to the
  // foreground, recompute elapsed time immediately and re-arm audio so a
  // timer that expired while away reconciles (and chimes) on reopen.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        audioRef.current?.resume?.();
        setNow(Date.now());
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  function startRest(ex) {
    const secs = parseRest(ex.rest);
    if (!secs) return;
    // Unlock/resume the AudioContext inside the tap gesture so the finish beep works on iOS.
    try {
      if (!audioRef.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audioRef.current = new Ctx();
      }
      audioRef.current?.resume?.();
    } catch { /* ignore */ }
    finishedRef.current = false;
    setNow(Date.now());
    setTimer({ total: secs, label: ex.name, id: exKey(activeWeek, activeDay, ex.name), endAt: Date.now() + secs * 1000, pausedRemaining: null, finished: false });
  }
  function pauseResume() {
    setTimer((t) => {
      if (!t || t.finished) return t;
      if (t.pausedRemaining != null) {
        return { ...t, endAt: Date.now() + t.pausedRemaining * 1000, pausedRemaining: null };
      }
      return { ...t, pausedRemaining: Math.max(0, (t.endAt - Date.now()) / 1000), endAt: null };
    });
  }
  function adjust(deltaSec) {
    finishedRef.current = false;
    setTimer((t) => {
      if (!t) return t;
      if (t.pausedRemaining != null) {
        return { ...t, finished: false, pausedRemaining: Math.max(0, t.pausedRemaining + deltaSec) };
      }
      const rem = Math.max(0, (t.endAt - Date.now()) / 1000);
      return { ...t, finished: false, endAt: Date.now() + (rem + deltaSec) * 1000 };
    });
  }
  function closeTimer() { setTimer(null); finishedRef.current = false; }

  return (
    <div style={{ background: dark, minHeight: "100dvh", color: light, fontFamily: "-apple-system, system-ui, sans-serif", padding: "0 0 calc(60px + env(safe-area-inset-bottom)) 0" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1a2744 100%)", borderBottom: "1px solid #1e293b", padding: "calc(28px + env(safe-area-inset-top)) calc(24px + env(safe-area-inset-right)) 20px calc(24px + env(safe-area-inset-left))" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: accent, color: "#000", fontWeight: 700, fontSize: 11, padding: "3px 10px", borderRadius: 20, letterSpacing: 1 }}>PPL SPLIT</span>
            <span style={{ color: muted, fontSize: 12 }}>6 Days / Week · Intermediate · 90 kg · 185 cm</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>4-Week Progressive Overload Plan</h1>
          <p style={{ color: muted, margin: "6px 0 0", fontSize: 13 }}>Goal: Muscle Gain + Fat Loss · No Injuries</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 calc(16px + env(safe-area-inset-right)) 0 calc(16px + env(safe-area-inset-left))" }}>

        {/* Sticky selectors (week + day) — full-bleed so the pinned bar covers edge-to-edge */}
        <div style={{
          position: "sticky", top: "env(safe-area-inset-top)", zIndex: 20,
          background: dark, paddingTop: 12, paddingBottom: 10,
          borderBottom: "1px solid #1e293b",
          margin: "0 calc(-16px - env(safe-area-inset-right)) 0 calc(-16px - env(safe-area-inset-left))",
          paddingLeft: "calc(16px + env(safe-area-inset-left))",
          paddingRight: "calc(16px + env(safe-area-inset-right))"
        }}>
          {/* Week Selector */}
          <div className="no-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            {weeks.map((w, i) => (
              <button key={i} onClick={() => { setActiveWeek(i); setActiveDay(0); }}
                style={{
                  background: activeWeek === i ? w.tagColor : card,
                  color: activeWeek === i ? "#fff" : muted,
                  border: activeWeek === i ? "none" : `1px solid #334155`,
                  borderRadius: 10, padding: "10px 18px", fontWeight: 700, fontSize: 13,
                  cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
                  minHeight: 44, display: "inline-flex", alignItems: "center", justifyContent: "center",
                  touchAction: "manipulation",
                  boxShadow: activeWeek === i ? `0 0 20px ${w.tagColor}44` : "none"
                }}>
                {`Week ${w.week}`}
                {w.tag === "DELOAD" && <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.8 }}>🔋</span>}
              </button>
            ))}
          </div>
          {/* Day Selector */}
          <div className="no-scrollbar" style={{ display: "flex", gap: 6, marginTop: 8, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            {week.days.map((d, i) => (
              <button key={i} onClick={() => setActiveDay(i)}
                style={{
                  background: activeDay === i ? accent : card,
                  color: activeDay === i ? "#000" : muted,
                  border: activeDay === i ? "none" : "1px solid #334155",
                  borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 13,
                  cursor: "pointer", whiteSpace: "nowrap",
                  minHeight: 44, minWidth: 48, display: "inline-flex", alignItems: "center", justifyContent: "center",
                  touchAction: "manipulation"
                }}>
                Day {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Week Info Card */}
        <div style={{ background: card, borderRadius: 14, padding: "18px 20px", marginTop: 16, border: `1px solid ${week.tagColor}44`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, background: week.tagColor, padding: "4px 14px", borderRadius: "0 14px 0 14px", fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>{week.tag}</div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700 }}>{week.label}</h2>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span style={{ background: "#0f172a", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 700, color: accent }}>{week.rpe}</span>
            <span style={{ background: "#0f172a", borderRadius: 8, padding: "4px 12px", fontSize: 13, color: muted }}>Intensity: {week.intensity}</span>
          </div>
          <p style={{ color: muted, fontSize: 13, margin: "10px 0 0" }}>{week.rpeNote}</p>
          {week.deloadNote && (
            <div style={{ background: "#2d1f6e", borderRadius: 8, padding: "10px 14px", marginTop: 10, fontSize: 12, color: "#c4b5fd", lineHeight: 1.6 }}>
              ⚡ {week.deloadNote}
            </div>
          )}
        </div>

        {/* Exercise Table */}
        <div style={{ background: card, borderRadius: 14, marginTop: 12, overflow: "hidden", border: "1px solid #334155" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #334155", background: "#1a2744", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: accent }}>{day.day}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", color: doneCount === day.exercises.length ? accent : muted }}>
                {doneCount}/{day.exercises.length} done
              </span>
              {doneCount > 0 && (
                <button onClick={resetDay}
                  style={{ background: "transparent", border: "1px solid #334155", color: muted, borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation", WebkitUserSelect: "none", userSelect: "none" }}>
                  Reset
                </button>
              )}
            </div>
          </div>
          <div className="no-scrollbar" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  {["✓", "Exercise", "Sets", "Reps", "Rest", "Note"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: muted, fontWeight: 600, fontSize: 11, letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((ex, i) => {
                  const isDone = !!done[exKey(activeWeek, activeDay, ex.name)];
                  const restSecs = parseRest(ex.rest);
                  const isActiveRest = !!(timer && timer.id === exKey(activeWeek, activeDay, ex.name));
                  return (
                  <tr key={i} style={{ borderTop: "1px solid #1e293b", background: i % 2 === 0 ? "transparent" : "#1a2234", opacity: isDone ? 0.45 : 1, transition: "opacity 0.2s" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <button onClick={() => toggleDone(ex.name)} aria-label={isDone ? "Mark not done" : "Mark done"}
                        style={{
                          width: 30, height: 30, borderRadius: "50%", cursor: "pointer", touchAction: "manipulation",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 800, WebkitUserSelect: "none", userSelect: "none",
                          background: isDone ? accent : "transparent",
                          color: isDone ? "#000" : muted,
                          border: isDone ? "none" : "1.5px solid #334155"
                        }}>
                        {isDone ? "✓" : String(i + 1).padStart(2, "0")}
                      </button>
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: light, textDecoration: isDone ? "line-through" : "none" }}>{ex.name}</td>
                    <td style={{ padding: "12px 14px", color: accent, fontWeight: 700 }}>{ex.sets}</td>
                    <td style={{ padding: "12px 14px", color: "#fbbf24", fontWeight: 600 }}>{ex.reps}</td>
                    <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                      {restSecs > 0 ? (
                        <button onClick={() => startRest(ex)} aria-label={`Start ${ex.rest} rest timer`}
                          style={{
                            background: isActiveRest ? accent : "transparent",
                            color: isActiveRest ? "#000" : muted,
                            border: isActiveRest ? "none" : "1px solid #334155",
                            borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700,
                            cursor: "pointer", touchAction: "manipulation", whiteSpace: "nowrap",
                            WebkitUserSelect: "none", userSelect: "none",
                            display: "inline-flex", alignItems: "center", gap: 5
                          }}>
                          <span style={{ fontSize: 10 }}>▶</span>{ex.rest}
                        </button>
                      ) : (
                        <span style={{ color: muted }}>{ex.rest}</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#cbd5e1", fontSize: 13 }}>{ex.note || "—"}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Progression Strategy */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: accent, fontSize: 14, fontWeight: 700, letterSpacing: 0.5, margin: "0 0 12px" }}>⚡ WEIGHT PROGRESSION RULES</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {weightStrategy.map((s, i) => (
              <div key={i} style={{ background: card, borderRadius: 10, padding: "12px 16px", border: "1px solid #334155", display: "flex", gap: 12 }}>
                <span style={{ background: "#1e293b", borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, color: accent, whiteSpace: "nowrap", height: "fit-content", marginTop: 2 }}>{s.rule}</span>
                <span style={{ color: muted, fontSize: 13, lineHeight: 1.6 }}>{s.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Week-by-Week Progression Summary */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: accent, fontSize: 14, fontWeight: 700, letterSpacing: 0.5, margin: "0 0 12px" }}>📈 WEEKLY PROGRESSION SUMMARY</h3>
          <div style={{ background: card, borderRadius: 14, overflow: "hidden", border: "1px solid #334155" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  {["Week", "RPE Target", "Volume Change", "Weight Change", "Focus"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { w: "Week 1", rpe: "RPE 7", vol: "Base volume", wt: "Establish weights", focus: "Technique + feel", color: "#3b82f6" },
                  { w: "Week 2", rpe: "RPE 8", vol: "+1 set on main lifts", wt: "+2.5–5 kg on compounds", focus: "Add load", color: "#f59e0b" },
                  { w: "Week 3", rpe: "RPE 9", vol: "+1 more set (peak)", wt: "+2.5–5 kg again", focus: "Max effort", color: "#ef4444" },
                  { w: "Week 4", rpe: "RPE 5–6", vol: "Drop to 3 sets", wt: "60% of Week 3", focus: "Deload & recover", color: "#8b5cf6" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #1e293b" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: row.color }}>{row.w}</td>
                    <td style={{ padding: "12px 14px", color: accent, fontWeight: 600 }}>{row.rpe}</td>
                    <td style={{ padding: "12px 14px", color: light }}>{row.vol}</td>
                    <td style={{ padding: "12px 14px", color: light }}>{row.wt}</td>
                    <td style={{ padding: "12px 14px", color: muted, fontSize: 12 }}>{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Month 2 CTA */}
        <div style={{ marginTop: 28, background: "linear-gradient(135deg, #1a1a3e, #1e293b)", borderRadius: 16, padding: "22px 24px", border: "1px solid #4c1d95" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#c4b5fd", marginBottom: 10 }}>🚀 Month 2 ke liye ye details bhejo:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Week 1–3 mein kin exercises mein weight badha paye aur kitna?",
              "Koi exercise jisme progress nahi hua (we'll swap or fix it)",
              "Average body weight at end of Month 1",
              "Energy levels: high / medium / low throughout the month",
              "Sleep quality: 7+ hrs / less than 7 hrs",
              "Diet: rough calorie intake (surplus / deficit / maintenance)",
              "Koi nayi injury ya discomfort?",
              "Weakest body part jisme tum zyada focus chahte ho",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "#a78bfa", fontWeight: 700, minWidth: 20, fontSize: 13 }}>{i + 1}.</span>
                <span style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating rest timer */}
      {timer && (
        <div style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 30,
          background: timer.finished ? accent : "#1a2744",
          borderTop: `1px solid ${timer.finished ? accent : "#334155"}`,
          padding: "12px calc(16px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left))",
          boxShadow: "0 -8px 24px rgba(0,0,0,0.4)"
        }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: timer.finished ? "#052e16" : muted }}>
                  {timer.finished ? "Rest complete" : "Rest"} · {timer.label}
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1, fontVariantNumeric: "tabular-nums", color: timer.finished ? "#000" : light }}>
                  {timer.finished ? "Go! 💪" : formatTime(remaining)}
                </div>
              </div>
              {!timer.finished && (
                <>
                  <button onClick={() => adjust(-15)} style={timerBtn}>−15s</button>
                  <button onClick={() => adjust(15)} style={timerBtn}>+15s</button>
                  <button onClick={pauseResume} style={{ ...timerBtn, background: accent, color: "#000", border: "none" }}>
                    {timer.pausedRemaining != null ? "Resume" : "Pause"}
                  </button>
                </>
              )}
              <button onClick={closeTimer} aria-label="Close timer"
                style={{ ...timerBtn, fontWeight: 800, background: timer.finished ? "#000" : "transparent", color: timer.finished ? accent : muted, border: timer.finished ? "none" : "1px solid #334155" }}>
                {timer.finished ? "Done" : "✕"}
              </button>
            </div>
            {!timer.finished && (
              <div style={{ height: 4, background: "#0f172a", borderRadius: 4, marginTop: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${timer.total ? (remaining / timer.total) * 100 : 0}%`, background: accent, transition: "width 0.25s linear" }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
