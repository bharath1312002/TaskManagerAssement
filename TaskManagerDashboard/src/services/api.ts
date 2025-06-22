import type { Task } from '../types';

// Local storage key for tasks
const TASKS_STORAGE_KEY = 'taskManager_tasks';

// Helper functions for local storage
const getTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading tasks from storage:', error);
    return [];
  }
};

const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
  }
};

// Initialize with some sample data if storage is empty
const initializeSampleData = (): Task[] => {
  const existingTasks = getTasksFromStorage();
  if (existingTasks.length === 0) {
    const sampleTasks: Task[] = [
      {
        id: 1,
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the current project',
        status: 'In Progress'
      },
      {
        id: 2,
        title: 'Review code changes',
        description: 'Review pull requests and provide feedback',
        status: 'Pending'
      },
      {
        id: 3,
        title: 'Setup development environment',
        description: 'Configure local development environment for new team members',
        status: 'Completed'
      },
      {
        id: 4,
        title: 'Plan next sprint',
        description: 'Create user stories and estimate tasks for the upcoming sprint',
        status: 'Pending'
      },
      {
        id: 5,
        title: 'Fix critical bug in production',
        description: 'Investigate and fix the reported critical bug',
        status: 'In Progress'
      }
    ];
    saveTasksToStorage(sampleTasks);
    return sampleTasks;
  }
  return existingTasks;
};

// API functions
export const taskAPI = {
  // Fetch all tasks
  async fetchTasks(): Promise<Task[]> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const tasks = initializeSampleData();
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Create a new task
  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const tasks = getTasksFromStorage();
      const newTask: Task = {
        ...task,
        id: Math.max(0, ...tasks.map(t => t.id)) + 1
      };
      
      const updatedTasks = [...tasks, newTask];
      saveTasksToStorage(updatedTasks);
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const tasks = getTasksFromStorage();
      const taskIndex = tasks.findIndex(task => task.id === id);
      
      if (taskIndex === -1) {
        throw new Error(`Task with id ${id} not found`);
      }
      
      const updatedTask = { ...tasks[taskIndex], ...updates };
      tasks[taskIndex] = updatedTask;
      
      saveTasksToStorage(tasks);
      
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  async deleteTask(id: number): Promise<void> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const tasks = getTasksFromStorage();
      const filteredTasks = tasks.filter(task => task.id !== id);
      
      if (filteredTasks.length === tasks.length) {
        throw new Error(`Task with id ${id} not found`);
      }
      
      saveTasksToStorage(filteredTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
}; 