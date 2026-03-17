'use client';

import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Column as ColumnType, Task } from '@/lib/types';
import { TaskCard } from './task-card';
import { Plus, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onViewTask: (task: Task) => void;
}

export const Column = ({ column, tasks, onEditTask, onViewTask }: ColumnProps) => {
  return (
    <div className="flex flex-col w-full sm:flex-1 sm:min-w-[240px] md:min-w-[280px] h-auto sm:h-full bg-transparent group/column">
      <div className="flex items-center justify-between px-3 mb-5">
        <div className="flex items-center gap-3">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">
            {column.title}
          </h3>
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold bg-slate-900/80 text-slate-500 rounded-full ring-1 ring-slate-800/50 shadow-sm">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/column:opacity-100 transition-all duration-300">
          <button className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
            <Plus size={14} />
          </button>
          <button className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx(
              'flex-1 px-2 py-2 rounded-2xl transition-all duration-300 min-h-[120px] sm:min-h-[200px] border border-transparent overflow-y-auto',
              snapshot.isDraggingOver ? 'bg-slate-900/40 border-dashed border-slate-800/60' : 'bg-transparent'
            )}
          >
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} onEdit={onEditTask} onView={onViewTask} />
              ))}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
