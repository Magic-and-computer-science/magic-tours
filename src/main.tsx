import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import CarreMagique from "./app/magic-square.js";
import Gilbreath from "./app/gilbreath.js";

type Tour = "square" | "gilbreath";

const TABS: { id: Tour; label: string }[] = [
  { id: "square", label: "Tour 1 — Carré Magique" },
  { id: "gilbreath", label: "Tour 2 — Gilbreath" },
];

function App() {
  const [tour, setTour] = useState<Tour>("gilbreath");

  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "1rem",
          background: "rgba(0,0,0,0.6)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        }}
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTour(id)}
            style={{
              padding: "0.5rem 1.4rem",
              fontSize: "0.75rem",
              fontFamily: "inherit",
              letterSpacing: "0.06em",
              background:
                tour === id
                  ? "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)"
                  : "rgba(255,255,255,0.05)",
              border: "none",
              borderRadius: "20px",
              color: tour === id ? "#fff" : "#666",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      {tour === "square" ? <CarreMagique /> : <Gilbreath />}
    </>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("No #root element found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
