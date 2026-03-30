'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import {
    Bell,
    CheckCircle2,
    Circle,
    MessageSquare,
    GitPullRequest,
    AlertCircle,
    Star,
    Zap,
    Users,
    AtSign,
    Filter,
    CheckCheck,
    Trash2,
    Archive,
    ChevronDown,
    Search,
    Settings,
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

type Category = 'all' | 'mentions' | 'tasks' | 'comments' | 'team';

interface Notification {
    id: string;
    type: 'mention' | 'task' | 'comment' | 'team' | 'alert';
    title: string;
    body: string;
    project: string;
    projectColor: string;
    actor: string;
    actorInitials: string;
    actorColor: string;
    timestamp: string;
    isRead: boolean;
    isStarred: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'mention',
        title: 'You were mentioned in a comment',
        body: '@kai can you review the updated wireframes for the Kore 2.0 dashboard before EOD?',
        project: 'Kore 2.0',
        projectColor: 'bg-indigo-500',
        actor: 'Alex Rivera',
        actorInitials: 'AR',
        actorColor: 'bg-violet-600',
        timestamp: '2m ago',
        isRead: false,
        isStarred: false,
    },
    {
        id: '2',
        type: 'task',
        title: 'Task assigned to you',
        body: 'Implement dark mode toggle for the Settings panel — High priority',
        project: 'Performance',
        projectColor: 'bg-emerald-500',
        actor: 'Sam Chen',
        actorInitials: 'SC',
        actorColor: 'bg-teal-600',
        timestamp: '18m ago',
        isRead: false,
        isStarred: true,
    },
    {
        id: '3',
        type: 'comment',
        title: 'New comment on your task',
        body: 'Left a review on "Refactor auth middleware" — looks good, just a few nitpicks on error handling.',
        project: 'Kore 2.0',
        projectColor: 'bg-indigo-500',
        actor: 'Jordan Park',
        actorInitials: 'JP',
        actorColor: 'bg-rose-600',
        timestamp: '1h ago',
        isRead: false,
        isStarred: false,
    },
    {
        id: '4',
        type: 'alert',
        title: 'Sprint deadline approaching',
        body: 'Sprint "Q2 Launch" ends in 2 days. 4 tasks are still in progress.',
        project: 'Marketing Site',
        projectColor: 'bg-amber-500',
        actor: 'System',
        actorInitials: 'SY',
        actorColor: 'bg-slate-600',
        timestamp: '3h ago',
        isRead: true,
        isStarred: false,
    },
    {
        id: '5',
        type: 'team',
        title: 'New team member joined',
        body: 'Maya Patel joined the Design team. Welcome them to the workspace!',
        project: 'Design',
        projectColor: 'bg-pink-500',
        actor: 'Maya Patel',
        actorInitials: 'MP',
        actorColor: 'bg-pink-600',
        timestamp: '5h ago',
        isRead: true,
        isStarred: false,
    },
    {
        id: '6',
        type: 'task',
        title: 'Task status updated',
        body: '"Optimize image pipeline" moved from In Progress → Done by Sam Chen',
        project: 'Performance',
        projectColor: 'bg-emerald-500',
        actor: 'Sam Chen',
        actorInitials: 'SC',
        actorColor: 'bg-teal-600',
        timestamp: '6h ago',
        isRead: true,
        isStarred: false,
    },
    {
        id: '7',
        type: 'mention',
        title: 'You were mentioned in a task',
        body: 'Added @kai as a collaborator on "Redesign onboarding flow"',
        project: 'Mobile App',
        projectColor: 'bg-rose-500',
        actor: 'Taylor Kim',
        actorInitials: 'TK',
        actorColor: 'bg-orange-600',
        timestamp: 'Yesterday',
        isRead: true,
        isStarred: true,
    },
    {
        id: '8',
        type: 'comment',
        title: 'Thread reply',
        body: 'Replied in "API rate limiting strategy" — I agree, exponential backoff is the way to go.',
        project: 'Kore 2.0',
        projectColor: 'bg-indigo-500',
        actor: 'Jordan Park',
        actorInitials: 'JP',
        actorColor: 'bg-rose-600',
        timestamp: 'Yesterday',
        isRead: true,
        isStarred: false,
    },
];

