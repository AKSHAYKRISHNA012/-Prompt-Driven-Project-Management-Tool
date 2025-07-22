
export enum Role {
  Admin = 'Admin',
  Manager = 'Manager',
  TeamMember = 'Team Member',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum ColumnId {
  ToDo = 'todo',
  InProgress = 'inprogress',
  InReview = 'inreview',
  Done = 'done',
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string; // For simulation
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: ColumnId;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: string | null;
  comments: Comment[];
  attachments: Attachment[];
}

export interface Column {
    id: ColumnId;
    title: string;
}

export interface Project {
  id: string;
  name: string;
  tasks: Task[];
  columns: Column[];
}

export interface AppNotification {
  id: string;
  message: string;
  read: boolean;
  timestamp: string;
}
