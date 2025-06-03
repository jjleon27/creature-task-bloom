
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  completionGoal: number;
  currentProgress: number;
  measurementUnit: 'hours' | 'exercises' | 'pages' | 'custom';
  customUnit?: string;
  sharedWith?: string[];
  isCompleted: boolean;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  taskId: string;
  duration: number; // in minutes
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  collaborators?: string[];
}

interface TaskStore {
  tasks: Task[];
  focusSessions: FocusSession[];
  virtualCurrency: number;
  creatureHealth: number;
  creatureLevel: number;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isCompleted' | 'currentProgress'>) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  completeTask: (taskId: string) => void;
  startFocusSession: (taskId: string, duration: number, collaborators?: string[]) => void;
  endFocusSession: (sessionId: string, completed: boolean) => void;
  addVirtualCurrency: (amount: number) => void;
  updateCreatureHealth: (change: number) => void;
  updateCreatureLevel: (level: number) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      focusSessions: [],
      virtualCurrency: 0,
      creatureHealth: 100,
      creatureLevel: 1,

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          isCompleted: false,
          currentProgress: 0,
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTaskProgress: (taskId, progress) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, currentProgress: progress } : task
          ),
        }));
      },

      completeTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, isCompleted: true, currentProgress: task.completionGoal } : task
          ),
          creatureHealth: Math.min(100, state.creatureHealth + 10),
          virtualCurrency: state.virtualCurrency + 50,
        }));
      },

      startFocusSession: (taskId, duration, collaborators = []) => {
        const newSession: FocusSession = {
          id: Date.now().toString(),
          taskId,
          duration,
          isActive: true,
          startTime: new Date().toISOString(),
          collaborators,
        };
        set((state) => ({
          focusSessions: [...state.focusSessions, newSession],
        }));
      },

      endFocusSession: (sessionId, completed) => {
        const session = get().focusSessions.find(s => s.id === sessionId);
        if (!session) return;

        set((state) => ({
          focusSessions: state.focusSessions.map((s) =>
            s.id === sessionId
              ? { ...s, isActive: false, endTime: new Date().toISOString() }
              : s
          ),
          virtualCurrency: completed 
            ? state.virtualCurrency + session.duration 
            : state.virtualCurrency,
          creatureHealth: completed 
            ? Math.min(100, state.creatureHealth + 5)
            : Math.max(0, state.creatureHealth - 15),
        }));
      },

      addVirtualCurrency: (amount) => {
        set((state) => ({ virtualCurrency: state.virtualCurrency + amount }));
      },

      updateCreatureHealth: (change) => {
        set((state) => ({
          creatureHealth: Math.max(0, Math.min(100, state.creatureHealth + change)),
        }));
      },

      updateCreatureLevel: (level) => {
        set({ creatureLevel: level });
      },
    }),
    {
      name: 'task-store',
    }
  )
);
