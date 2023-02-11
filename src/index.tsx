import * as React from "react";
import { createRoot } from "react-dom/client";

import App from "./components/Demo";

// Attempt to prevent scrolling
window.addEventListener("scroll", (e) => {
  e.preventDefault();
  window.scrollTo(0, 0);
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
