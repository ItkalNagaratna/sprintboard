'use client';

import React, { useState, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '@/lib/types';
import { Calendar, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useBoardStore } from '@/hooks/use-board-store';
import { toast } from 'sonner';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onView: (task: Task) => void;
}

export const TaskCard = React.memo(({ task, index, onView }: TaskCardProps & { index: number }) => {
  const [mounted, setMounted] = useState(false);
  const { deleteTask } = useBoardStore();

  useEffect(() => {
    // Break the synchronous render cycle to avoid cascading renders
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const priorityColors = {
    Low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    High: 'bg-red-500/10 text-red-400 border-red-500/20',
  } as const;

  const formattedDate = mounted
    ? new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : '';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
    toast.error('Task deleted', { description: task.title });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onView(task)}
          className={clsx(
            'group mb-4 p-4 rounded-2xl border bg-slate-900/40 backdrop-blur-sm transition-all duration-300 cursor-pointer',
            'hover:border-slate-700/80 hover:bg-slate-800/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5',
            snapshot.isDragging
              ? 'shadow-2xl border-indigo-500/50 scale-[1.02] bg-slate-900 ring-4 ring-indigo-500/10 z-50'
              : 'border-slate-800/60'
          )}
        >
          {/* Top row: priority + delete */}
          <div className="flex items-start justify-between mb-3">
            <div className={clsx(
              'text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-widest shadow-sm',
              priorityColors[task.priority]
            )}>
              {task.priority}
            </div>

            <button
              onClick={handleDelete}
              className="p-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Delete task"
            >
              <Trash2 size={13} />
            </button>
          </div>

          <h4 className="text-sm font-bold text-slate-100 mb-1.5 line-clamp-2 tracking-tight group-hover:text-indigo-400 transition-colors">
            {task.title}
          </h4>

          <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed font-medium">
            {task.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/40">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 shadow-sm relative">
                  {task.assignee?.avatar ? (
                    <img
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold">
                      {task.assignee?.name?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <span className="text-[10px] text-slate-400 font-bold tracking-tight">
                {task.assignee?.name || 'Unassigned'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 bg-slate-800/40 px-2 py-1 rounded-md border border-slate-800/50">
              <Calendar size={12} className="text-slate-600" />
              <span className="text-[10px] font-bold tracking-tighter">{formattedDate}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});

TaskCard.displayName = 'TaskCard';
