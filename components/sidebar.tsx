'use client';

import React from 'react';
import { 
  Home, 
  CheckCircle2, 
  Bell, 
  Plus, 
  Hash, 
  Users, 
  ChevronDown,
  Calendar,
  Clock,
  Star,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBoardStore } from '@/hooks/use-board-store';

export function Sidebar() {
  const [isProjectsOpen, setIsProjectsOpen] = React.useState(true);
  const { isSidebarOpen, setSidebarOpen } = useBoardStore();

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
      {/* Workspace Header */}
      <div className="p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-900/50 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            K
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-100">Kore</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Workspace</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ChevronDown size={14} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-900 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                item.active 
                  ? 'bg-indigo-500/10 text-indigo-400' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
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

        {/* Projects Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 group">
            <button 
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors"
            >
              <ChevronDown 
                size={12} 
                className={`transition-transform duration-200 ${isProjectsOpen ? '' : '-rotate-90'}`} 
              />
              Projects
            </button>
            <button className="p-1 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition-all opacity-0 group-hover:opacity-100">
              <Plus size={14} />
            </button>
          </div>

          {isProjectsOpen && (
            <div className="space-y-0.5">
              {projects.map((project) => (
                <button
                  key={project.name}
                  className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all group"
                >
                  <div className={`w-2 h-2 rounded-full ${project.color} shadow-sm`} />
                  <span className="flex-1 text-left truncate">{project.name}</span>
                  <Star size={12} className="text-slate-600 opacity-0 group-hover:opacity-100 hover:text-amber-400 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Teams Section */}
        <div className="space-y-2">
          <div className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Teams
          </div>
          <div className="space-y-0.5">
            <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all">
              <Users size={18} />
              <span>Design</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-900 space-y-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
            KL
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-slate-200 truncate">Kai Lee</span>
            <span className="text-[10px] text-slate-500 truncate">Pro Plan</span>
          </div>
        </div>
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
