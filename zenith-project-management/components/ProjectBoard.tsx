
import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { Task, ColumnId, Column, Role } from '../types';

const BoardColumn: React.FC<{ column: Column, tasks: Task[], onTaskClick: (task: Task) => void, onDrop: (columnId: ColumnId) => void }> = ({ column, tasks, onTaskClick, onDrop }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        onDrop(column.id);
    }
    
    const getBorderColor = (id: ColumnId) => {
        switch (id) {
            case ColumnId.ToDo: return 'border-t-blue-500';
            case ColumnId.InProgress: return 'border-t-yellow-500';
            case ColumnId.InReview: return 'border-t-purple-500';
            case ColumnId.Done: return 'border-t-green-500';
        }
    }

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-w-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg p-3 transition-all duration-300 ${isDragOver ? 'bg-primary-100 dark:bg-primary-900/50' : ''}`}
        >
            <div className={`p-2 mb-4 rounded-t-lg border-t-4 ${getBorderColor(column.id)}`}>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{column.title} <span className="text-sm font-normal text-gray-500">{tasks.length}</span></h3>
            </div>
            <div className="space-y-3 h-full overflow-y-auto">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                ))}
            </div>
        </div>
    );
};


const ProjectBoard: React.FC = () => {
  const { state, dispatch } = useAppState();
  const { project, currentUser } = state;
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleOpenNewTaskModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleDrop = (columnId: ColumnId) => {
    const taskId = localStorage.getItem('draggingTaskId');
    if(taskId) {
        dispatch({ type: 'MOVE_TASK', payload: { taskId, newStatus: columnId } });
        localStorage.removeItem('draggingTaskId');
    }
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{project.name}</h1>
            {(currentUser?.role === Role.Admin || currentUser?.role === Role.Manager) && (
                <button 
                    onClick={handleOpenNewTaskModal} 
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow"
                >
                    <ion-icon name="add-outline"></ion-icon>
                    New Task
                </button>
            )}
        </div>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {project.columns.map(column => (
          <BoardColumn
            key={column.id}
            column={column}
            tasks={project.tasks.filter(task => task.status === column.id)}
            onTaskClick={handleTaskClick}
            onDrop={handleDrop}
          />
        ))}
      </div>
      <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} task={selectedTask} />
    </div>
  );
};

export default ProjectBoard;
