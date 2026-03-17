'use client';

import React, { useRef, useEffect } from 'react';
import {
  Home,
  CheckCircle2,
  Bell,
  Plus,
  Users,
  ChevronDown,
  Star,
  X,
  Settings,
  Globe,
  HelpCircle,
  Zap,
  LogOut,
  ChevronRight,
  Building2,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBoardStore } from '@/hooks/use-board-store';
import { clsx } from 'clsx';

const WORKSPACES = [
  { id: 'kore', name: 'Kore', label: 'WORKSPACE', color: 'bg-indigo-600', initial: 'K', active: true },
  { id: 'personal', name: 'Personal', label: 'WORKSPACE', color: 'bg-emerald-600', initial: 'P', active: false },
  { id: 'freelance', name: 'Freelance', label: 'WORKSPACE', color: 'bg-amber-600', initial: 'F', active: false },
];

export function Sidebar() {
  const [isProjectsOpen, setIsProjectsOpen] = React.useState(true);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [activeWorkspace, setActiveWorkspace] = React.useState(WORKSPACES[0]);
  const { isSidebarOpen, setSidebarOpen } = useBoardStore();

  const workspaceRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) {
        setIsWorkspaceOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: CheckCircle2, label: 'My Tasks', active: true },
    { icon: Bell, label: 'Inbox', active: false, badge: 3 },
  ];

  const projects = [
    { name: 'Kore 2.0', color: 'bg-indigo-500' },
    { name: 'Performance', color: 'bg-emerald-500' },
    { name: 'Marketing Site', color: 'bg-amber-500' },
    { name: 'Mobile App', color: 'bg-rose-500' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950">

      {/* ── Workspace Header with dropdown ── */}
      <div ref={workspaceRef} className="relative px-3 pt-3 pb-2">
        <button
          onClick={() => setIsWorkspaceOpen((v) => !v)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-900 transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg', activeWorkspace.color)}>
              {activeWorkspace.initial}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-slate-100 leading-tight">{activeWorkspace.name}</span>
              <span className="text-[9px] text-slate-500 font-medium uppercase tracking-widest">{activeWorkspace.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ChevronDown
              size={14}
              className={clsx('text-slate-500 group-hover:text-slate-300 transition-all duration-200', isWorkspaceOpen && 'rotate-180')}
            />
            <button
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(false); }}
              className="lg:hidden p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </button>

        {/* Workspace Dropdown */}
        <AnimatePresence>
          {isWorkspaceOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute left-3 right-3 top-[calc(100%-4px)] z-50 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="px-3 pt-3 pb-1.5">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Switch Workspace</p>
              </div>
              <div className="px-1.5 pb-1.5 space-y-0.5">
                {WORKSPACES.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => { setActiveWorkspace(ws); setIsWorkspaceOpen(false); }}
                    className={clsx(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150',
                      activeWorkspace.id === ws.id
                        ? 'bg-indigo-500/15 text-indigo-300'
                        : 'text-slate-300 hover:bg-slate-800 cursor-pointer'
                    )}
                  >
                    <div className={clsx('w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0', ws.color)}>
                      {ws.initial}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-xs leading-tight">{ws.name}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">{ws.label}</p>
                    </div>
                    {activeWorkspace.id === ws.id && (
                      <Check size={13} className="text-indigo-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-700/60 mx-2 my-1" />
              <div className="px-1.5 pb-2">
                <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all duration-150">
                  <Plus size={13} className="text-slate-500" />
                  <span className="font-medium">Create new workspace</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-5">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={clsx(
                'w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all',
                item.active ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={17} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Projects */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 group">
            <button
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors"
            >
              <ChevronDown size={11} className={clsx('transition-transform duration-200', !isProjectsOpen && '-rotate-90')} />
              Projects
            </button>
            <button className="p-1 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition-all opacity-0 group-hover:opacity-100">
              <Plus size={13} />
            </button>
          </div>
          {isProjectsOpen && (
            <div className="space-y-0.5">
              {projects.map((project) => (
                <button
                  key={project.name}
                  className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all group"
                >
                  <div className={clsx('w-2 h-2 rounded-full shrink-0', project.color)} />
                  <span className="flex-1 text-left truncate">{project.name}</span>
                  <Star size={11} className="text-slate-600 opacity-0 group-hover:opacity-100 hover:text-amber-400 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Teams */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Teams</div>
          <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all">
            <Users size={17} />
            <span>Design</span>
          </button>
        </div>
      </nav>

      {/* ── User Footer with popup menu ── */}
      <div ref={userMenuRef} className="relative p-3 border-t border-slate-900">

        {/* User Menu Popup — renders above the button */}
        <AnimatePresence>
          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute left-3 right-3 bottom-[calc(100%+8px)] z-50 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-[0_-16px_48px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              {/* Email */}
              <div className="px-4 pt-3 pb-2.5 border-b border-slate-800">
                <p className="text-xs text-slate-400 font-medium truncate">kai@kore.io</p>
              </div>

              {/* Top actions */}
              <div className="px-1.5 py-1.5 space-y-0.5">
                {[
                  { icon: Settings, label: 'Settings', hint: '⌘,' },
                  { icon: Globe, label: 'Language', chevron: true },
                  { icon: HelpCircle, label: 'Get help' },
                ].map(({ icon: Icon, label, hint, chevron }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all duration-150"
                  >
                    <Icon size={16} className="text-slate-400 shrink-0" />
                    <span className="flex-1 text-left font-medium">{label}</span>
                    {hint && <span className="text-[10px] text-slate-500 font-mono">{hint}</span>}
                    {chevron && <ChevronRight size={13} className="text-slate-500" />}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-800 mx-2 my-1" />

              {/* Upgrade + extras */}
              <div className="px-1.5 pb-1.5 space-y-0.5">
                {[
                  { icon: Zap, label: 'Upgrade plan', accent: true },
                  { icon: Building2, label: 'Invite teammates' },
                ].map(({ icon: Icon, label, accent }) => (
                  <button
                    key={label}
                    className={clsx(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150',
                      accent
                        ? 'text-amber-400 hover:bg-amber-500/10'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                    )}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-800 mx-2 my-1" />

              {/* Log out */}
              <div className="px-1.5 pb-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all duration-150">
                  <LogOut size={16} className="shrink-0" />
                  <span className="font-medium">Log out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger button */}
        <button
          onClick={() => setIsUserMenuOpen((v) => !v)}
          className={clsx(
            'w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-200 group',
            isUserMenuOpen ? 'bg-slate-800' : 'hover:bg-slate-900'
          )}
        >
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              KL
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div className="flex-1 flex flex-col items-start overflow-hidden">
            <span className="text-sm font-semibold text-slate-200 truncate">Kai Lee</span>
            <span className="text-[10px] text-slate-500 truncate">Pro Plan</span>
          </div>
          <ChevronDown
            size={14}
            className={clsx('text-slate-500 group-hover:text-slate-300 transition-all duration-200 shrink-0', isUserMenuOpen && 'rotate-180')}
          />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-slate-900 flex-col h-screen sticky top-0 bg-slate-950">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
