'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, AlignLeft, Flag, User } from 'lucide-react';
import { Task, Status } from '@/lib/types';
import { clsx } from 'clsx';
import { useBoardStore } from '@/hooks/use-board-store';
import { toast } from 'sonner';

interface TaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
}

const STATUS_OPTIONS: { status: Status; label: string; color: string; dot: string }[] = [
    { status: 'Todo', label: 'Todo', color: 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800', dot: 'bg-slate-400' },
    { status: 'In Progress', label: 'In Progress', color: 'border-amber-500/40 text-amber-300 hover:border-amber-500/70 hover:bg-amber-500/10', dot: 'bg-amber-400' },
    { status: 'Done', label: 'Completed', color: 'border-emerald-500/40 text-emerald-300 hover:border-emerald-500/70 hover:bg-emerald-500/10', dot: 'bg-emerald-400' },
];

export const TaskDetailsModal = ({ isOpen, onClose, task }: TaskDetailsModalProps) => {
    const { updateTask } = useBoardStore();

    if (!task) return null;

    const priorityColors = {
        Low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        High: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    const formattedDate = new Date(task.createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const handleStatusChange = (newStatus: Status) => {
        if (newStatus === task.status) return;
        updateTask(task.id, { status: newStatus });
        const label = STATUS_OPTIONS.find(s => s.status === newStatus)?.label ?? newStatus;
        toast.success(`Moved to ${label}`, { description: task.title });
    };

    const currentStatusLabel = STATUS_OPTIONS.find(s => s.status === task.status)?.label ?? task.status;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 60 }}
                        className="relative w-full sm:max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 p-4 border-b border-slate-800 shrink-0">
                            <span className={clsx(
                                'text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-widest shadow-sm',
                                priorityColors[task.priority]
                            )}>
                                {task.priority}
                            </span>
                            <span className="text-xs font-medium text-slate-400 border border-slate-800 bg-slate-800/50 px-2 py-0.5 rounded-lg">
                                {currentStatusLabel}
                            </span>
                            <div className="flex-1" />
                            <button
                                onClick={onClose}
                                className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
                            {/* Title */}
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">{task.title}</h2>

                            {/* Meta grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="flex items-start gap-3">
                                    <User size={15} className="text-slate-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assignee</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                                                {task.assignee?.name?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-sm text-slate-200 font-medium">
                                                {task.assignee?.name || 'Unassigned'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Flag size={15} className="text-slate-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Project</p>
                                        <span className="text-sm text-slate-200 font-medium">{task.project || 'No Project'}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar size={15} className="text-slate-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Created</p>
                                        <span className="text-sm text-slate-200 font-medium">{formattedDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Change */}
                            <div className="border-t border-slate-800/60 pt-5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Move to</p>
                                <div className="flex gap-2">
                                    {STATUS_OPTIONS.map(({ status, label, color, dot }) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(status)}
                                            className={clsx(
                                                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200',
                                                task.status === status
                                                    ? 'opacity-40 cursor-default scale-95'
                                                    : color + ' cursor-pointer hover:scale-[1.03] active:scale-95'
                                            )}
                                            disabled={task.status === status}
                                        >
                                            <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dot)} />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="border-t border-slate-800/60 pt-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlignLeft size={15} className="text-slate-500" />
                                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</h3>
                                </div>
                                {task.description ? (
                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{task.description}</p>
                                ) : (
                                    <p className="text-slate-500 text-sm italic">No description provided.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
