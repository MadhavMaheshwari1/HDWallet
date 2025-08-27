// import { StrictMode } from "react";
import { Provider } from "@/components/ui/provider";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <Provider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  // </StrictMode>
);
