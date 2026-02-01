'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TaskColumn from './TaskColumn';
import { Task, TaskStatus } from '@/types';


interface TaskBoardProps {
  projectId: string;
}

export default function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    // Optimistic update
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Update on server
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      // Revert on error
      fetchTasks();
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    console.log('Add task to', status);
  };

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task);
  };

  if (loading) {
    return (
      <div className="flex gap-6 p-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 min-w-[300px] bg-gray-50 rounded-xl p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const tasksByStatus: Record<TaskStatus, Task[]> = {
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    IN_REVIEW: tasks.filter(t => t.status === 'IN_REVIEW'),
    DONE: tasks.filter(t => t.status === 'DONE'),
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600">Drag and drop to change status</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          <Plus className="w-5 h-5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <TaskColumn
            key={status}
            status={status as TaskStatus}
            tasks={statusTasks}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
          />
        ))}
      </div>
    </div>
  );
}