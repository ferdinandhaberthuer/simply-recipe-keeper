import { createRoot } from "react-dom/client";
import { StatusBar } from "@capacitor/status-bar";
import { App as CapacitorApp } from "@capacitor/app";
import App from "./App.tsx";
import "./index.css";

StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
StatusBar.setStyle({ style: "dark" }).catch(() => {});
StatusBar.setBackgroundColor({ color: "#f7f3ef" }).catch(() => {});

CapacitorApp.addListener("backButton", () => {
  window.dispatchEvent(new CustomEvent("capacitor-back-button"));
}).catch(() => {});

createRoot(document.getElementById("root")!).render(<App />);