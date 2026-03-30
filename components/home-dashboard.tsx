'use client';

import React, { useState, useEffect } from 'react';
import { useBoardStore } from '@/hooks/use-board-store';
import { clsx } from 'clsx';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
    CheckCircle2,
    Clock,
    Zap,
    LayoutDashboard,
    ChevronRight,
    Menu,
} from 'lucide-react';

const TEAM = [
    { name: 'Kai Lee', initials: 'KL', color: 'bg-indigo-600', role: 'Product Lead' },
    { name: 'Masanori Abe', initials: 'MA', color: 'bg-emerald-600', role: 'Engineer' },
    { name: 'James Williams', initials: 'JW', color: 'bg-amber-600', role: 'Designer' },
    { name: 'Florence Rossi', initials: 'FR', color: 'bg-rose-600', role: 'QA Engineer' },
];

const ACTIVITY = [
    { user: 'KL', color: 'bg-indigo-600', action: 'moved', target: 'Launch Kore 2.0 beta', to: 'In Progress', time: '2m ago' },
    { user: 'FR', color: 'bg-rose-600', action: 'completed', target: 'Add testing for Kore Projects', to: 'Done', time: '1h ago' },
    { user: 'MA', color: 'bg-emerald-600', action: 'created', target: 'Offline mode polish', to: 'In Progress', time: '3h ago' },
    { user: 'JW', color: 'bg-amber-600', action: 'started', target: 'Schedule bug bash', to: 'In Progress', time: '5h ago' },
    { user: 'KL', color: 'bg-indigo-600', action: 'created', target: 'Refactor project creation', to: 'Todo', time: 'Yesterday' },
];

const QUICK_LINKS = [
    { icon: LayoutDashboard, label: 'Kanban Board', desc: 'Drag & drop task management', href: '/tasks', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { icon: CheckCircle2, label: 'My Tasks', desc: 'View all your assigned tasks', href: '/tasks', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { icon: Zap, label: 'Workflow', desc: 'Automate repetitive processes', href: '/workflow', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
];

const statusColor: Record<string, string> = {
    'Todo': 'text-slate-400',
    'In Progress': 'text-amber-400',
    'Done': 'text-emerald-400',
};

const priorityDot: Record<string, string> = {
    'High': 'bg-rose-500',
    'Medium': 'bg-amber-500',
    'Low': 'bg-emerald-500',
};

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } }),
};

