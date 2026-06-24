import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import WorkoutPlan from "./WorkoutPlan.jsx";

// Vercel Web Analytics. Active on Vercel + custom domains; skipped on GitHub
// Pages (github.io), where the /_vercel/insights beacon doesn't exist (it would
// just 404). Vercel collects page views once deployed there.
const onGitHubPages =
  typeof window !== "undefined" && window.location.hostname.endsWith("github.io");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WorkoutPlan />
    {!onGitHubPages && <Analytics />}
  </StrictMode>
);
