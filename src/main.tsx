import { createRoot } from "react-dom/client";
import { StatusBar } from "@capacitor/status-bar";
import { App as CapacitorApp } from "@capacitor/app";
import App from "./App.tsx";
import "./index.css";

StatusBar.setOverlaysWebView({ overlay: false });
StatusBar.setStyle({ style: "dark" });

CapacitorApp.addListener("backButton", () => {
  window.dispatchEvent(new CustomEvent("capacitor-back-button"));
}).catch(() => {});

createRoot(document.getElementById("root")!).render(<App />);