export function HomeDashboard() {
    const { board, toggleSidebar } = useBoardStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const allTasks = Object.values(board.tasks);
    const totalTasks = allTasks.length;
    const doneTasks = allTasks.filter(t => t.status === 'Done').length;
    const inProgressTasks = allTasks.filter(t => t.status === 'In Progress').length;
    const todoTasks = allTasks.filter(t => t.status === 'Todo').length;
    const highTasks = allTasks.filter(t => t.priority === 'High').length;
    const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    // Up to 4 most recent (non-done) tasks for the "upcoming" section
    const upcomingTasks = allTasks
        .filter(t => t.status !== 'Done')
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 4);

    const stats = [
        { label: 'Total Tasks', value: totalTasks, icon: CheckCircle2, color: 'text-slate-300', ring: 'ring-slate-700', bg: 'bg-slate-800/60' },
        { label: 'In Progress', value: inProgressTasks, icon: Clock, color: 'text-amber-400', ring: 'ring-amber-500/30', bg: 'bg-amber-500/5' },
        { label: 'Completed', value: doneTasks, icon: CheckCircle2, color: 'text-emerald-400', ring: 'ring-emerald-500/30', bg: 'bg-emerald-500/5' },
        { label: 'High Priority', value: highTasks, icon: Zap, color: 'text-rose-400', ring: 'ring-rose-500/30', bg: 'bg-rose-500/5' },
    ];

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-4 md:px-6 h-16 border-b border-slate-800 shrink-0 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="lg:hidden h-4 w-px bg-slate-800" />
                    <div>
                        <h1 className="text-sm font-semibold text-slate-100">Home</h1>
                        <p className="text-[10px] text-slate-500 hidden sm:block">{dateLabel}</p>
                    </div>
                </div>
                <Link
                    href="/tasks"
                    className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <LayoutDashboard size={15} />
                    <span>Go to Board</span>
                </Link>
            </header>

            {/* Scrollable content */}
            <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
                {mounted && (
                    <>
                        {/* ── Hero greeting ── */}
                        <motion.div
                            custom={0} variants={fadeUp} initial="hidden" animate="show"
                            className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60"
                        >
                            {/* gradient top line */}
                            <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
                            {/* background blobs */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl" />
                                <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl" />
                            </div>
                            <div className="relative px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1">{dateLabel}</p>
                                    <h2 className="text-2xl font-bold text-slate-100 leading-tight">
                                        {greeting}, <span className="text-indigo-400">Kai</span> 👋
                                    </h2>
                                    <p className="text-sm text-slate-400 mt-1.5 max-w-md">
                                        You&apos;re{' '}
                                        <span className="font-semibold text-indigo-300">{completionPct}% through your sprint.</span>{' '}
                                        {todoTasks > 0
                                            ? `${todoTasks} task${todoTasks > 1 ? 's' : ''} still waiting to be picked up.`
                                            : 'All tasks are in motion — great work!'}
                                    </p>
                                </div>
                                {/* Sprint ring */}
                                <div className="flex flex-col items-center shrink-0">
                                    <div className="relative w-20 h-20">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                                            <circle cx="40" cy="40" r="32" fill="none" stroke="#1e293b" strokeWidth="8" />
                                            <circle
                                                cx="40" cy="40" r="32" fill="none"
                                                stroke="url(#prog)" strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 32}`}
                                                strokeDashoffset={`${2 * Math.PI * 32 * (1 - completionPct / 100)}`}
                                                className="transition-all duration-700"
                                            />
                                            <defs>
                                                <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#6366f1" />
                                                    <stop offset="100%" stopColor="#a855f7" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-lg font-bold text-slate-100">{completionPct}%</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 text-center">Sprint Complete</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── Stat cards ── */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {stats.map(({ label, value, icon: Icon, color, ring, bg }, i) => (
                                <motion.div
                                    key={label} custom={i + 1} variants={fadeUp} initial="hidden" animate="show"
                                    className={clsx(
                                        'flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border ring-1 transition-all duration-200 hover:scale-[1.02] cursor-default',
                                        bg,
                                        ring,
                                        'border-transparent'
                                    )}
                                >
                                    <div className={clsx('p-2 rounded-xl bg-slate-900/80')}>
                                        <Icon size={18} className={color} />
                                    </div>
                                    <div>
                                        <p className={clsx('text-2xl font-bold leading-tight', color)}>{value}</p>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* ── Bottom grid: Upcoming + Activity + Quick Links ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                            {/* Upcoming tasks */}
                            <motion.div
                                custom={5} variants={fadeUp} initial="hidden" animate="show"
                                className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                            >
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Upcoming Tasks</h3>
                                    <Link href="/tasks" className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors">
                                        View all <ChevronRight size={10} />
                                    </Link>
                                </div>
                                <div className="divide-y divide-slate-800/60">
                                    {upcomingTasks.length === 0 ? (
                                        <p className="px-4 py-6 text-xs text-slate-500 text-center">No upcoming tasks 🎉</p>
                                    ) : (
                                        upcomingTasks.map(task => (
                                            <div key={task.id} className="px-4 py-3 hover:bg-slate-800/40 transition-colors group">
                                                <div className="flex items-start gap-2.5">
                                                    <div className={clsx('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', priorityDot[task.priority])} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-slate-200 font-medium truncate group-hover:text-white transition-colors">{task.title}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className={clsx('text-[10px] font-semibold', statusColor[task.status])}>{task.status}</span>
                                                            <span className="text-slate-700">·</span>
                                                            <span className="text-[10px] text-slate-500">{task.project}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>

                            {/* Recent activity */}
                            <motion.div
                                custom={6} variants={fadeUp} initial="hidden" animate="show"
                                className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                            >
                                <div className="px-4 py-3 border-b border-slate-800">
                                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Recent Activity</h3>
                                </div>
                                <div className="divide-y divide-slate-800/60">
                                    {ACTIVITY.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/40 transition-colors">
                                            <div className={clsx('w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5', item.color)}>
                                                {item.user}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-slate-300 leading-snug">
                                                    <span className="font-semibold capitalize">{item.action}</span>{' '}
                                                    <span className="text-slate-400 truncate">&quot;{item.target}&quot;</span>
                                                </p>
                                                <p className="text-[10px] text-slate-600 mt-0.5">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Right column: Quick Links + Team */}
                            <motion.div
                                custom={7} variants={fadeUp} initial="hidden" animate="show"
                                className="lg:col-span-1 flex flex-col gap-4"
                            >
                                {/* Quick Links */}
                                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-800">
                                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Quick Access</h3>
                                    </div>
                                    <div className="p-3 space-y-2">
                                        {QUICK_LINKS.map(({ icon: Icon, label, desc, href, color, bg, border }) => (
                                            <Link
                                                key={label}
                                                href={href}
                                                className={clsx(
                                                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-200 hover:scale-[1.02] group',
                                                    bg, border
                                                )}
                                            >
                                                <div className="p-1.5 rounded-lg bg-slate-900/60">
                                                    <Icon size={15} className={color} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">{label}</p>
                                                    <p className="text-[10px] text-slate-500 truncate">{desc}</p>
                                                </div>
                                                <ChevronRight size={12} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Team */}
                                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-800">
                                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Team</h3>
                                    </div>
                                    <div className="p-3 space-y-1.5">
                                        {TEAM.map(({ name, initials, color, role }) => (
                                            <div key={name} className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-800/50 transition-colors group cursor-default">
                                                <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0', color)}>
                                                    {initials}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors truncate">{name}</p>
                                                    <p className="text-[10px] text-slate-600 truncate">{role}</p>
                                                </div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Online" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
