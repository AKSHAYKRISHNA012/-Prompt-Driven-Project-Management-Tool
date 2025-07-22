
import React, { useState, useEffect, useRef } from 'react';
import Modal from './ui/Modal';
import { Task, ColumnId, TaskPriority, Role } from '../types';
import { useAppState } from '../context/AppContext';
import { USERS } from '../constants';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const { state, dispatch } = useAppState();
  const { project, currentUser } = state;
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [newComment, setNewComment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: '',
        description: '',
        status: ColumnId.ToDo,
        priority: TaskPriority.Medium,
        assigneeId: null,
        dueDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [task, isOpen]);

  const canEdit = currentUser?.role === Role.Admin || currentUser?.role === Role.Manager;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.title) return;
    if (task) {
      dispatch({ type: 'UPDATE_TASK', payload: { ...task, ...formData } as Task });
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        comments: [],
        attachments: [],
        ...formData,
      } as Task;
      dispatch({ type: 'ADD_TASK', payload: newTask });
       dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `notif-${newTask.id}`,
          message: `New task "${newTask.title}" has been created.`,
          read: false,
          timestamp: new Date().toISOString(),
        },
      });
    }
    onClose();
  };

  const handleAddComment = () => {
    if (newComment.trim() && currentUser) {
        dispatch({ type: 'ADD_COMMENT', payload: { taskId: task!.id, userId: currentUser.id, content: newComment } });
        setNewComment('');
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && task) {
        const file = e.target.files[0];
        dispatch({ type: 'ADD_ATTACHMENT', payload: { taskId: task.id, file: { name: file.name, type: file.type } } });
    }
  };

  const getAssignee = (userId: string) => USERS.find(u => u.id === userId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create New Task'}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title || ''}
            onChange={handleChange}
            disabled={!canEdit}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />
          <textarea
            name="description"
            placeholder="Task Description"
            value={formData.description || ''}
            onChange={handleChange}
            disabled={!canEdit}
            rows={5}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />
          
          {/* Comments Section */}
          {task && (
            <div>
              <h3 className="font-bold mb-2">Comments</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto mb-3 pr-2">
                {task.comments.map(comment => {
                  const user = getAssignee(comment.userId);
                  return (
                    <div key={comment.id} className="flex items-start gap-3">
                      <img src={user?.avatar} className="w-8 h-8 rounded-full mt-1" alt={user?.name}/>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                        <p className="font-semibold text-sm">{user?.name}</p>
                        <p className="text-sm">{comment.content}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{new Date(comment.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                />
                <button onClick={handleAddComment} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Send</button>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Status</span>
            <select name="status" value={formData.status} onChange={handleChange} disabled={!canEdit} className="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              {project.columns.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Assignee</span>
            <select name="assigneeId" value={formData.assigneeId || ''} onChange={handleChange} disabled={!canEdit} className="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <option value="">Unassigned</option>
              {USERS.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Priority</span>
            <select name="priority" value={formData.priority} onChange={handleChange} disabled={!canEdit} className="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Due Date</span>
            <input type="date" name="dueDate" value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''} onChange={handleChange} disabled={!canEdit} className="w-full mt-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"/>
          </label>
          {task && (
            <div>
              <h3 className="font-bold mb-2">Attachments</h3>
              <ul className="space-y-1 text-sm list-disc list-inside">
                {task.attachments.map(att => <li key={att.id}>{att.name}</li>)}
              </ul>
              <input type="file" ref={fileInputRef} onChange={onFileSelected} className="hidden"/>
              <button onClick={handleAttachFile} className="w-full mt-2 text-sm flex items-center justify-center gap-2 px-3 py-2 border border-dashed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <ion-icon name="attach-outline"></ion-icon> Add Attachment
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button onClick={onClose} className="px-4 py-2 mr-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save</button>
      </div>
    </Modal>
  );
};

export default TaskModal;
