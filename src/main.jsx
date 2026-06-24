import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WorkoutPlan from "./WorkoutPlan.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WorkoutPlan />
  </StrictMode>
);
