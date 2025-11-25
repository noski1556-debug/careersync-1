import { Toaster } from "@/components/ui/sonner";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Analysis from "./pages/Analysis.tsx";
import Pricing from "./pages/Pricing.tsx";
import CVBuilder from "./pages/CVBuilder.tsx";
import CVImprovement from "./pages/CVImprovement";
import CareerIntelligence from "./pages/CareerIntelligence";
import "./types/global.d.ts";
import { ThemeProvider } from "@/components/theme-provider";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

console.log("App mounting...");

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

if (!convex) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-500">Configuration Error</h1>
          <p>The Convex URL is missing.</p>
          <p className="text-sm text-zinc-400">
            Please go to the <strong>API Keys</strong> tab and ensure <code>VITE_CONVEX_URL</code> is set to your Convex deployment URL (e.g., <code>https://example-app-123.convex.cloud</code>).
          </p>
        </div>
      </div>
    </StrictMode>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <InstrumentationProvider>
        <ConvexAuthProvider client={convex}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
              <RouteSyncer />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analysis/:id" element={<Analysis />} />
                <Route path="/cv-improvement/:id" element={<CVImprovement />} />
                <Route path="/cv-builder" element={<CVBuilder />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/career-intelligence" element={<CareerIntelligence />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </ThemeProvider>
        </ConvexAuthProvider>
      </InstrumentationProvider>
    </StrictMode>,
  );
}