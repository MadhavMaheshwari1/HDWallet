// main.tsx

// Import the browser-ready buffer and process packages
import { Buffer } from "buffer/";
import process from "process";

// Add globals to window
if (!window.Buffer) window.Buffer = Buffer;
if (!window.process) window.process = process;

import { Provider } from "@/components/ui/provider";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
