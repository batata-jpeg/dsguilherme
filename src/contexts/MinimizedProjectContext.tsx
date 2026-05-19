import { createContext, useContext, useState, ReactNode } from "react";

export type MinimizedProjectData = {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
};

interface MinimizedProjectContextType {
  minimized: MinimizedProjectData | null;
  minimize: (data: MinimizedProjectData) => void;
  close: () => void;
  pendingOpen: string | null;
  restore: () => void;
  clearPendingOpen: () => void;
}

const MinimizedProjectContext = createContext<MinimizedProjectContextType | null>(null);

export function MinimizedProjectProvider({ children }: { children: ReactNode }) {
  const [minimized, setMinimized] = useState<MinimizedProjectData | null>(null);
  const [pendingOpen, setPendingOpen] = useState<string | null>(null);

  const minimize = (data: MinimizedProjectData) => setMinimized(data);
  const close = () => { setMinimized(null); setPendingOpen(null); };
  const restore = () => {
    if (minimized) setPendingOpen(minimized.id);
    setMinimized(null);
  };
  const clearPendingOpen = () => setPendingOpen(null);

  return (
    <MinimizedProjectContext.Provider value={{ minimized, minimize, close, pendingOpen, restore, clearPendingOpen }}>
      {children}
    </MinimizedProjectContext.Provider>
  );
}

export function useMinimizedProject() {
  const ctx = useContext(MinimizedProjectContext);
  if (!ctx) throw new Error("useMinimizedProject must be within MinimizedProjectProvider");
  return ctx;
}
