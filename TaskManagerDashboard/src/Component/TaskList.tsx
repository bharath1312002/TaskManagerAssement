import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskItem from './TaskItem';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  updateTask: (id: number, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  darkMode: boolean;
}

const SortableTaskItem = ({ task, updateTask, deleteTask, darkMode, index }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id.toString() });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskItem 
        task={task} 
        updateTask={updateTask} 
        deleteTask={deleteTask} 
        darkMode={darkMode}
        dragListeners={listeners}
      />
    </div>
  );
};

const TaskList = ({ tasks, updateTask, deleteTask, darkMode }: TaskListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {tasks.length > 0 ? (
        tasks.map((task: Task, index: number) => (
          <SortableTaskItem
            key={task.id}
            task={task}
            updateTask={updateTask}
            deleteTask={deleteTask}
            darkMode={darkMode}
            index={index}
          />
        ))
      ) : (
        <p className="text-center p-5 rounded-lg bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300">
          No tasks found. Add a new task to get started!
        </p>
      )}
    </div>
  );
};

export default TaskList;