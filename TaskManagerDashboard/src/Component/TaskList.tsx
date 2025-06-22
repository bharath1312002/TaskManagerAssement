import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import type { DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  updateTask: (id: number, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  darkMode: boolean;
}

const TaskList = ({ tasks, updateTask, deleteTask, darkMode }: TaskListProps) => {
  return (
    <Droppable droppableId="tasks">
      {(provided: DroppableProvided) => (
        <div 
          className="flex flex-col gap-4"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {tasks.length > 0 ? (
            tasks.map((task: Task, index: number) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                {(provided: DraggableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskItem 
                      task={task} 
                      updateTask={updateTask} 
                      deleteTask={deleteTask} 
                      darkMode={darkMode}
                    />
                  </div>
                )}
              </Draggable>
            ))
          ) : (
            <p className="text-center p-5 rounded-lg bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300">
              No tasks found. Add a new task to get started!
            </p>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskList;