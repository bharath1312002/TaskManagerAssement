import { useState } from 'react';
import type { Task } from '../types';

interface TaskFormProps {
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  darkMode: boolean;
}

const TaskForm = ({ addTask, darkMode }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await addTask({
        title,
        description,
        status
      });
      
      // Reset form on success
      setTitle('');
      setDescription('');
      setStatus('Pending');
    } catch (error) {
      // Error is handled in the parent component
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`flex flex-col gap-4 mb-8 p-5 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={isSubmitting}
        className={`p-3 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSubmitting}
        className={`p-3 rounded border min-h-[80px] ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      <select 
        value={status} 
        onChange={(e) => setStatus(e.target.value)}
        disabled={isSubmitting}
        className={`p-3 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`p-3 rounded bg-primary text-white font-medium hover:bg-secondary transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Adding Task...' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;