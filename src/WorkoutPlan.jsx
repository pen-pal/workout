import { useState, useEffect, useRef } from "react";

const accent = "#22c55e";
const dark = "#0f172a";
const card = "#1e293b";
const muted = "#94a3b8";
const light = "#f1f5f9";

// Initial workout structure - THIS IS YOUR BASE DATA
const initialWeeks = [
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
          { name: "Deadlift", sets: 3, reps: "5", rest: "3–5 min", note: "Heavy, focus on form" },
          { name: "Pull-Ups", sets: 3, reps: "8–10", rest: "90s", note: "Add weight if needed" },
          { name: "Barbell Row", sets: 3, reps: "8–10", rest: "90s", note: "" },
          { name: "Face Pulls", sets: 3, reps: "15–20", rest: "60s", note: "" },
          { name: "Barbell Curl", sets: 3, reps: "10–12", rest: "60s", note: "" },
          { name: "Hammer Curl", sets: 2, reps: "12", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 3 — Legs (Quads / Hamstrings / Calves)",
        exercises: [
          { name: "Back Squat", sets: 4, reps: "6–8", rest: "3 min", note: "Establish working weight" },
          { name: "Romanian Deadlift", sets: 3, reps: "8–10", rest: "90s", note: "" },
          { name: "Leg Press", sets: 3, reps: "10–12", rest: "90s", note: "" },
          { name: "Leg Curl", sets: 3, reps: "12–15", rest: "60s", note: "" },
          { name: "Calf Raise", sets: 4, reps: "15–20", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 4 — Push (Chest / Shoulders / Triceps)",
        exercises: [
          { name: "Incline Barbell Press", sets: 4, reps: "8–10", rest: "2 min", note: "" },
          { name: "Flat DB Press", sets: 3, reps: "10–12", rest: "90s", note: "" },
          { name: "Lateral Raise", sets: 4, reps: "12–15", rest: "60s", note: "" },
          { name: "Triceps Pushdown", sets: 3, reps: "12–15", rest: "60s", note: "" },
          { name: "Skullcrushers", sets: 2, reps: "10–12", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 5 — Pull (Back / Biceps)",
        exercises: [
          { name: "Lat Pulldown", sets: 4, reps: "8–10", rest: "90s", note: "" },
          { name: "Seated Cable Row", sets: 3, reps: "10–12", rest: "90s", note: "" },
          { name: "Single-Arm DB Row", sets: 3, reps: "10–12", rest: "60s", note: "" },
          { name: "Reverse Fly", sets: 3, reps: "15–20", rest: "60s", note: "" },
          { name: "Preacher Curl", sets: 3, reps: "10–12", rest: "60s", note: "" },
        ],
      },
      {
        day: "Day 6 — Legs (Quads / Hamstrings / Calves)",
        exercises: [
          { name: "Front Squat", sets: 3, reps: "8–10", rest: "2–3 min", note: "" },
          { name: "Leg Extension", sets: 3, reps: "12–15", rest: "60s", note: "" },
          { name: "Lying Leg Curl", sets: 3, reps: "12–15", rest: "60s", note: "" },
          { name: "Bulgarian Split Squat", sets: 3, reps: "10–12", rest: "60s", note: "" },
          { name: "Seated Calf Raise", sets: 4, reps: "15–20", rest: "60s", note: "" },
        ],
      },
    ],
  },
  {
    week: 2,
    label: "Week 2 — Build",
    rpe: "RPE 8",
    rpeNote: "Leaves ~2 reps in the tank. Add weight/reps.",
    intensity: "100%",
    tag: "BUILD",
    tagColor: "#f59e0b",
    days: [
      {
        day: "Day 1 — Push (Chest / Shoulders / Triceps)",
        exercises: [
          { name: "Barbell Bench Press", sets: 4, reps: "6–8", rest: "2–3 min", note: "Add 2.5–5 kg" },
          { name: "Incline Dumbbell Press", sets: 4, reps: "8–10", rest: "90s", note: "+1 set" },
          { name: "Cable Lateral Raise", sets: 3, reps: "12–15", rest: "60s", note: "" },
          { name: "Overhead Press (DB)", sets: 3, reps: "8–10", rest: "90s", note: "" },
          { name: "Triceps Rope Pushdown", sets: 3, reps: "12–15", rest: "60s", note: "" },
          { name: "Overhead Triceps Extension", sets: 2, reps: "12", rest: "60s", note: "" },
        ],
      },
      { day: "Day 2 — Pull (Back / Biceps)", exercises: [] },
      { day: "Day 3 — Legs (Quads / Hamstrings / Calves)", exercises: [] },
      { day: "Day 4 — Push (Chest / Shoulders / Triceps)", exercises: [] },
      { day: "Day 5 — Pull (Back / Biceps)", exercises: [] },
      { day: "Day 6 — Legs (Quads / Hamstrings / Calves)", exercises: [] },
    ],
  },
  {
    week: 3,
    label: "Week 3 — Peak",
    rpe: "RPE 9",
    rpeNote: "Leaves ~1 rep in the tank. Max effort.",
    intensity: "100%",
    tag: "BUILD",
    tagColor: "#ef4444",
    days: [
      {
        day: "Day 1 — Push (Chest / Shoulders / Triceps)",
        exercises: [
          { name: "Barbell Bench Press", sets: 5, reps: "6–8", rest: "2–3 min", note: "Add 2.5–5 kg again" },
          { name: "Incline Dumbbell Press", sets: 4, reps: "8–10", rest: "90s", note: "" },
          { name: "Cable Lateral Raise", sets: 4, reps: "12–15", rest: "60s", note: "+1 set" },
          { name: "Overhead Press (DB)", sets: 4, reps: "8–10", rest: "90s", note: "+1 set" },
          { name: "Triceps Rope Pushdown", sets: 3, reps: "12–15", rest: "60s", note: "" },
          { name: "Overhead Triceps Extension", sets: 2, reps: "12", rest: "60s", note: "" },
        ],
      },
      { day: "Day 2 — Pull (Back / Biceps)", exercises: [] },
      { day: "Day 3 — Legs (Quads / Hamstrings / Calves)", exercises: [] },
      { day: "Day 4 — Push (Chest / Shoulders / Triceps)", exercises: [] },
      { day: "Day 5 — Pull (Back / Biceps)", exercises: [] },
      { day: "Day 6 — Legs (Quads / Hamstrings / Calves)", exercises: [] },
    ],
  },
  {
    week: 4,
    label: "Week 4 — Deload",
    rpe: "RPE 5–6",
    rpeNote: "Active recovery. Focus on mobility and technique.",
    intensity: "60%",
    tag: "DELOAD",
    tagColor: "#8b5cf6",
    deloadNote: "Reduce all weights to 60% of Week 3. Drop to 3 sets per exercise.",
    days: [
      { day: "Day 1 — Push (Chest / Shoulders / Triceps)", exercises: [] },
      { day: "Day 2 — Pull (Back / Biceps)", exercises: [] },
      { day: "Day 3 — Legs (Quads / Hamstrings / Calves)", exercises: [] },
      { day: "Day 4 — Push (Chest / Shoulders / Triceps)", exercises: [] },
      { day: "Day 5 — Pull (Back / Biceps)", exercises: [] },
      { day: "Day 6 — Legs (Quads / Hamstrings / Calves)", exercises: [] },
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

function formatTime(totalSeconds) {
  if (totalSeconds == null || isNaN(totalSeconds)) return "0:00";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parseRest(restStr) {
  if (!restStr) return 0;
  const num = parseInt(restStr.replace(/\D/g, ""), 10);
  if (restStr.includes("min")) return num * 60;
  return num || 0;
}

function exKey(weekIdx, dayIdx, exName) {
  return `w${weekIdx}_d${dayIdx}_${exName.replace(/\s+/g, "_").toLowerCase()}`;
}

// API helpers for Google Sheets
async function fetchWorkoutData(username) {
  try {
    const response = await fetch(`/api/workout-data?username=${username}`);
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
  return [];
}

async function saveWorkoutData(data) {
  try {
    const response = await fetch('/api/workout-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to save data:', error);
    return { success: false };
  }
}

export default function WorkoutPlan() {
  const [username, setUsername] = useState(() => localStorage.getItem("workout_username") || "");
  const [showUsernameModal, setShowUsernameModal] = useState(() => !localStorage.getItem("workout_username"));
  const [activeWeek, setActiveWeek] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [weeks, setWeeks] = useState(initialWeeks);
  const [done, setDone] = useState({});
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [timer, setTimer] = useState(null);
  const timerRef = useRef(null);
  const remainingRef = useRef(0);

  // Load data from Google Sheet when username is set
  useEffect(() => {
    if (username) {
      loadUserData();
    }
  }, [username]);

  async function loadUserData() {
    setLoading(true);
    setSyncStatus('syncing');
    
    try {
      const data = await fetchWorkoutData(username);
      
      // Update done status from sheet
      const doneMap = {};
      data.forEach(row => {
        if (row.completed) {
          const key = exKey(row.week - 1, row.day - 1, row.exercise);
          doneMap[key] = true;
        }
      });
      setDone(doneMap);
      
      setSyncStatus('synced');
    } catch (error) {
      console.error('Error loading data:', error);
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  }

  async function syncExerciseData(weekIdx, dayIdx, exName, completed) {
    const exercise = weeks[weekIdx].days[dayIdx].exercises.find(e => e.name === exName);
    const data = {
      username,
      week: weekIdx + 1,
      day: dayIdx + 1,
      exercise: exName,
      sets: exercise?.sets || 0,
      reps: exercise?.reps || '',
      rest: exercise?.rest || '',
      note: exercise?.note || '',
      completed,
    };
  
    setSyncStatus('syncing');
    
    try {
      const result = await saveWorkoutData(data);
      
      if (result.success) {
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 2000);
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
    }
  }
  
  useEffect(() => {
    if (username) {
      localStorage.setItem("workout_username", username);
    }
  }, [username]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const week = weeks[activeWeek];
  const day = week.days[activeDay];
  const doneCount = day.exercises.filter((ex) => done[exKey(activeWeek, activeDay, ex.name)]).length;

  function toggleDone(exName) {
    const key = exKey(activeWeek, activeDay, exName);
    const newCompleted = !done[key];
    
    setDone((prev) => ({ ...prev, [key]: newCompleted }));
    syncExerciseData(activeWeek, activeDay, exName, newCompleted);
  }

  function resetDay() {
    const newDone = { ...done };
    day.exercises.forEach((ex) => {
      delete newDone[exKey(activeWeek, activeDay, ex.name)];
    });
    setDone(newDone);
  }

  function startRest(ex) {
    const secs = parseRest(ex.rest);
    if (secs === 0) return;
    const id = exKey(activeWeek, activeDay, ex.name);
    setTimer({ id, label: ex.name, total: secs, remaining: secs, pausedRemaining: null, finished: false });
    remainingRef.current = secs;
    timerRef.current = setInterval(() => {
      remainingRef.current -= 1;
      if (remainingRef.current <= 0) {
        clearInterval(timerRef.current);
        setTimer((t) => ({ ...t, remaining: 0, finished: true }));
        try {
          const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ4PVqzn8K1hGgU7k9r0z3kpBS2A0PLaizsIGGS57OihURALTqXh8bllHAU2jdXzyn0tBSp+zfDdkUEKFWCy6+qnVRQLSKDh8r5uIQU0h9Hy04IzBh1rv+/mnVIOD1Wr5O+rYRoFOpHZ88p6KgUte87w15Y9CRZhtuvqp1QWCkef4PK9bSIFM4XP8tWDMwYfbsPv5p1SDg9Uq+Tvq2EbBTmP2PPKfC0FKn7N8NqSOwoYY7bt6qdUFgpHn+Dyvmwi");
          audio.play();
        } catch {}
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      } else {
        setTimer((t) => ({ ...t, remaining: remainingRef.current }));
      }
    }, 1000);
  }

  function adjust(delta) {
    if (!timer || timer.finished) return;
    clearInterval(timerRef.current);
    const newRemaining = Math.max(0, (timer.pausedRemaining != null ? timer.pausedRemaining : timer.remaining) + delta);
    remainingRef.current = newRemaining;
    setTimer((t) => ({ ...t, remaining: newRemaining, pausedRemaining: newRemaining }));
  }

  function togglePause() {
    if (!timer || timer.finished) return;
    if (timer.pausedRemaining == null) {
      clearInterval(timerRef.current);
      setTimer((t) => ({ ...t, pausedRemaining: t.remaining }));
    } else {
      remainingRef.current = timer.pausedRemaining;
      timerRef.current = setInterval(() => {
        remainingRef.current -= 1;
        if (remainingRef.current <= 0) {
          clearInterval(timerRef.current);
          setTimer((t) => ({ ...t, remaining: 0, finished: true, pausedRemaining: null }));
          try {
            const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ4PVqzn8K1hGgU7k9r0z3kpBS2A0PLaizsIGGS57OihURALTqXh8bllHAU2jdXzyn0tBSp+zfDdkUEKFWCy6+qnVRQLSKDh8r5uIQU0h9Hy04IzBh1rv+/mnVIOD1Wr5O+rYRoFOpHZ88p6KgUte87w15Y9CRZhtuvqp1QWCkef4PK9bSIFM4XP8tWDMwYfbsPv5p1SDg9Uq+Tvq2EbBTmP2PPKfC0FKn7N8NqSOwoYY7bt6qdUFgpHn+Dyvmwi");
            audio.play();
          } catch {}
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        } else {
          setTimer((t) => ({ ...t, remaining: remainingRef.current }));
        }
      }, 1000);
      setTimer((t) => ({ ...t, pausedRemaining: null }));
    }
  }

  function closeTimer() {
    clearInterval(timerRef.current);
    setTimer(null);
  }

  // Update exercise data (sets, reps)
  function updateExercise(weekIdx, dayIdx, exName, field, value) {
    const newWeeks = [...weeks];
    const exercise = newWeeks[weekIdx].days[dayIdx].exercises.find(ex => ex.name === exName);
    if (exercise) {
      exercise[field] = value;
      setWeeks(newWeeks);
    }
  }

  function handleUsernameSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUsername = formData.get("username").trim();
    if (newUsername) {
      setUsername(newUsername);
      setShowUsernameModal(false);
    }
  }

  function switchUser() {
    setUsername("");
    localStorage.removeItem("workout_username");
    setShowUsernameModal(true);
    setDone({});
  }

  if (showUsernameModal) {
    return (
      <div style={{
        minHeight: "100vh",
        background: dark,
        color: light,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}>
        <div style={{
          background: card,
          borderRadius: 16,
          padding: 32,
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800 }}>
            Welcome to Workout Plan
          </h1>
          <p style={{ margin: "0 0 24px", color: muted }}>
            Enter your username to start tracking your workouts
          </p>
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Your username"
              required
              autoFocus
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: 16,
                borderRadius: 8,
                border: "2px solid #334155",
                background: dark,
                color: light,
                marginBottom: 16,
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 8,
                border: "none",
                background: accent,
                color: "#000",
                cursor: "pointer",
              }}
            >
              Start Workout
            </button>
          </form>
          <p style={{ marginTop: 16, fontSize: 12, color: muted }}>
            Your progress will be saved to the cloud
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: dark,
      color: light,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      paddingBottom: 100,
    }}>
      {/* Header */}
      <header style={{
        padding: "12px 16px",
        background: card,
        borderBottom: "1px solid #334155",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: muted }}>PPL SPLIT · 6 Days / Week · Intermediate</div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>4-Week Progressive Overload Plan</h1>
            <div style={{ fontSize: 14, color: muted }}>Goal: Muscle Gain + Fat Loss · No Injuries</div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {loading && <span style={{ color: muted, fontSize: 12 }}>Loading...</span>}
            {syncStatus === 'syncing' && <span style={{ color: "#f59e0b", fontSize: 12 }}>Syncing...</span>}
            {syncStatus === 'synced' && <span style={{ color: accent, fontSize: 12 }}>✓ Saved</span>}
            {syncStatus === 'error' && <span style={{ color: "#ef4444", fontSize: 12 }}>Sync error</span>}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: muted }}>Logged in as</div>
              <div style={{ fontWeight: 700, color: accent }}>{username}</div>
            </div>
            <button
              onClick={switchUser}
              style={{
                padding: "8px 12px",
                background: "transparent",
                border: "1px solid #334155",
                color: muted,
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Switch User
            </button>
          </div>
        </div>
      </header>

      {/* Sticky week selector */}
      <div style={{
        position: "sticky",
        top: 120,
        background: dark,
        zIndex: 5,
        padding: "12px 0",
        borderBottom: "1px solid #334155",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", display: "flex", gap: 8, overflowX: "auto" }}>
          {weeks.map((w, i) => (
            <button
              key={w.week}
              onClick={() => { setActiveWeek(i); setActiveDay(0); }}
              style={{
                padding: "10px 16px",
                background: i === activeWeek ? w.tagColor : card,
                color: i === activeWeek ? "#000" : light,
                border: "none",
                borderRadius: 8,
                fontWeight: i === activeWeek ? 800 : 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontSize: 14,
              }}
            >
              Week {w.week} {i === activeWeek && `· ${w.tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* Sticky day selector */}
      <div style={{
        position: "sticky",
        top: 185,
        background: dark,
        zIndex: 5,
        padding: "12px 0",
        borderBottom: "1px solid #334155",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", display: "flex", gap: 8, overflowX: "auto" }}>
          {week.days.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              style={{
                padding: "10px 16px",
                background: i === activeDay ? accent : card,
                color: i === activeDay ? "#000" : light,
                border: "none",
                borderRadius: 8,
                fontWeight: i === activeDay ? 800 : 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontSize: 14,
              }}
            >
              Day {i + 1}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        {/* Week Info Card */}
        <section style={{
          background: card,
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          border: `2px solid ${week.tagColor}`,
        }}>
          <div style={{
            display: "inline-block",
            background: week.tagColor,
            color: "#000",
            padding: "4px 12px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 800,
            marginBottom: 8,
          }}>
            {week.tag}
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800 }}>{week.label}</h2>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{
              background: dark,
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 700,
              color: accent,
            }}>
              {week.rpe}
            </div>
            <div style={{ color: muted, fontSize: 14 }}>Intensity: {week.intensity}</div>
          </div>
          <p style={{ margin: "12px 0 0", color: muted }}>{week.rpeNote}</p>
          {week.deloadNote && (
            <div style={{
              marginTop: 12,
              padding: 12,
              background: "rgba(139, 92, 246, 0.1)",
              borderLeft: `3px solid #8b5cf6`,
              borderRadius: 6,
              color: "#c4b5fd",
              fontSize: 14,
            }}>
              ⚡ {week.deloadNote}
            </div>
          )}
        </section>

        {/* Exercise Table */}
        <section style={{ background: card, borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ padding: 16, borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{day.day}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: muted, fontSize: 14 }}>{doneCount}/{day.exercises.length} done</span>
              {doneCount > 0 && (
                <button
                  onClick={resetDay}
                  style={{
                    padding: "6px 12px",
                    background: "transparent",
                    border: "1px solid #ef4444",
                    color: "#ef4444",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead style={{ background: dark }}>
                <tr>
                  {["✓", "Exercise", "Sets", "Reps", "Rest", "Note"].map(h => (
                    <th key={h} style={{
                      padding: 12,
                      textAlign: "left",
                      fontWeight: 700,
                      borderBottom: "2px solid #334155",
                      color: muted,
                      fontSize: 12,
                      textTransform: "uppercase",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((ex, i) => {
                  const isDone = !!done[exKey(activeWeek, activeDay, ex.name)];
                  const restSecs = parseRest(ex.rest);
                  const isActiveRest = !!(timer && timer.id === exKey(activeWeek, activeDay, ex.name));
                  return (
                    <tr key={ex.name} style={{
                      opacity: isDone ? 0.5 : 1,
                      borderBottom: "1px solid #334155",
                    }}>
                      <td style={{ padding: 12 }}>
                        <button
                          onClick={() => toggleDone(ex.name)}
                          aria-label={isDone ? "Mark not done" : "Mark done"}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            cursor: "pointer",
                            touchAction: "manipulation",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 800,
                            WebkitUserSelect: "none",
                            userSelect: "none",
                            background: isDone ? accent : "transparent",
                            color: isDone ? "#000" : muted,
                            border: isDone ? "none" : "1.5px solid #334155",
                          }}
                        >
                          {isDone ? "✓" : String(i + 1).padStart(2, "0")}
                        </button>
                      </td>
                      <td style={{ padding: 12, fontWeight: 600 }}>{ex.name}</td>
                      <td style={{ padding: 12 }}>
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => updateExercise(activeWeek, activeDay, ex.name, "sets", parseInt(e.target.value) || 0)}
                          style={{
                            width: 50,
                            padding: "4px 8px",
                            background: dark,
                            border: "1px solid #334155",
                            borderRadius: 4,
                            color: light,
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        />
                      </td>
                      <td style={{ padding: 12 }}>
                        <input
                          type="text"
                          value={ex.reps}
                          onChange={(e) => updateExercise(activeWeek, activeDay, ex.name, "reps", e.target.value)}
                          style={{
                            width: 70,
                            padding: "4px 8px",
                            background: dark,
                            border: "1px solid #334155",
                            borderRadius: 4,
                            color: accent,
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        />
                      </td>
                      <td style={{ padding: 12 }}>
                        {restSecs > 0 ? (
                          <button
                            onClick={() => startRest(ex)}
                            aria-label={`Start ${ex.rest} rest timer`}
                            style={{
                              background: isActiveRest ? accent : "transparent",
                              color: isActiveRest ? "#000" : muted,
                              border: isActiveRest ? "none" : "1px solid #334155",
                              borderRadius: 8,
                              padding: "6px 10px",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              touchAction: "manipulation",
                              whiteSpace: "nowrap",
                              WebkitUserSelect: "none",
                              userSelect: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            ▶ {ex.rest}
                          </button>
                        ) : (
                          <span style={{ color: muted }}>{ex.rest || "—"}</span>
                        )}
                      </td>
                      <td style={{ padding: 12, color: muted }}>{ex.note || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Progression Strategy */}
        <section style={{ background: card, borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>⚡ WEIGHT PROGRESSION RULES</h3>
          {weightStrategy.map((s, i) => (
            <div key={i} style={{
              padding: 12,
              background: dark,
              borderRadius: 8,
              marginBottom: i < weightStrategy.length - 1 ? 8 : 0,
            }}>
              <div style={{ fontWeight: 700, color: accent, marginBottom: 4 }}>{s.rule}</div>
              <div style={{ color: muted, fontSize: 14 }}>{s.detail}</div>
            </div>
          ))}
        </section>

        {/* Week-by-Week Progression Summary */}
        <section style={{ background: card, borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ padding: 16, borderBottom: "1px solid #334155" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>📈 WEEKLY PROGRESSION SUMMARY</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead style={{ background: dark }}>
                <tr>
                  {["Week", "RPE Target", "Volume Change", "Weight Change", "Focus"].map(h => (
                    <th key={h} style={{
                      padding: 12,
                      textAlign: "left",
                      fontWeight: 700,
                      borderBottom: "2px solid #334155",
                      color: muted,
                      fontSize: 12,
                    }}>
                      {h}
                    </th>
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
                  <tr key={i} style={{ borderBottom: i < 3 ? "1px solid #334155" : "none" }}>
                    <td style={{ padding: 12, fontWeight: 700, color: row.color }}>{row.w}</td>
                    <td style={{ padding: 12, color: accent, fontWeight: 700 }}>{row.rpe}</td>
                    <td style={{ padding: 12, color: muted }}>{row.vol}</td>
                    <td style={{ padding: 12, color: muted }}>{row.wt}</td>
                    <td style={{ padding: 12, color: muted }}>{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Floating rest timer */}
      {timer && (
        <div style={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: timer.finished ? accent : card,
          color: timer.finished ? "#000" : light,
          padding: "16px 24px",
          borderRadius: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          zIndex: 100,
          border: timer.finished ? "none" : "2px solid #334155",
        }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>
            {timer.finished ? "Rest complete" : "Rest"} · {timer.label}
          </div>
          <div style={{
            fontWeight: 900,
            fontSize: 24,
            fontVariantNumeric: "tabular-nums",
            minWidth: 60,
            textAlign: "center",
          }}>
            {timer.finished ? "Go! 💪" : formatTime(timer.remaining)}
          </div>
          {!timer.finished && (
            <>
              <button onClick={() => adjust(-15)} style={{
                padding: "8px 12px",
                background: dark,
                border: "none",
                borderRadius: 6,
                color: light,
                fontWeight: 700,
                cursor: "pointer",
              }}>−15s</button>
              <button onClick={() => adjust(15)} style={{
                padding: "8px 12px",
                background: dark,
                border: "none",
                borderRadius: 6,
                color: light,
                fontWeight: 700,
                cursor: "pointer",
              }}>+15s</button>
              <button onClick={togglePause} style={{
                padding: "8px 16px",
                background: accent,
                border: "none",
                borderRadius: 6,
                color: "#000",
                fontWeight: 800,
                cursor: "pointer",
              }}>{timer.pausedRemaining != null ? "Resume" : "Pause"}</button>
            </>
          )}
          <button onClick={closeTimer} style={{
            padding: "8px 12px",
            background: "transparent",
            border: "none",
            borderRadius: 6,
            color: muted,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 18,
          }}>{timer.finished ? "Done" : "✕"}</button>
        </div>
      )}
    </div>
  );
}

