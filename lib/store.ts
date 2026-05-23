import { create } from 'zustand';
import { RobotState, RobotCommand } from './types';
import { mockRobotStates, updateMockRobotState } from './mock-data';

interface RobotStore {
  robots: Record<string, RobotState>;
  selectedRobotId: string | null;
  isConnected: boolean;
  lastError: string | null;
  
  // Actions
  setRobots: (robots: Record<string, RobotState>) => void;
  updateRobot: (robotId: string, state: Partial<RobotState>) => void;
  setSelectedRobot: (robotId: string | null) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  
  // Mock update for testing
  simulateUpdate: () => void;
}

export const useRobotStore = create<RobotStore>((set) => ({
  robots: mockRobotStates,
  selectedRobotId: 'robot-001',
  isConnected: true,
  lastError: null,
  
  setRobots: (robots) => set({ robots }),
  
  updateRobot: (robotId, state) => set((current) => ({
    robots: {
      ...current.robots,
      [robotId]: {
        ...current.robots[robotId],
        ...state,
      },
    },
  })),
  
  setSelectedRobot: (robotId) => set({ selectedRobotId: robotId }),
  
  setConnected: (connected) => set({ isConnected: connected }),
  
  setError: (error) => set({ lastError: error }),
  
  simulateUpdate: () => set((current) => {
    const updated: Record<string, RobotState> = {};
    Object.entries(current.robots).forEach(([id, robot]) => {
      updated[id] = updateMockRobotState(robot);
    });
    return { robots: updated };
  }),
}));
