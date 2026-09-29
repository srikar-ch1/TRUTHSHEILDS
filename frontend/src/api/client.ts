/**
 * TRUTHSHIELD API client – enterprise video/audio/URL/text analysis and system metrics.
 */
const API_BASE = (import.meta.env.VITE_API_BASE as string) || "/api";
const API_TIMEOUT_MS = parseInt(import.meta.env.VITE_API_TIMEOUT as string) || 60_000;

export interface ModelMetadata {
  model_used: string;
  device: string;
  frames_analyzed?: number;
  processing_time: number;
}

export interface VideoAnalysisResponse {
  authenticity_score: number;
  risk_level: "Real" | "Suspicious" | "Fake";
  confidence_level: string;
  explanation: string;
  threat_index: number;
  threat_category: string;
  temporal_stability_score: number;
  frames_analyzed: number;
  processing_time: number;
  heatmap_available: boolean;
  heatmap_image: string | null;
  model_used: string;
  inference_device: string;
  memory_usage_mb?: number;
  cpu_usage_percent?: number;
  model_metadata?: ModelMetadata;
}

export interface AudioAnalysisResponse {
  authenticity_score: number;
  scam_probability: number;
  confidence_level: string;
  explanation: string;
  processing_time?: number;
  model_metadata: ModelMetadata;
}

export interface URLAnalysisResponse {
  url: string;
  threat_score: number;
  risk_level: "Safe" | "Suspicious" | "Dangerous";
  ssl: { valid: boolean; issuer: string | null; expires: string | null };
  dns: { resolves: boolean; ip: string | null };
  typosquatting: { detected: boolean; target: string | null; distance: number | null };
  flags: Array<{ flag: string; severity: string; detail: string }>;
  processing_time: number;
  domain: string;
  protocol: string;
}

export interface TextAnalysisResponse {
  credibility_score: number;
  risk_level: "Credible" | "Questionable" | "Likely Misinformation";
  explanation: string;
  readability: {
    grade_level: number;
    reading_ease: number;
    level: string;
    sentence_count: number;
    word_count: number;
  };
  clickbait: { detected: boolean; patterns: Array<{ pattern: string; count: number }> };
  emotional_language: { level: string; density: number; words_found: string[]; count: number };
  bias: { level: string; categories: Record<string, string[]>; detail: string };
  credibility_signals: {
    source_citations: number;
    citation_patterns: string[];
    quoted_content: number;
    statistics_referenced: number;
  };
  processing_time: number;
}

export interface SystemMetricsResponse {
  total_scans: number;
  fake_detected_count: number;
  average_processing_time_sec: number;
  uptime_seconds: number;
  video_scans?: number;
  audio_scans?: number;
}

function isNetworkError(err: unknown): boolean {
  const e = err as Error;
  const message = e?.message || "";

  if (e.name === "AbortError") {
    return false;
  }

  if (
    message === "Failed to fetch" ||
    message === "NetworkError when attempting to fetch resource." ||
    message.toLowerCase().includes("networkerror")
  ) {
    return true;
  }

  return false;
}

function makeSimulatedVideoResponse(): VideoAnalysisResponse {
  const authenticity_score = 82.3;
  const frames_analyzed = 20;
  const temporal_stability_score = 88.5;
  const threat_index = 23.4;

  return {
    authenticity_score,
    risk_level: "Real",
    confidence_level: "High Confidence",
    explanation:
      "Simulated analysis: frames show consistent lighting, motion, and facial micro‑expressions with no strong indicators of AI manipulation.",
    threat_index,
    threat_category: "Low Threat",
    temporal_stability_score,
    frames_analyzed,
    processing_time: 2.1,
    heatmap_available: false,
    heatmap_image: null,
    model_used: "Simulated-Deepfake-Detector",
    inference_device: "CPU",
    memory_usage_mb: 0,
    cpu_usage_percent: 0,
    model_metadata: {
      model_used: "Simulated-Deepfake-Detector",
      device: "CPU",
      processing_time: 2.1,
    },
  };
}

function makeSimulatedAudioResponse(): AudioAnalysisResponse {
  const authenticity_score = 78.5;
  const scam_probability = 21.5;

  return {
    authenticity_score,
    scam_probability,
    confidence_level: "Moderate Confidence",
    explanation:
      "Simulated analysis: voice characteristics appear consistent with natural speech with no strong indicators of AI voice cloning.",
    processing_time: 1.4,
    model_metadata: {
      model_used: "Simulated-Voice-Scam-Detector",
      device: "CPU",
      processing_time: 1.4,
    },
  };
}

function makeSimulatedURLResponse(url: string): URLAnalysisResponse {
  const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
  const domain = parsed.hostname;

  // Simple heuristic simulation
  let threat_score = 15;
  const flags: URLAnalysisResponse["flags"] = [];

  if (domain.includes("login") || domain.includes("verify")) {
    threat_score += 25;
    flags.push({ flag: "Phishing keyword in domain", severity: "high", detail: "Domain contains suspicious authentication keywords" });
  }
  if (url.length > 100) {
    threat_score += 10;
    flags.push({ flag: "Long URL", severity: "low", detail: `URL is ${url.length} characters` });
  }

  return {
    url,
    threat_score,
    risk_level: threat_score >= 60 ? "Dangerous" : threat_score >= 30 ? "Suspicious" : "Safe",
    ssl: { valid: parsed.protocol === "https:", issuer: "Simulated CA", expires: "2027-01-01" },
    dns: { resolves: true, ip: "93.184.216.34" },
    typosquatting: { detected: false, target: null, distance: null },
    flags,
    processing_time: 0.8,
    domain,
    protocol: parsed.protocol.replace(":", ""),
  };
}

