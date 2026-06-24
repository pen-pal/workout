import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import WorkoutPlan from "./WorkoutPlan.jsx";

// Vercel Web Analytics + Speed Insights. Active on Vercel + custom domains;
// skipped on GitHub Pages (github.io), where the /_vercel beacons don't exist
// (they would just 404). Vercel collects the data once deployed there.
const onGitHubPages =
  typeof window !== "undefined" && window.location.hostname.endsWith("github.io");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WorkoutPlan />
    {!onGitHubPages && <Analytics />}
    {!onGitHubPages && <SpeedInsights />}
  </StrictMode>
);
