import { useState, useCallback, useEffect } from "react";

export interface ScanRecord {
  id: string;
  type: "video" | "audio" | "url" | "text";
  timestamp: string;
  score: number;
  riskLevel: string;
  name: string;
  details: Record<string, string | number>;
}

const STORAGE_KEY = "truthshield_scan_history";
const MAX_RECORDS = 50;

function loadHistory(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ScanRecord[];
  } catch {
    return [];
  }
}

function saveHistory(records: ScanRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)));
  } catch {
    // Storage full – drop oldest
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, 20)));
    } catch {
      // Give up silently
    }
  }
}

export function useScanHistory() {
  const [history, setHistory] = useState<ScanRecord[]>(() => loadHistory());

  // Sync to localStorage whenever history changes
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addScan = useCallback(
    (scan: Omit<ScanRecord, "id" | "timestamp">) => {
      const record: ScanRecord = {
        ...scan,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
      };
      setHistory((prev) => [record, ...prev].slice(0, MAX_RECORDS));
      return record;
    },
    []
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getByType = useCallback(
    (type: ScanRecord["type"]) => history.filter((r) => r.type === type),
    [history]
  );

  const getStats = useCallback(() => {
    const total = history.length;
    const byType = {
      video: history.filter((r) => r.type === "video").length,
      audio: history.filter((r) => r.type === "audio").length,
      url: history.filter((r) => r.type === "url").length,
      text: history.filter((r) => r.type === "text").length,
    };
    const avgScore = total > 0 ? history.reduce((sum, r) => sum + r.score, 0) / total : 0;
    const threatsDetected = history.filter(
      (r) => r.score < 50 || ["Fake", "Dangerous", "Likely Misinformation"].includes(r.riskLevel)
    ).length;

    return { total, byType, avgScore: Math.round(avgScore), threatsDetected };
  }, [history]);

  const exportHistory = useCallback(() => {
    return JSON.stringify(history, null, 2);
  }, [history]);

  return {
    history,
    addScan,
    clearHistory,
    getByType,
    getStats,
    exportHistory,
  };
}
