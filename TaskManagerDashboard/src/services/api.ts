import axios from 'axios';
import type { Task } from '../types';

// Using JSONPlaceholder as a mock API
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Convert JSONPlaceholder posts to our Task format
const convertPostToTask = (post: any): Task => ({
  id: post.id,
  title: post.title,
  description: post.body,
  status: ['Pending', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)], // Random status for demo
});

// API functions
export const taskAPI = {
  // Fetch all tasks (using posts from JSONPlaceholder)
  async fetchTasks(): Promise<Task[]> {
    try {
      const response = await api.get('/posts?_limit=10'); // Limit to 10 posts for demo
      return response.data.map(convertPostToTask);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Create a new task
  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
      const response = await api.post('/posts', {
        title: task.title,
        body: task.description,
        userId: 1,
      });
      
      // Convert the response back to our Task format
      return convertPostToTask(response.data);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    try {
      const response = await api.put(`/posts/${id}`, {
        title: updates.title,
        body: updates.description,
        userId: 1,
      });
      
      return convertPostToTask(response.data);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  async deleteTask(id: number): Promise<void> {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
}; 