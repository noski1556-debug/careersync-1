import { Toaster } from "@/components/ui/sonner";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { Component, ErrorInfo, ReactNode, StrictMode, useEffect } from "react";
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
let convex: ConvexReactClient | null = null;
let configError = "";

if (!convexUrl) {
  configError = "The Convex URL is missing.";
} else if (!convexUrl.startsWith("https://")) {
  configError = "The VITE_CONVEX_URL must start with 'https://'. It looks like you might have used a deployment key instead of the Deployment URL.";
} else {
  try {
    convex = new ConvexReactClient(convexUrl);
  } catch (e) {
    configError = "Failed to initialize Convex client. Please check your URL.";
    console.error(e);
  }
}

console.log("App mounting...");

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-red-500 p-4">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <pre className="bg-zinc-900 p-4 rounded overflow-auto text-sm text-zinc-300 whitespace-pre-wrap">
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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

if (!convex || configError) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-500">Configuration Error</h1>
          <p className="text-lg">{configError}</p>
          <div className="text-sm text-zinc-400 bg-zinc-900 p-4 rounded-md text-left">
            <p className="font-bold mb-2">How to get your VITE_CONVEX_URL:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click the <strong>Database</strong> tab in the left sidebar (opens Convex dashboard).</li>
              <li>In the dashboard, look for the <strong>Deployment URL</strong> (top right or in Settings).</li>
              <li>It should look like: <code>https://happy-otter-123.convex.cloud</code></li>
              <li>Copy that URL.</li>
              <li>Go to the <strong>API Keys</strong> tab here.</li>
              <li>Set <code>VITE_CONVEX_URL</code> to that URL.</li>
            </ol>
          </div>
        </div>
      </div>
    </StrictMode>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </StrictMode>,
  );
}