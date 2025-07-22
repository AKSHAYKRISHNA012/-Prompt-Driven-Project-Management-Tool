
import React from 'react';
import { Task, TaskPriority } from '../types';
import { useAppState } from '../context/AppContext';
import { USERS } from '../constants';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { state } = useAppState();
  const assignee = USERS.find(u => u.id === task.assigneeId);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    localStorage.setItem('draggingTaskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  }
  
  const handleDragEnd = () => {
      localStorage.removeItem('draggingTaskId');
  }

  const getPriorityClasses = (priority: TaskPriority) => {
      switch(priority) {
          case TaskPriority.High: return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
          case TaskPriority.Medium: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
          case TaskPriority.Low: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
  };
  
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm cursor-pointer border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-800 dark:text-gray-100">{task.title}</h4>
        {assignee && <img src={assignee.avatar} alt={assignee.name} className="w-8 h-8 rounded-full" title={assignee.name}/>}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{task.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityClasses(task.priority)}`}>{task.priority}</span>
            <div className="flex items-center gap-1">
                <ion-icon name="chatbubbles-outline"></ion-icon>
                <span>{task.comments.length}</span>
            </div>
            <div className="flex items-center gap-1">
                <ion-icon name="attach-outline"></ion-icon>
                <span>{task.attachments.length}</span>
            </div>
        </div>
        <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500' : ''}`}>
            <ion-icon name="calendar-outline"></ion-icon>
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
