import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import ToastContainer from "./components/ToastContainer";
import ErrorBoundary from "./components/ErrorBoundary";

const Landing = lazy(() => import("./pages/Landing"));
const VideoAnalysis = lazy(() => import("./pages/VideoAnalysis"));
const AudioAnalysis = lazy(() => import("./pages/AudioAnalysis"));
const URLAnalysis = lazy(() => import("./pages/URLAnalysis"));
const TextAnalysis = lazy(() => import("./pages/TextAnalysis"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const History = lazy(() => import("./pages/History"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        <p className="text-sm text-slate-500 font-medium">Loading module...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <ErrorBoundary>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/video" element={<VideoAnalysis />} />
                <Route path="/audio" element={<AudioAnalysis />} />
                <Route path="/url" element={<URLAnalysis />} />
                <Route path="/text" element={<TextAnalysis />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/history" element={<History />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </Layout>
      </ErrorBoundary>
      <ToastContainer />
    </>
  );
}

export default App;
