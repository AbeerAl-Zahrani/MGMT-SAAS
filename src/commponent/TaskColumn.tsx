'use client';

import { useState } from 'react';
import { Plus, MoreVertical, Calendar, AlertCircle } from 'lucide-react';
import { Priority, Task, TaskStatus } from '@/types';



interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onDragOver: (e: React.DragEvent) => void;
  onAddTask?: (status: TaskStatus) => void;
  onTaskClick?: (task: Task) => void;
}

const columnConfigs: Record<TaskStatus, {
  title: string;
  color: string;
  textColor: string;
  dotColor: string;
}> = {
  TODO: {
    title: 'To Do',
    color: 'bg-gray-100',
    textColor: 'text-gray-700',
    dotColor: 'bg-gray-400',
  },
  IN_PROGRESS: {
    title: 'In Progress',
    color: 'bg-blue-100',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-500',
  },
  IN_REVIEW: {
    title: 'In Review',
    color: 'bg-purple-100',
    textColor: 'text-purple-700',
    dotColor: 'bg-purple-500',
  },
  DONE: {
    title: 'Done',
    color: 'bg-green-100',
    textColor: 'text-green-700',
    dotColor: 'bg-green-500',
  },
};

const priorityColors: Record<Priority, string> = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  MEDIUM: 'bg-blue-100 text-blue-700 border-blue-200',
  LOW: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function TaskColumn({
  status,
  tasks,
  onDrop,
  onDragOver,
  onAddTask,
  onTaskClick,
}: TaskColumnProps) {
  const config = columnConfigs[status];
  const taskCount = tasks.length;

  return (
    <div
      className="flex-1 min-w-[300px] bg-gray-50 rounded-xl p-4"
      onDrop={(e) => onDrop(e, status)}
      onDragOver={onDragOver}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${config.dotColor}`}></div>
          <h2 className="font-semibold text-gray-900">{config.title}</h2>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${config.color} ${config.textColor}`}
          >
            {taskCount}
          </span>
        </div>
        {onAddTask && (
          <button
            onClick={() => onAddTask(status)}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      <div className="space-y-3 min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick?.(task)}
          />
        ))}
      </div>

      {taskCount === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
          <p className="text-sm">No tasks yet</p>
          {onAddTask && (
            <button
              onClick={() => onAddTask(status)}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
            >
              Add first task
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick?: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task.id);
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-move hover:shadow-md transition-all group relative"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-900 flex-1 pr-2">
          {task.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mb-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        {task.dueDate && (
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
        {task.assignee && (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(task.assignee.name)}
            </div>
          </div>
        )}
      </div>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-4 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
              Edit Task
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
              Change Priority
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
              Assign to
            </button>
            <hr className="my-1" />
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}