import React, { useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaGripVertical } from 'react-icons/fa';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  updateTask: (id: number, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  darkMode: boolean;
  dragListeners?: any;
}

const TaskItem = ({ task, updateTask, deleteTask, darkMode, dragListeners }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({ ...task });
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await updateTask(task.id, editedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsDeleting(true);
        await deleteTask(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const statusColors: Record<string, string> = {
    'Pending': 'border-l-pending bg-pending/10 text-pending',
    'In Progress': 'border-l-inprogress bg-inprogress/10 text-inprogress',
    'Completed': 'border-l-completed bg-completed/10 text-completed'
  };

  return (
    <div className={`p-4 rounded-lg shadow-md mb-3 transition-transform hover:-translate-y-0.5
      ${darkMode ? 'bg-gray-800' : 'bg-white'}
      ${statusColors[task.status]} border-l-4
      ${isDeleting ? 'opacity-50' : ''}`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            disabled={isUpdating}
            className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Task title"
          />
          <textarea
            name="description"
            value={editedTask.description || ''}
            onChange={handleChange}
            disabled={isUpdating}
            rows={3}
            className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Task description (optional)"
          />
          <select
            name="status"
            value={editedTask.status}
            onChange={handleChange}
            disabled={isUpdating}
            className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="flex gap-2 justify-end">
            <button 
              onClick={handleSave}
              disabled={isUpdating}
              className={`p-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUpdating ? 'Saving...' : <FaCheck />}
            </button>
            <button 
              onClick={handleCancel}
              disabled={isUpdating}
              className={`p-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div className="flex-1 flex items-start gap-3">
            {dragListeners && (
              <div 
                {...dragListeners}
                className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaGripVertical />
              </div>
            )}
            <div className="flex-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">#{task.id}</span>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{task.title}</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>
                {task.status}
              </span>
              {task.description && (
                <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{task.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleEdit}
              disabled={isDeleting}
              className={`p-2 rounded hover:bg-opacity-20 ${darkMode ? 'hover:bg-white text-blue-400' : 'hover:bg-gray-200 text-blue-600'} ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaEdit />
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className={`p-2 rounded hover:bg-opacity-20 ${darkMode ? 'hover:bg-white text-red-400' : 'hover:bg-gray-200 text-red-600'} ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isDeleting ? 'Deleting...' : <FaTrash />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;