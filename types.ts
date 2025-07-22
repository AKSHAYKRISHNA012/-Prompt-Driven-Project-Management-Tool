
export enum Role {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  MEMBER = 'Team Member',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
}

export enum TaskPriority {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum TaskStatus {
  BACKLOG = 'Backlog',
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done',
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  projectId: string;
  dueDate: string;
  createdAt: string;
  subtasks: Subtask[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface AppState {
  users: User[];
  projects: Project[];
  tasks: Task[];
  currentUser: User | null;
  currentProject: Project | null;
}

export type Action =
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'MOVE_TASK'; payload: { taskId: string; newStatus: TaskStatus } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task };

