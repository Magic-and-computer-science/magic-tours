import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CarreMagique from "./app/magic-square.js";

const root = document.getElementById("root");
if (!root) throw new Error("No #root element found");

createRoot(root).render(
  <StrictMode>
    <CarreMagique />
  </StrictMode>,
);
