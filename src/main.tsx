import { createRoot } from "react-dom/client";
import { StatusBar } from "@capacitor/status-bar";
import App from "./App.tsx";
import "./index.css";

StatusBar.setOverlaysWebView({ overlay: false });
StatusBar.setStyle({ style: "dark" });

createRoot(document.getElementById("root")!).render(<App />);
