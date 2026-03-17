export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Todo' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  project: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  createdAt: number;
}

export interface Column {
  id: Status;
  title: string;
  taskIds: string[];
}

export interface BoardData {
  tasks: Record<string, Task>;
  columns: Record<Status, Column>;
  columnOrder: Status[];
}
