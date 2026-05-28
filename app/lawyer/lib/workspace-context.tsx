import { createContext, useContext, useState, ReactNode } from "react";

type IntakeStatus = "pending" | "accepted";

interface WorkspaceState {
  clientPing: boolean;
  setClientPing: (v: boolean) => void;
  intakeStatus: IntakeStatus;
  acceptIntake: () => void;
  briefOpen: boolean;
  openBrief: () => void;
  closeBrief: () => void;
}

const WorkspaceContext = createContext<WorkspaceState | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [clientPing, setClientPing] = useState(false);
  const [intakeStatus, setIntakeStatus] = useState<IntakeStatus>("pending");
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <WorkspaceContext.Provider
      value={{
        clientPing,
        setClientPing,
        intakeStatus,
        acceptIntake: () => setIntakeStatus("accepted"),
        briefOpen,
        openBrief: () => setBriefOpen(true),
        closeBrief: () => setBriefOpen(false),
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
