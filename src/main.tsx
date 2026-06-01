import { createRoot } from "react-dom/client";
import { StatusBar } from "@capacitor/status-bar";
import { App as CapacitorApp } from "@capacitor/app";
import App from "./App.tsx";
import "./index.css";

document.documentElement.style.setProperty("--status-bar-height", "24px");

async function setupStatusBar() {
  try {
    await StatusBar.setStyle({ style: "dark" });
    await StatusBar.setBackgroundColor({ color: "#f7f3ef" });

    const info = await StatusBar.getInfo();
    const statusBarHeight = info.height ?? 24;
    const cssPixels = Math.round(statusBarHeight / window.devicePixelRatio) + 28;
    document.documentElement.style.setProperty("--status-bar-height", cssPixels + "px");
  } catch {
    /* silent */
  }
}

setupStatusBar();

CapacitorApp.addListener("backButton", () => {
  window.dispatchEvent(new CustomEvent("capacitor-back-button"));
}).catch(() => {});

createRoot(document.getElementById("root")!).render(<App />);