const ICON_MAP = {
    mention: AtSign,
    task: CheckCircle2,
    comment: MessageSquare,
    team: Users,
    alert: AlertCircle,
};

const TYPE_COLOR: Record<string, string> = {
    mention: 'text-violet-400 bg-violet-500/10',
    task: 'text-indigo-400 bg-indigo-500/10',
    comment: 'text-sky-400 bg-sky-500/10',
    team: 'text-emerald-400 bg-emerald-500/10',
    alert: 'text-amber-400 bg-amber-500/10',
};

const CATEGORIES: { id: Category; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'mentions', label: 'Mentions', icon: AtSign },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'team', label: 'Team', icon: Users },
];

export default function InboxPage() {
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
    const [activeCategory, setActiveCategory] = useState<Category>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const filtered = notifications.filter((n) => {
        if (showUnreadOnly && n.isRead) return false;
        if (activeCategory === 'mentions' && n.type !== 'mention') return false;
        if (activeCategory === 'tasks' && n.type !== 'task' && n.type !== 'alert') return false;
        if (activeCategory === 'comments' && n.type !== 'comment') return false;
        if (activeCategory === 'team' && n.type !== 'team') return false;
        if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.body.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    const toggleRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: !n.isRead } : n));
    const toggleStar = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isStarred: !n.isStarred } : n));
    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const selectedNotif = notifications.find((n) => n.id === selectedId) ?? null;

    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between px-6 h-16 border-b border-slate-800/80 shrink-0 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Bell size={18} className="text-slate-400" />
                        <h1 className="text-base font-semibold text-slate-100">Inbox</h1>
                        {unreadCount > 0 && (
                            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={markAllRead}
                            disabled={unreadCount === 0}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <CheckCheck size={13} />
                            Mark all read
                        </button>
                        <button className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all">
                            <Settings size={15} />
                        </button>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel — Notification List */}
                    <div className="w-full lg:w-[420px] xl:w-[460px] flex flex-col border-r border-slate-800/80 shrink-0 overflow-hidden">
                        {/* Search + Filter */}
                        <div className="px-4 py-3 border-b border-slate-800/60 space-y-3">
                            <div className="relative">
                                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search notifications..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                />
                            </div>
                            {/* Category Tabs */}
                            <div className="flex gap-0.5 overflow-x-auto scrollbar-none">
                                {CATEGORIES.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveCategory(id)}
                                        className={clsx(
                                            'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                                            activeCategory === id
                                                ? 'bg-indigo-500/15 text-indigo-300'
                                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
                                        )}
                                    >
                                        <Icon size={11} />
                                        {label}
                                    </button>
                                ))}
                            </div>
                            {/* Unread Toggle */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                                    className={clsx(
                                        'flex items-center gap-1.5 text-xs font-medium transition-all',
                                        showUnreadOnly ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                                    )}
                                >
                                    <div className={clsx('w-7 h-4 rounded-full relative transition-all', showUnreadOnly ? 'bg-indigo-600' : 'bg-slate-700')}>
                                        <div className={clsx('absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all', showUnreadOnly ? 'left-3.5' : 'left-0.5')} />
                                    </div>
                                    Unread only
                                </button>
                                <span className="text-xs text-slate-600">{filtered.length} notification{filtered.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        {/* Notification Items */}
                        <div className="flex-1 overflow-y-auto">
                            <AnimatePresence initial={false}>
                                {filtered.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center h-64 gap-3 text-center px-8"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center">
                                            <Bell size={22} className="text-slate-600" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-500">No notifications</p>
                                        <p className="text-xs text-slate-600">You&apos;re all caught up!</p>
                                    </motion.div>
                                ) : (
                                    filtered.map((notif) => {
                                        const Icon = ICON_MAP[notif.type];
                                        const isSelected = selectedId === notif.id;
                                        return (
                                            <motion.div
                                                key={notif.id}
                                                layout
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -20, height: 0 }}
                                                transition={{ duration: 0.18 }}
                                                onClick={() => { setSelectedId(notif.id); if (!notif.isRead) toggleRead(notif.id); }}
                                                className={clsx(
                                                    'group relative flex gap-3 px-4 py-3.5 cursor-pointer border-b border-slate-800/40 transition-colors',
                                                    isSelected ? 'bg-indigo-500/8 border-l-2 border-l-indigo-500' : 'hover:bg-slate-900/50',
                                                    !notif.isRead && 'bg-slate-900/30'
                                                )}
                                            >
                                                {/* Unread dot */}
                                                {!notif.isRead && (
                                                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                )}

                                                {/* Actor Avatar */}
                                                <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5', notif.actorColor)}>
                                                    {notif.actorInitials}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                            <span className={clsx('flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md', TYPE_COLOR[notif.type])}>
                                                                <Icon size={9} />
                                                                {notif.type}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <span className={clsx('w-1.5 h-1.5 rounded-full', notif.projectColor)} />
                                                                <span className="text-[10px] text-slate-500 font-medium">{notif.project}</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] text-slate-600 shrink-0">{notif.timestamp}</span>
                                                    </div>
                                                    <p className={clsx('text-sm leading-snug truncate', notif.isRead ? 'text-slate-400 font-normal' : 'text-slate-200 font-medium')}>
                                                        {notif.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.body}</p>
                                                </div>

                                                {/* Hover Actions */}
                                                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity bg-slate-900/80 rounded-lg p-0.5 backdrop-blur-sm">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleStar(notif.id); }}
                                                        className="p-1 rounded hover:bg-slate-700 transition-colors"
                                                    >
                                                        <Star size={12} className={notif.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-500'} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleRead(notif.id); }}
                                                        className="p-1 rounded hover:bg-slate-700 transition-colors"
                                                    >
                                                        {notif.isRead ? <Circle size={12} className="text-slate-500" /> : <CheckCircle2 size={12} className="text-indigo-400" />}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                                                        className="p-1 rounded hover:bg-rose-500/20 transition-colors"
                                                    >
                                                        <Trash2 size={12} className="text-slate-500 hover:text-rose-400" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Panel — Detail View */}
                    <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-slate-950/50">
                        <AnimatePresence mode="wait">
                            {selectedNotif ? (
                                <motion.div
                                    key={selectedNotif.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full max-w-lg px-8"
                                >
                                    {/* Icon */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', TYPE_COLOR[selectedNotif.type])}>
                                            {React.createElement(ICON_MAP[selectedNotif.type], { size: 18 })}
                                        </div>
                                        <div>
                                            <span className={clsx('text-xs font-semibold capitalize', TYPE_COLOR[selectedNotif.type].split(' ')[0])}>
                                                {selectedNotif.type}
                                            </span>
                                            <p className="text-[11px] text-slate-500">{selectedNotif.timestamp}</p>
                                        </div>
                                        <div className="ml-auto flex items-center gap-1.5">
                                            <button
                                                onClick={() => toggleStar(selectedNotif.id)}
                                                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                                            >
                                                <Star size={15} className={selectedNotif.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-500'} />
                                            </button>
                                            <button
                                                onClick={() => removeNotification(selectedNotif.id)}
                                                className="p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                                            >
                                                <Archive size={15} className="text-slate-500 hover:text-rose-400" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-semibold text-slate-100 mb-3 leading-snug">{selectedNotif.title}</h2>

                                    {/* Body */}
                                    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl mb-6">
                                        <p className="text-sm text-slate-300 leading-relaxed">{selectedNotif.body}</p>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-slate-600 w-20 text-xs">From</span>
                                            <div className="flex items-center gap-2">
                                                <div className={clsx('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white', selectedNotif.actorColor)}>
                                                    {selectedNotif.actorInitials}
                                                </div>
                                                <span className="text-slate-300 font-medium">{selectedNotif.actor}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-slate-600 w-20 text-xs">Project</span>
                                            <div className="flex items-center gap-2">
                                                <span className={clsx('w-2 h-2 rounded-full', selectedNotif.projectColor)} />
                                                <span className="text-slate-300 font-medium">{selectedNotif.project}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="flex gap-2 mt-8">
                                        <button className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
                                            Open in project
                                        </button>
                                        <button
                                            onClick={() => toggleRead(selectedNotif.id)}
                                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-all active:scale-[0.98]"
                                        >
                                            {selectedNotif.isRead ? 'Mark unread' : 'Mark read'}
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-4 text-center px-12"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                                        <Bell size={28} className="text-slate-700" />
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-slate-500 mb-1">Select a notification</p>
                                        <p className="text-sm text-slate-600">Click a notification on the left to view its details here</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