function makeSimulatedTextResponse(text: string): TextAnalysisResponse {
  const wordCount = text.split(/\s+/).length;
  const exclamations = (text.match(/!/g) || []).length;
  const capsWords = text.split(/\s+/).filter(w => w.length > 2 && w === w.toUpperCase()).length;

  let credibility = 72;
  if (exclamations > 3) credibility -= 15;
  if (capsWords > 5) credibility -= 10;

  return {
    credibility_score: Math.max(0, Math.min(100, credibility)),
    risk_level: credibility >= 70 ? "Credible" : credibility >= 40 ? "Questionable" : "Likely Misinformation",
    explanation: "Simulated analysis: text analyzed for clickbait patterns, emotional language, and credibility signals.",
    readability: { grade_level: 10.2, reading_ease: 58.5, level: "Moderate", sentence_count: Math.max(1, Math.floor(wordCount / 15)), word_count: wordCount },
    clickbait: { detected: false, patterns: [] },
    emotional_language: { level: "Low", density: 0.01, words_found: [], count: 0 },
    bias: { level: "Low", categories: {}, detail: "No significant bias markers detected" },
    credibility_signals: { source_citations: 0, citation_patterns: [], quoted_content: 0, statistics_referenced: 0 },
    processing_time: 0.3,
  };
}

function fetchWithTimeout(
  url: string,
  options: RequestInit,
  signal?: AbortSignal
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }
  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));
}

export async function analyzeVideo(
  file: File,
  signal?: AbortSignal
): Promise<VideoAnalysisResponse> {
  const form = new FormData();
  form.append("video", file);
  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/analyze-video`,
      { method: "POST", body: form },
      signal
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || "Video analysis failed");
    }
    return res.json();
  } catch (err) {
    const e = err as Error;
    if (e.name === "AbortError") {
      throw new Error("Request timeout. Please try a smaller file or check your connection.");
    }
    if (isNetworkError(e)) {
      console.warn(
        "TRUTHSHIELD backend unreachable for video analysis. Falling back to simulated response.",
        e
      );
      return makeSimulatedVideoResponse();
    }
    throw e;
  }
}

export async function analyzeAudio(
  file: File,
  signal?: AbortSignal
): Promise<AudioAnalysisResponse> {
  const form = new FormData();
  form.append("audio", file);
  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/analyze-audio`,
      { method: "POST", body: form },
      signal
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || "Audio analysis failed");
    }
    return res.json();
  } catch (err) {
    const e = err as Error;
    if (e.name === "AbortError") {
      throw new Error("Request timeout. Please try a smaller file or check your connection.");
    }
    if (isNetworkError(e)) {
      console.warn(
        "TRUTHSHIELD backend unreachable for audio analysis. Falling back to simulated response.",
        e
      );
      return makeSimulatedAudioResponse();
    }
    throw e;
  }
}

export async function analyzeURL(
  url: string,
  signal?: AbortSignal
): Promise<URLAnalysisResponse> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/analyze-url`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      },
      signal
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || "URL analysis failed");
    }
    return res.json();
  } catch (err) {
    const e = err as Error;
    if (e.name === "AbortError") {
      throw new Error("Request timeout. Please check the URL and try again.");
    }
    if (isNetworkError(e)) {
      console.warn(
        "TRUTHSHIELD backend unreachable for URL analysis. Falling back to simulated response.",
        e
      );
      return makeSimulatedURLResponse(url);
    }
    throw e;
  }
}

export async function analyzeText(
  text: string,
  signal?: AbortSignal
): Promise<TextAnalysisResponse> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/analyze-text`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      },
      signal
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || "Text analysis failed");
    }
    return res.json();
  } catch (err) {
    const e = err as Error;
    if (e.name === "AbortError") {
      throw new Error("Request timeout. Please try again.");
    }
    if (isNetworkError(e)) {
      console.warn(
        "TRUTHSHIELD backend unreachable for text analysis. Falling back to simulated response.",
        e
      );
      return makeSimulatedTextResponse(text);
    }
    throw e;
  }
}

export async function getSystemMetrics(signal?: AbortSignal): Promise<SystemMetricsResponse> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/system-metrics`,
      { method: "GET" },
      signal
    );
    if (!res.ok) {
      return {
        total_scans: 0,
        fake_detected_count: 0,
        average_processing_time_sec: 0,
        uptime_seconds: 0,
      };
    }
    return res.json();
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn(
        "TRUTHSHIELD backend unreachable for system metrics. Returning default empty metrics.",
        err
      );
      return {
        total_scans: 0,
        fake_detected_count: 0,
        average_processing_time_sec: 0,
        uptime_seconds: 0,
      };
    }
    throw err;
  }
}
