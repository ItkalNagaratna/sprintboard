'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useBoardStore } from '@/hooks/use-board-store';
import { Column } from './column';
import { TaskModal } from './task-modal';
import { TaskDetailsModal } from './task-details-modal';
import { Status, Priority, Task } from '@/lib/types';
import { clsx } from 'clsx';
import { Search, Filter, Plus, ChevronRight, ChevronDown, MoreHorizontal, Play, Calendar, Users, Briefcase, HelpCircle, ChevronLeft, Search as SearchIcon, Clock, Star, Bell, Menu } from 'lucide-react';

export const Board = () => {
  const {
    board,
    moveTask,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    toggleSidebar
  } = useBoardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [mounted, setMounted] = useState(false);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
    setIsDetailsOpen(true);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    moveTask(draggableId, source.droppableId as Status, destination.droppableId as Status, source.index, destination.index);
  };

  const filteredTasks = useMemo(() => {
    return Object.values(board.tasks).filter(task => {
      if (!task) return false;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [board.tasks, searchQuery, priorityFilter]);

  // ── Stats derived from board ──
  const allTasks = Object.values(board.tasks);
  const totalTasks = allTasks.length;
  const inProgressTasks = allTasks.filter(t => t.status === 'In Progress').length;
  const doneTasks = allTasks.filter(t => t.status === 'Done').length;
  const highPriorityTasks = allTasks.filter(t => t.priority === 'High').length;
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // ── Greeting ──
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 h-16 border-b border-slate-800 shrink-0 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="lg:hidden h-4 w-px bg-slate-800 mx-1" />
          <nav className="flex items-center gap-0.5 md:gap-1">
            <button className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-slate-100 bg-slate-800 rounded-md">Board</button>
            <div className="relative group hidden sm:block">
              <button className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors cursor-not-allowed">List</button>
              <span className="absolute -top-1 -right-1 bg-indigo-500/20 text-indigo-400 text-[8px] px-1 rounded border border-indigo-500/30 font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>
            </div>
            <div className="relative group hidden sm:block">
              <button className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors cursor-not-allowed">Timeline</button>
              <span className="absolute -top-1 -right-1 bg-indigo-500/20 text-indigo-400 text-[8px] px-1 rounded border border-indigo-500/30 font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative group hidden xl:block">
            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-48 xl:w-64 transition-all"
            />
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-0.5">
            {(['All', 'Low', 'Medium', 'High'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={clsx(
                  'px-2 md:px-2.5 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider rounded transition-all',
                  priorityFilter === p
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateTask}
            className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-4 sm:py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus size={18} className="sm:mr-2" />
            <span className="hidden sm:inline">New Task</span>
          </button>

        </div>
      </header>

      {/* Board Content */}
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">

        {/* ── Welcome Banner ── */}
        {mounted && (
          <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
            {/* Top gradient accent bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

            <div className="px-5 py-4">
              {/* Greeting row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-0.5">{dateLabel}</p>
                  <h2 className="text-lg font-bold text-slate-100 leading-tight">
                    {greeting}, <span className="text-indigo-400">Kai</span> 👋
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    You have <span className="font-semibold text-slate-200">{inProgressTasks} task{inProgressTasks !== 1 ? 's' : ''}</span> in progress and{' '}
                    <span className="font-semibold text-slate-200">{allTasks.filter(t => t.status === 'Todo').length} todo</span> waiting.
                  </p>
                </div>

                {/* Sprint progress */}
                <div className="sm:w-56 shrink-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Sprint Progress</span>
                    <span className="text-xs font-bold text-indigo-400">{completionPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">{doneTasks} of {totalTasks} tasks completed</p>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                {[
                  {
                    label: 'Total Tasks',
                    value: totalTasks,
                    icon: '📋',
                    color: 'text-slate-300',
                    bg: 'bg-slate-800/60',
                    border: 'border-slate-700/50',
                  },
                  {
                    label: 'In Progress',
                    value: inProgressTasks,
                    icon: '⚡',
                    color: 'text-amber-400',
                    bg: 'bg-amber-500/5',
                    border: 'border-amber-500/20',
                  },
                  {
                    label: 'Completed',
                    value: doneTasks,
                    icon: '✅',
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/5',
                    border: 'border-emerald-500/20',
                  },
                  {
                    label: 'High Priority',
                    value: highPriorityTasks,
                    icon: '🔥',
                    color: 'text-rose-400',
                    bg: 'bg-rose-500/5',
                    border: 'border-rose-500/20',
                  },
                ].map(({ label, value, icon, color, bg, border }) => (
                  <div
                    key={label}
                    className={clsx(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-default',
                      bg, border
                    )}
                  >
                    <span className="text-xl leading-none">{icon}</span>
                    <div>
                      <p className={clsx('text-xl font-bold leading-tight', color)}>{value}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {mounted && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 h-full w-full min-h-0 sm:min-w-[540px]">
              {board.columnOrder.map((columnId) => {
                const column = board.columns[columnId];
                const tasks = filteredTasks.filter(t => t.status === columnId);

                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    onEditTask={handleEditTask}
                    onViewTask={handleViewTask}
                  />
                );
              })}
            </div>
          </DragDropContext>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
      />

      <TaskDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setViewingTask(null);
        }}
        task={viewingTask}
      />
    </div>
  );
};
