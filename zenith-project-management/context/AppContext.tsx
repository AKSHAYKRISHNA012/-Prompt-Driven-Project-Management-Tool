
import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { User, Project, AppNotification, Task, ColumnId } from '../types';
import { INITIAL_PROJECT_DATA } from '../constants';

interface AppState {
  currentUser: User | null;
  project: Project;
  notifications: AppNotification[];
  theme: 'light' | 'dark';
}

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'MOVE_TASK'; payload: { taskId: string; newStatus: ColumnId } }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'ADD_COMMENT', payload: { taskId: string, userId: string, content: string } }
  | { type: 'ADD_ATTACHMENT', payload: { taskId: string, file: { name: string, type: string } } };

const AppContext = createContext<{ state: AppState; dispatch: Dispatch<Action> } | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'TOGGLE_THEME':
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
        return { ...state, theme: newTheme };
    case 'ADD_TASK':
      return {
        ...state,
        project: {
          ...state.project,
          tasks: [...state.project.tasks, action.payload],
        },
      };
    case 'UPDATE_TASK':
        return {
            ...state,
            project: {
                ...state.project,
                tasks: state.project.tasks.map(task => 
                    task.id === action.payload.id ? action.payload : task
                ),
            },
        };
    case 'MOVE_TASK':
      return {
        ...state,
        project: {
          ...state.project,
          tasks: state.project.tasks.map(task =>
            task.id === action.payload.taskId
              ? { ...task, status: action.payload.newStatus }
              : task
          ),
        },
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case 'MARK_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      };
    case 'ADD_COMMENT':
        const { taskId, userId, content } = action.payload;
        return {
            ...state,
            project: {
                ...state.project,
                tasks: state.project.tasks.map(task => {
                    if (task.id === taskId) {
                        const newComment = {
                            id: `comment-${Date.now()}`,
                            userId,
                            content,
                            timestamp: new Date().toISOString()
                        };
                        return { ...task, comments: [...task.comments, newComment] };
                    }
                    return task;
                })
            }
        };
    case 'ADD_ATTACHMENT':
        const { taskId: attachTaskId, file } = action.payload;
        return {
            ...state,
            project: {
                ...state.project,
                tasks: state.project.tasks.map(task => {
                    if (task.id === attachTaskId) {
                        const newAttachment = {
                            id: `att-${Date.now()}`,
                            name: file.name,
                            type: file.type,
                            url: '#' // Simulated URL
                        };
                        return { ...task, attachments: [...task.attachments, newAttachment] };
                    }
                    return task;
                })
            }
        };
    default:
      return state;
  }
};

const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedTheme = window.localStorage.getItem('theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
            return storedTheme;
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
    }
    return 'light';
};


const initialState: AppState = {
  currentUser: null,
  project: INITIAL_PROJECT_DATA,
  notifications: [],
  theme: getInitialTheme(),
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};
