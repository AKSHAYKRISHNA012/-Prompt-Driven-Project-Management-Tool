
import { Role, User, Project, ColumnId, TaskPriority } from './types';

export const USERS: User[] = [
  { id: 'user-1', name: 'Alex Johnson', role: Role.Admin, avatar: 'https://i.pravatar.cc/150?u=user-1' },
  { id: 'user-2', name: 'Maria Garcia', role: Role.Manager, avatar: 'https://i.pravatar.cc/150?u=user-2' },
  { id: 'user-3', name: 'James Smith', role: Role.TeamMember, avatar: 'https://i.pravatar.cc/150?u=user-3' },
  { id: 'user-4', name: 'Li Wei', role: Role.TeamMember, avatar: 'https://i.pravatar.cc/150?u=user-4' },
];

export const INITIAL_PROJECT_DATA: Project = {
  id: 'proj-1',
  name: 'Zenith App Development',
  columns: [
    { id: ColumnId.ToDo, title: 'To Do' },
    { id: ColumnId.InProgress, title: 'In Progress' },
    { id: ColumnId.InReview, title: 'In Review' },
    { id: ColumnId.Done, title: 'Done' },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Set up project structure',
      description: 'Initialize the repository and create the basic file structure for the React application.',
      status: ColumnId.Done,
      priority: TaskPriority.High,
      dueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      assigneeId: 'user-1',
      comments: [],
      attachments: [],
    },
    {
      id: 'task-2',
      title: 'Design UI mockups',
      description: 'Create wireframes and mockups for all major screens and components.',
      status: ColumnId.InReview,
      priority: TaskPriority.High,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      assigneeId: 'user-2',
      comments: [
        { id: 'comment-1', userId: 'user-1', content: 'Looks good, but can we try a different color for the primary button?', timestamp: new Date().toISOString() }
      ],
      attachments: [],
    },
    {
      id: 'task-3',
      title: 'Develop authentication flow',
      description: 'Implement the user login and role selection screen.',
      status: ColumnId.InProgress,
      priority: TaskPriority.Medium,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      assigneeId: 'user-3',
      comments: [],
      attachments: [
          {id: 'att-1', name: 'auth_flow.png', type: 'image/png', url: '#'}
      ],
    },
    {
      id: 'task-4',
      title: 'Build Kanban board component',
      description: 'Create the main project board with drag-and-drop functionality.',
      status: ColumnId.ToDo,
      priority: TaskPriority.High,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
      assigneeId: 'user-4',
      comments: [],
      attachments: [],
    },
    {
        id: 'task-5',
        title: 'Integrate charting library for dashboard',
        description: 'Set up Recharts and create initial dashboard visualizations.',
        status: ColumnId.ToDo,
        priority: TaskPriority.Medium,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
        assigneeId: 'user-3',
        comments: [],
        attachments: [],
    },
    {
        id: 'task-6',
        title: 'Fix mobile responsiveness issues',
        description: 'The main board is not rendering correctly on small screens.',
        status: ColumnId.InProgress,
        priority: TaskPriority.Low,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
        assigneeId: 'user-4',
        comments: [],
        attachments: [],
    }
  ],
};
