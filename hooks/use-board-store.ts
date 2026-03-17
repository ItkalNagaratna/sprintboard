import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Status, BoardData, Priority } from '@/lib/types';

interface BoardState {
  board: BoardData;
  searchQuery: string;
  priorityFilter: Priority | 'All';
  isSidebarOpen: boolean;

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, sourceStatus: Status, destinationStatus: Status, sourceIndex: number, destinationIndex: number) => void;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (filter: Priority | 'All') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const FIXED_TIMESTAMP = 1741169766000; // Fixed timestamp for initial data

const initialBoard: BoardData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Refactor project creation after save steps',
      description: 'Clean up the logic for saving projects',
      priority: 'Low',
      status: 'Todo',
      project: 'Kore 2.0',
      assignee: { name: 'Kai Lee' },
      createdAt: FIXED_TIMESTAMP,
    },
    'task-2': {
      id: 'task-2',
      title: 'Launch Kore 2.0 beta',
      description: 'Final checks before beta launch',
      priority: 'High',
      status: 'Todo',
      project: 'Acme 2.0',
      assignee: { name: 'Masanori Abe' },
      createdAt: FIXED_TIMESTAMP,
    },
    'task-3': {
      id: 'task-3',
      title: 'Offline mode polish',
      description: 'Improve UX for offline transitions',
      priority: 'Low',
      status: 'In Progress',
      project: 'Acme 2.0',
      assignee: { name: 'James Williams' },
      createdAt: FIXED_TIMESTAMP,
    },
    'task-4': {
      id: 'task-4',
      title: 'Add testing for Kore Projects',
      description: 'Increase unit test coverage',
      priority: 'High',
      status: 'Done',
      project: 'Acme 2.0',
      assignee: { name: 'Florence Rossi' },
      createdAt: FIXED_TIMESTAMP,
    },
    'task-5': {
      id: 'task-5',
      title: 'Schedule bug bash',
      description: 'Organize team for bug hunting',
      priority: 'Medium',
      status: 'In Progress',
      project: 'performance',
      assignee: { name: 'Kai Lee' },
      createdAt: FIXED_TIMESTAMP,
    },
  },
  columns: {
    'Todo': { id: 'Todo', title: 'Todo', taskIds: ['task-1', 'task-2'] },
    'In Progress': { id: 'In Progress', title: 'In Progress', taskIds: ['task-3', 'task-5'] },
    'Done': { id: 'Done', title: 'Completed', taskIds: ['task-4'] },
  },
  columnOrder: ['Todo', 'In Progress', 'Done'],
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      board: initialBoard,
      searchQuery: '',
      priorityFilter: 'All',
      isSidebarOpen: false,

      addTask: (taskData) => set((state) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newTask: Task = {
          ...taskData,
          id,
          project: taskData.project || 'General',
          assignee: taskData.assignee || { name: 'Unassigned' },
          createdAt: Date.now(),
        };

        return {
          board: {
            ...state.board,
            tasks: { ...state.board.tasks, [id]: newTask },
            columns: {
              ...state.board.columns,
              [newTask.status]: {
                ...state.board.columns[newTask.status],
                taskIds: [...state.board.columns[newTask.status].taskIds, id],
              },
            },
          },
        };
      }),

      updateTask: (id, updates) => set((state) => {
        const task = state.board.tasks[id];
        if (!task) return state;

        const updatedTask = { ...task, ...updates };

        // If status changed, we need to move it between columns
        let newColumns = { ...state.board.columns };
        if (updates.status && updates.status !== task.status) {
          // Remove from old
          newColumns[task.status] = {
            ...newColumns[task.status],
            taskIds: newColumns[task.status].taskIds.filter(tid => tid !== id),
          };
          // Add to new
          newColumns[updates.status] = {
            ...newColumns[updates.status],
            taskIds: [...newColumns[updates.status].taskIds, id],
          };
        }

        return {
          board: {
            ...state.board,
            tasks: { ...state.board.tasks, [id]: updatedTask },
            columns: newColumns,
          },
        };
      }),

      deleteTask: (id) => set((state) => {
        const task = state.board.tasks[id];
        if (!task) return state;

        const newTasks = { ...state.board.tasks };
        delete newTasks[id];

        const newColumns = { ...state.board.columns };
        newColumns[task.status] = {
          ...newColumns[task.status],
          taskIds: newColumns[task.status].taskIds.filter(tid => tid !== id),
        };

        return {
          board: {
            ...state.board,
            tasks: newTasks,
            columns: newColumns,
          },
        };
      }),

      moveTask: (taskId, sourceStatus, destinationStatus, sourceIndex, destinationIndex) => set((state) => {
        const newColumns = { ...state.board.columns };

        // Remove from source
        const sourceTaskIds = Array.from(newColumns[sourceStatus].taskIds);
        sourceTaskIds.splice(sourceIndex, 1);
        newColumns[sourceStatus] = { ...newColumns[sourceStatus], taskIds: sourceTaskIds };

        // Add to destination
        const destTaskIds = Array.from(newColumns[destinationStatus].taskIds);
        destTaskIds.splice(destinationIndex, 0, taskId);
        newColumns[destinationStatus] = { ...newColumns[destinationStatus], taskIds: destTaskIds };

        // Update task status if it changed
        const newTasks = { ...state.board.tasks };
        if (sourceStatus !== destinationStatus) {
          newTasks[taskId] = { ...newTasks[taskId], status: destinationStatus };
        }

        return {
          board: {
            ...state.board,
            tasks: newTasks,
            columns: newColumns,
          },
        };
      }),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setPriorityFilter: (filter) => set({ priorityFilter: filter }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    }),
    {
      name: 'sprintboard-storage',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        // Force column titles to always be up to date
        const state = persistedState as { board?: { columns?: Record<string, { title?: string }> } };
        if (state?.board?.columns) {
          if (state.board.columns['Todo']) state.board.columns['Todo'].title = 'Todo';
          if (state.board.columns['In Progress']) state.board.columns['In Progress'].title = 'In Progress';
          if (state.board.columns['Done']) state.board.columns['Done'].title = 'Completed';
        }
        return state;
      },
    }
  )
);
