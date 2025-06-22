import React, { useState, useEffect } from 'react';
import TaskList from './Component/TaskList'
import TaskForm from './Component/TaskForm';
import SearchFilter from './Component/SearchFilter';
import { DragDropContext } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import type { Task } from './types';
import { taskAPI } from './services/api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTasks = await taskAPI.fetchTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to fetch tasks. Please try again.');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      const isDarkMode = JSON.parse(savedDarkMode);
      setDarkMode(isDarkMode);
    }
  }, []);

  useEffect(() => {
    let result = tasks;
    
    if (searchTerm) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(task => task.status === statusFilter);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, statusFilter]);

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    try {
      setError(null);
      const createdTask = await taskAPI.createTask(newTask);
      setTasks(prevTasks => [...prevTasks, createdTask]);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    }
  };

  const updateTask = async (id: number, updatedTask: Partial<Task>) => {
    try {
      setError(null);
      const updatedTaskData = await taskAPI.updateTask(id, updatedTask);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTaskData : task)
      );
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      setError(null);
      await taskAPI.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const onDragEnd = (result: DropResult) => {
    console.log('Drag ended:', result);
    
    if (!result.destination) return;
    
    // If source and destination are the same, no need to do anything
    if (result.source.index === result.destination.index) return;
    
    console.log('Reordering tasks...');
    
    // Create a copy of the filtered tasks
    const newFilteredTasks = Array.from(filteredTasks);
    
    // Remove the task from its source position
    const [movedTask] = newFilteredTasks.splice(result.source.index, 1);
    
    // Insert the task at its destination position
    newFilteredTasks.splice(result.destination.index, 0, movedTask);
    
    // Update the original tasks array to match the new order
    // We need to preserve tasks that are not in the filtered list
    const newTasks = [...tasks];
    
    // Remove all filtered tasks from the original array
    const filteredTaskIds = new Set(filteredTasks.map(task => task.id));
    const nonFilteredTasks = newTasks.filter(task => !filteredTaskIds.has(task.id));
    
    // Insert the reordered filtered tasks at the beginning
    const finalTasks = [...newFilteredTasks, ...nonFilteredTasks];
    
    console.log('New tasks order:', finalTasks);
    setTasks(finalTasks);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Save to localStorage
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // Apply dark class to html element for Tailwind dark mode
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize dark mode on component mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen p-5 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary dark:text-blue-400">Task Manager</h1>
          <button 
            onClick={toggleDarkMode} 
            className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
            >
              ✕
            </button>
          </div>
        )}
        
        <TaskForm addTask={addTask} darkMode={darkMode} />
        
        <SearchFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          darkMode={darkMode}
        />
        
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading tasks...</span>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <TaskList 
              tasks={filteredTasks} 
              updateTask={updateTask} 
              deleteTask={deleteTask} 
              darkMode={darkMode}
            />
          </DragDropContext>
        )}
      </div>
    </div>
  );
}

export default App;