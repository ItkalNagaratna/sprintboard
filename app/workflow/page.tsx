'use client';

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
    Zap,
    Play,
    Webhook,
    Calendar,
    Mail,
    Globe,
    Database,
    Slack,
    Table2,
    ChevronRight,
    MoreVertical,
    MousePointer2,
    Trash2,
    Settings2,
    Search,
    GitBranch,
    GitMerge,
    Layers,
    RotateCcw,
    AlertTriangle,
    Clock,
    Filter,
    Code2,
    MessageSquare,
    Send,
    FileText,
    Github,
    Twitter,
    Trello,
    Rss,
    ShoppingCart,
    CreditCard,
    Users,
    Bell,
    CloudUpload,
    FolderOpen,
    Key,
    Cpu,
    ChevronDown,
    X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from '@/components/sidebar';
import { clsx } from 'clsx';

// ─── Types ─────────────────────────────────────────────────────────────────
interface NodeDef {
    type: string;
    title: string;
    subtitle: string;
    color: ColorKey;
    category: CategoryKey;
    icon: React.ReactNode;
    shape?: 'diamond' | 'pill' | 'default';
    ports?: { in: number; out: number };
}

interface CanvasNodeData {
    id: string;
    def: NodeDef;
    x: number;
    y: number;
}

interface Connection {
    id: string;
    fromId: string;
    fromPort: number;
    toId: string;
    toPort: number;
}

type ColorKey =
    | 'emerald' | 'indigo' | 'purple' | 'cyan'
    | 'orange' | 'pink' | 'green' | 'amber'
    | 'rose' | 'sky' | 'teal' | 'violet' | 'slate';

type CategoryKey = 'triggers' | 'logic' | 'actions' | 'integrations' | 'data';

// ─── Node Library ───────────────────────────────────────────────────────────
const NODE_LIBRARY: Record<CategoryKey, { label: string; icon: React.ReactNode; nodes: NodeDef[] }> = {
    triggers: {
        label: 'Triggers',
        icon: <Zap size={12} />,
        nodes: [
            { type: 'webhook', title: 'Webhook', subtitle: 'HTTP POST/GET trigger', color: 'emerald', category: 'triggers', icon: <Webhook size={16} />, ports: { in: 0, out: 1 } },
            { type: 'schedule', title: 'Schedule', subtitle: 'Cron / Interval', color: 'indigo', category: 'triggers', icon: <Calendar size={16} />, ports: { in: 0, out: 1 } },
            { type: 'email-trigger', title: 'Email Trigger', subtitle: 'On new email', color: 'purple', category: 'triggers', icon: <Mail size={16} />, ports: { in: 0, out: 1 } },
            { type: 'rss', title: 'RSS Feed', subtitle: 'On new item', color: 'orange', category: 'triggers', icon: <Rss size={16} />, ports: { in: 0, out: 1 } },
            { type: 'form', title: 'Form Submit', subtitle: 'On form submission', color: 'teal', category: 'triggers', icon: <FileText size={16} />, ports: { in: 0, out: 1 } },
            { type: 'github-trigger', title: 'GitHub Event', subtitle: 'Push, PR, Issue', color: 'slate', category: 'triggers', icon: <Github size={16} />, ports: { in: 0, out: 1 } },
        ],
    },
    logic: {
        label: 'Logic',
        icon: <GitBranch size={12} />,
        nodes: [
            { type: 'if-else', title: 'If / Else', subtitle: 'Conditional branch', color: 'amber', category: 'logic', icon: <GitBranch size={16} />, shape: 'diamond', ports: { in: 1, out: 2 } },
            { type: 'switch', title: 'Switch', subtitle: 'Multi-path routing', color: 'amber', category: 'logic', icon: <Filter size={16} />, shape: 'diamond', ports: { in: 1, out: 4 } },
            { type: 'parallel', title: 'Parallel', subtitle: 'Run branches at once', color: 'violet', category: 'logic', icon: <Layers size={16} />, ports: { in: 1, out: 3 } },
            { type: 'merge', title: 'Merge', subtitle: 'Join parallel paths', color: 'violet', category: 'logic', icon: <GitMerge size={16} />, ports: { in: 3, out: 1 } },
            { type: 'loop', title: 'Loop', subtitle: 'Iterate over items', color: 'sky', category: 'logic', icon: <RotateCcw size={16} />, shape: 'pill', ports: { in: 1, out: 2 } },
            { type: 'wait', title: 'Wait / Delay', subtitle: 'Pause execution', color: 'slate', category: 'logic', icon: <Clock size={16} />, ports: { in: 1, out: 1 } },
            { type: 'error', title: 'Error Handler', subtitle: 'Catch & handle errors', color: 'rose', category: 'logic', icon: <AlertTriangle size={16} />, ports: { in: 1, out: 2 } },
            { type: 'code', title: 'Code / JS', subtitle: 'Custom JavaScript', color: 'cyan', category: 'logic', icon: <Code2 size={16} />, ports: { in: 1, out: 1 } },
        ],
    },
    actions: {
        label: 'Actions',
        icon: <Play size={12} />,
        nodes: [
            { type: 'http', title: 'HTTP Request', subtitle: 'REST API call', color: 'cyan', category: 'actions', icon: <Globe size={16} />, ports: { in: 1, out: 1 } },
            { type: 'send-email', title: 'Send Email', subtitle: 'Via SMTP / SendGrid', color: 'purple', category: 'actions', icon: <Send size={16} />, ports: { in: 1, out: 1 } },
            { type: 'db-query', title: 'DB Query', subtitle: 'PostgreSQL / MySQL', color: 'orange', category: 'actions', icon: <Database size={16} />, ports: { in: 1, out: 1 } },
            { type: 'file', title: 'File Operation', subtitle: 'Read / Write / Delete', color: 'teal', category: 'actions', icon: <FolderOpen size={16} />, ports: { in: 1, out: 1 } },
            { type: 'notification', title: 'Push Notify', subtitle: 'Push notification', color: 'indigo', category: 'actions', icon: <Bell size={16} />, ports: { in: 1, out: 1 } },
            { type: 'upload', title: 'Cloud Upload', subtitle: 'S3 / GCS / Azure', color: 'sky', category: 'actions', icon: <CloudUpload size={16} />, ports: { in: 1, out: 1 } },
            { type: 'transform', title: 'Transform Data', subtitle: 'Map / Filter / Reduce', color: 'emerald', category: 'actions', icon: <Cpu size={16} />, ports: { in: 1, out: 1 } },
        ],
    },
    integrations: {
        label: 'Integrations',
        icon: <Layers size={12} />,
        nodes: [
            { type: 'slack', title: 'Slack', subtitle: 'Send message / DM', color: 'pink', category: 'integrations', icon: <Slack size={16} />, ports: { in: 1, out: 1 } },
            { type: 'sheets', title: 'Google Sheets', subtitle: 'Read / Write rows', color: 'green', category: 'integrations', icon: <Table2 size={16} />, ports: { in: 1, out: 1 } },
            { type: 'github', title: 'GitHub', subtitle: 'Issues, PRs, commits', color: 'slate', category: 'integrations', icon: <Github size={16} />, ports: { in: 1, out: 1 } },
            { type: 'twitter', title: 'X / Twitter', subtitle: 'Post tweet / search', color: 'sky', category: 'integrations', icon: <Twitter size={16} />, ports: { in: 1, out: 1 } },
            { type: 'trello', title: 'Trello', subtitle: 'Cards, lists, boards', color: 'cyan', category: 'integrations', icon: <Trello size={16} />, ports: { in: 1, out: 1 } },
            { type: 'stripe', title: 'Stripe', subtitle: 'Payments, customers', color: 'violet', category: 'integrations', icon: <CreditCard size={16} />, ports: { in: 1, out: 1 } },
            { type: 'shopify', title: 'Shopify', subtitle: 'Orders, products', color: 'green', category: 'integrations', icon: <ShoppingCart size={16} />, ports: { in: 1, out: 1 } },
            { type: 'sms', title: 'SMS / Twilio', subtitle: 'Send text message', color: 'orange', category: 'integrations', icon: <MessageSquare size={16} />, ports: { in: 1, out: 1 } },
            { type: 'crm', title: 'CRM / HubSpot', subtitle: 'Contacts, deals', color: 'amber', category: 'integrations', icon: <Users size={16} />, ports: { in: 1, out: 1 } },
            { type: 'oauth', title: 'OAuth / JWT', subtitle: 'Auth & token flow', color: 'rose', category: 'integrations', icon: <Key size={16} />, ports: { in: 1, out: 1 } },
        ],
    },
    data: {
        label: 'Data',
        icon: <Database size={12} />,
        nodes: [
            { type: 'set-vars', title: 'Set Variables', subtitle: 'Define data variables', color: 'indigo', category: 'data', icon: <Code2 size={16} />, ports: { in: 1, out: 1 } },
            { type: 'filter-data', title: 'Filter', subtitle: 'Filter array items', color: 'cyan', category: 'data', icon: <Filter size={16} />, ports: { in: 1, out: 1 } },
            { type: 'aggregate', title: 'Aggregate', subtitle: 'Sum, count, group', color: 'teal', category: 'data', icon: <Layers size={16} />, ports: { in: 1, out: 1 } },
        ],
    },
};

const ALL_NODES: NodeDef[] = Object.values(NODE_LIBRARY).flatMap(c => c.nodes);

// ─── Color Maps ─────────────────────────────────────────────────────────────
const COLOR: Record<ColorKey, { bg: string; border: string; text: string; glow: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20', badge: 'bg-emerald-500/20 text-emerald-300' },
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', glow: 'shadow-indigo-500/20', badge: 'bg-indigo-500/20 text-indigo-300' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20', badge: 'bg-purple-500/20 text-purple-300' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20', badge: 'bg-cyan-500/20 text-cyan-300' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20', badge: 'bg-orange-500/20 text-orange-300' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', glow: 'shadow-pink-500/20', badge: 'bg-pink-500/20 text-pink-300' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/20', badge: 'bg-green-500/20 text-green-300' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20', badge: 'bg-amber-500/20 text-amber-300' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', glow: 'shadow-rose-500/20', badge: 'bg-rose-500/20 text-rose-300' },
    sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-400', glow: 'shadow-sky-500/20', badge: 'bg-sky-500/20 text-sky-300' },
    teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', glow: 'shadow-teal-500/20', badge: 'bg-teal-500/20 text-teal-300' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', glow: 'shadow-violet-500/20', badge: 'bg-violet-500/20 text-violet-300' },
    slate: { bg: 'bg-slate-700/30', border: 'border-slate-600/40', text: 'text-slate-400', glow: 'shadow-slate-500/20', badge: 'bg-slate-700/50 text-slate-300' },
};

const CATEGORY_COLORS: Record<CategoryKey, string> = {
    triggers: 'text-emerald-400',
    logic: 'text-amber-400',
    actions: 'text-cyan-400',
    integrations: 'text-pink-400',
    data: 'text-violet-400',
};

// ─── Constants ───────────────────────────────────────────────────────────────
const NODE_WIDTH = 220;

const getPortTop = (count: number, index: number) => {
    if (count === 1) return 44;
    return 36 + index * 52;
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const WorkflowPage = () => {
    const [nodes, setNodes] = useState<CanvasNodeData[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [activePort, setActivePort] = useState<{ id: string; portIndex: number; type: 'in' | 'out' } | null>(null);
    const [nodeCounter, setNodeCounter] = useState(1);
    const [search, setSearch] = useState('');
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
        triggers: true, logic: true, actions: true, integrations: false, data: false,
    });
    const canvasRef = useRef<HTMLDivElement>(null);

    // ── Search filtering
    const filteredLibrary = useMemo(() => {
        if (!search.trim()) return NODE_LIBRARY;
        const q = search.toLowerCase();
        const result: typeof NODE_LIBRARY = {} as any;
        (Object.keys(NODE_LIBRARY) as CategoryKey[]).forEach(cat => {
            const filtered = NODE_LIBRARY[cat].nodes.filter(
                n => n.title.toLowerCase().includes(q) || n.subtitle.toLowerCase().includes(q)
            );
            if (filtered.length > 0) {
                result[cat] = { ...NODE_LIBRARY[cat], nodes: filtered };
            }
        });
        return result;
    }, [search]);

    const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

    const getPortTop = (count: number, index: number) => {
        if (count === 1) return 44;
        return 36 + index * 52;
    };

    const toggleCategory = (cat: string) =>
        setOpenCategories(p => ({ ...p, [cat]: !p[cat] }));

    // ── Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActivePort(null);
                setSelectedNodeId(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // ── Drag to canvas
    const onDragStart = (e: React.DragEvent, def: NodeDef) => {
        e.dataTransfer.setData('nodeDefType', def.type);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!canvasRef.current) return;
        const type = e.dataTransfer.getData('nodeDefType');
        if (!type) return;
        const def = ALL_NODES.find(n => n.type === type);
        if (!def) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - NODE_WIDTH / 2;
        const y = e.clientY - rect.top - 40;
        const newNode: CanvasNodeData = {
            id: `n${nodeCounter}`,
            def,
            x,
            y,
        };
        setNodes(prev => [...prev, newNode]);
        setNodeCounter(prev => prev + 1);
        setSelectedNodeId(newNode.id);
    };

    const deleteNode = (id: string) => {
        setNodes(prev => prev.filter(n => n.id !== id));
        setConnections(prev => prev.filter(c => c.fromId !== id && c.toId !== id));
        if (selectedNodeId === id) setSelectedNodeId(null);
    };

    const deleteConnection = (id: string) => {
        setConnections(prev => prev.filter(c => c.id !== id));
    };

    const handleDragEnd = useCallback((id: string, newX: number, newY: number) => {
        setNodes(prev => prev.map(n =>
            n.id === id ? { ...n, x: newX, y: newY } : n
        ));
    }, []);

    const handlePortClick = (nodeId: string, portIndex: number, portType: 'in' | 'out') => {
        if (!activePort) {
            setActivePort({ id: nodeId, portIndex, type: portType });
        } else {
            // Already active? toggle it off
            if (activePort.id === nodeId && activePort.portIndex === portIndex && activePort.type === portType) {
                setActivePort(null);
                return;
            }

            // Same type? Switch to the new port
            if (activePort.type === portType) {
                setActivePort({ id: nodeId, portIndex, type: portType });
                return;
            }

            // Different type? Try to connect
            const fromId = portType === 'in' ? activePort.id : nodeId;
            const fromPort = portType === 'in' ? activePort.portIndex : portIndex;
            const toId = portType === 'in' ? nodeId : activePort.id;
            const toPort = portType === 'in' ? portIndex : activePort.portIndex;
            const connId = `${fromId}:${fromPort}-${toId}:${toPort}`;

            if (!connections.find(c => c.id === connId)) {
                setConnections(prev => [...prev, { id: connId, fromId, fromPort, toId, toPort }]);
            }
            setActivePort(null);
        }
    };


    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="flex items-center justify-between px-6 h-14 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-30 shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center text-sm font-medium text-slate-400">
                            <span className="hover:text-slate-200 cursor-pointer transition-colors">Workflows</span>
                            <ChevronRight size={14} className="mx-2 opacity-30" />
                            <span className="text-slate-100 font-semibold tracking-tight">Automation Engine</span>
                        </div>
                        <div className="flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center gap-1.5 mr-6">
                            <button
                                onClick={() => { setNodes([]); setConnections([]); setNodeCounter(1); }}
                                className="flex items-center px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-all text-xs font-semibold text-slate-500 hover:text-slate-200"
                            >
                                Clear
                            </button>
                            <button className="flex items-center px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-all text-xs font-semibold text-slate-500 hover:text-slate-200">
                                Save
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-all text-xs font-semibold text-slate-500 hover:text-emerald-400">
                                <Play size={12} fill="currentColor" className="opacity-40" />
                                Run
                            </button>
                        </div>

                        <div className="hidden lg:flex items-center h-4 w-[1px] bg-slate-900 mr-6" />
                        <div className="hidden lg:flex items-center px-3 py-1.5 bg-slate-900/50 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-900 uppercase tracking-widest">
                            <MousePointer2 size={10} className="mr-2" />
                            {nodes.length} Nodes · {connections.length} Links
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-xs font-bold text-white border border-indigo-400/20">
                            <span>Deploy</span>
                        </button>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* ── Library Sidebar ── */}
                    <aside className="w-72 border-r border-slate-900 bg-[#0b0f1a] flex flex-col shrink-0 hidden md:flex">
                        {/* Search */}
                        <div className="p-3 border-b border-slate-900">
                            <div className="relative">
                                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search nodes…"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                                />
                                {search && (
                                    <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Node categories */}
                        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
                            {(Object.keys(filteredLibrary) as CategoryKey[]).map(cat => {
                                const catDef = filteredLibrary[cat];
                                const isOpen = search ? true : openCategories[cat];
                                return (
                                    <div key={cat}>
                                        <button
                                            onClick={() => toggleCategory(cat)}
                                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-900/60 transition-colors group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={clsx('opacity-70', CATEGORY_COLORS[cat])}>
                                                    {catDef.icon}
                                                </span>
                                                <span className={clsx('text-[10px] font-bold uppercase tracking-widest', CATEGORY_COLORS[cat])}>
                                                    {catDef.label}
                                                </span>
                                                <span className="text-[9px] bg-slate-800 text-slate-500 rounded px-1.5 py-0.5 font-medium">
                                                    {catDef.nodes.length}
                                                </span>
                                            </div>
                                            <ChevronDown
                                                size={12}
                                                className={clsx('text-slate-600 transition-transform duration-200', !isOpen && '-rotate-90')}
                                            />
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.18 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-0.5 pb-1 space-y-0.5">
                                                        {catDef.nodes.map(node => (
                                                            <LibraryItem
                                                                key={node.type}
                                                                node={node}
                                                                onDragStart={(e: React.DragEvent) => onDragStart(e, node)}
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}

                            {Object.keys(filteredLibrary).length === 0 && (
                                <div className="text-center py-10 text-slate-600 text-xs">
                                    <Search size={20} className="mx-auto mb-2 opacity-40" />
                                    No nodes match &quot;{search}&quot;
                                </div>
                            )}
                        </div>

                        {/* Quick tip */}
                        <div className="p-3 border-t border-slate-900">
                            <p className="text-[10px] text-slate-600 leading-relaxed text-center">
                                Drag any node onto the canvas · Click ports to connect
                            </p>
                        </div>
                    </aside>

                    {/* ── Canvas ── */}
                    <div
                        ref={canvasRef}
                        className="flex-1 relative bg-slate-950 overflow-hidden cursor-crosshair"
                        onClick={() => { setActivePort(null); setSelectedNodeId(null); }}
                        onDragOver={e => e.preventDefault()}
                        onMouseMove={e => {
                            if (activePort && canvasRef.current) {
                                const rect = canvasRef.current.getBoundingClientRect();
                                setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                            }
                        }}
                        onDrop={onDrop}
                    >
                        {/* Dot grid */}
                        <div
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                                backgroundSize: '28px 28px',
                            }}
                        />

                        {/* SVG Connections */}
                        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                            <defs>
                                <marker id="arrow-default" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                    <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
                                </marker>
                                <marker id="arrow-true" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                    <polygon points="0 0, 8 3, 0 6" fill="#34d399" />
                                </marker>
                                <marker id="arrow-false" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                    <polygon points="0 0, 8 3, 0 6" fill="#f43f5e" />
                                </marker>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                            </defs>
                            {connections.map(conn => {
                                const from = nodes.find(n => n.id === conn.fromId);
                                const to = nodes.find(n => n.id === conn.toId);
                                if (!from || !to) return null;

                                const fromOuts = from.def.ports?.out ?? 1;
                                const startX = from.x + NODE_WIDTH;
                                const startY = from.y + getPortTop(fromOuts, conn.fromPort) + 10;

                                const toIns = to.def.ports?.in ?? 1;
                                const endX = to.x;
                                const endY = to.y + getPortTop(toIns, conn.toPort) + 10;

                                const cpOffset = Math.abs(endX - startX) * 0.5 + 40;
                                const isTrue = conn.fromPort === 0 && from.def.shape === 'diamond';
                                const isFalse = conn.fromPort === 1 && from.def.shape === 'diamond';
                                const stroke = isTrue ? '#34d399' : isFalse ? '#f87171' : '#6366f1';
                                const markerId = isTrue ? 'arrow-true' : isFalse ? 'arrow-false' : 'arrow-default';

                                return (
                                    <g
                                        key={conn.id}
                                        className="group/conn cursor-pointer pointer-events-auto"
                                        onClick={(e) => { e.stopPropagation(); deleteConnection(conn.id); }}
                                    >
                                        <path
                                            d={`M ${startX} ${startY} C ${startX + cpOffset} ${startY}, ${endX - cpOffset} ${endY}, ${endX} ${endY}`}
                                            stroke={stroke}
                                            strokeWidth="10"
                                            fill="none"
                                            opacity="0"
                                            className="hover:opacity-10 transition-opacity"
                                        />
                                        <path
                                            d={`M ${startX} ${startY} C ${startX + cpOffset} ${startY}, ${endX - cpOffset} ${endY}, ${endX} ${endY}`}
                                            stroke={stroke}
                                            strokeWidth="2"
                                            fill="none"
                                            opacity="0.6"
                                            className="group-hover/conn:stroke-white group-hover/conn:opacity-100 transition-all"
                                            filter="url(#glow)"
                                            markerEnd={`url(#${markerId})`}
                                        />
                                        {(isTrue || isFalse) && (
                                            <text
                                                x={(startX + endX) / 2}
                                                y={Math.min(startY, endY) - 6}
                                                fill={stroke}
                                                fontSize="9"
                                                fontWeight="700"
                                                textAnchor="middle"
                                                opacity="0.8"
                                                fontFamily="monospace"
                                            >
                                                {isTrue ? 'TRUE' : 'FALSE'}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                            {activePort && (
                                <g>
                                    {(() => {
                                        const node = nodes.find(n => n.id === activePort.id);
                                        if (!node) return null;
                                        const count = activePort.type === 'out' ? (node.def.ports?.out ?? 1) : (node.def.ports?.in ?? 1);
                                        const startX = activePort.type === 'out' ? node.x + NODE_WIDTH : node.x;
                                        const startY = node.y + getPortTop(count, activePort.portIndex) + 10;
                                        const cpOffset = Math.abs(hoverPos.x - startX) * 0.5 + 40;
                                        return (
                                            <path
                                                d={`M ${startX} ${startY} C ${activePort.type === 'out' ? startX + cpOffset : startX - cpOffset} ${startY}, ${activePort.type === 'out' ? hoverPos.x - cpOffset : hoverPos.x + cpOffset} ${hoverPos.y}, ${hoverPos.x} ${hoverPos.y}`}
                                                stroke="#6366f1"
                                                strokeWidth="2"
                                                strokeDasharray="4 4"
                                                fill="none"
                                                opacity="0.5"
                                            />
                                        );
                                    })()}
                                </g>
                            )}
                        </svg>

                        {/* Empty state */}
                        <div className="absolute inset-0 z-10">
                            <AnimatePresence>
                                {nodes.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center text-center pointer-events-none"
                                    >
                                        <div className="w-20 h-20 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mb-6 shadow-2xl">
                                            <Zap size={28} className="text-slate-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-slate-500 mb-2">Build your automation</h3>
                                        <p className="text-xs text-slate-600 max-w-[260px] leading-relaxed">
                                            Drag nodes from the library on the left to start building your workflow
                                        </p>
                                        <div className="flex items-center gap-4 mt-8 text-[10px] text-slate-700 font-medium">
                                            <span className="flex items-center gap-1.5"><GitBranch size={11} /> If / Else branching</span>
                                            <span className="flex items-center gap-1.5"><Layers size={11} /> Parallel execution</span>
                                            <span className="flex items-center gap-1.5"><RotateCcw size={11} /> Loops</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Canvas Nodes */}
                            {nodes.map(node => (
                                <CanvasNode
                                    key={node.id}
                                    node={node}
                                    isSelected={selectedNodeId === node.id}
                                    onSelect={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                                    onDelete={() => deleteNode(node.id)}
                                    onDragEnd={(newX: number, newY: number) => handleDragEnd(node.id, newX, newY)}
                                    onPortClick={handlePortClick}
                                    activePort={activePort}
                                    nodeWidth={NODE_WIDTH}
                                />
                            ))}
                        </div>

                        {/* Zoom controls */}
                        <div className="absolute bottom-5 right-5 flex items-center space-x-1 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-xl p-1 shadow-2xl z-20">
                            <span className="px-2 text-[10px] font-bold text-slate-500 border-r border-slate-800 pr-2">100%</span>
                            <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-800 rounded-lg transition-colors text-slate-400 text-base">−</button>
                            <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-800 rounded-lg transition-colors text-slate-400 text-base">+</button>
                        </div>

                        {/* Active port indicator */}
                        {activePort && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-indigo-600/90 backdrop-blur border border-indigo-400/30 rounded-full px-4 py-1.5 text-xs font-medium text-white shadow-lg pointer-events-none">
                                Click a {activePort.type === 'out' ? 'input' : 'output'} port to connect · <span className="opacity-60">Esc to cancel</span>
                            </div>
                        )}
                    </div>

                    {/* ── Inspector Sidebar ── */}
                    <AnimatePresence>
                        {selectedNodeId && (
                            <motion.aside
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="w-80 border-l border-slate-900 bg-[#0b0f1a] flex flex-col shrink-0 z-40 overflow-y-auto"
                            >
                                <div className="p-4 border-b border-slate-900 flex items-center justify-between">
                                    <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Inspector</h2>
                                    <button
                                        onClick={() => setSelectedNodeId(null)}
                                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                {(() => {
                                    const node = nodes.find(n => n.id === selectedNodeId);
                                    if (!node) return null;
                                    const c = COLOR[node.def.color];
                                    return (
                                        <div className="p-6 flex flex-col gap-8">
                                            {/* Node Header */}
                                            <div className="flex items-center gap-4">
                                                <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-2xl border-2', c.bg, c.border, c.text)}>
                                                    {node.def.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-100">{node.def.title}</h3>
                                                    <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">{node.id}</p>
                                                </div>
                                            </div>

                                            {/* Configuration */}
                                            <div className="space-y-4">
                                                {node.def.type === 'webhook' && (
                                                    <>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Path</label>
                                                            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono">
                                                                /webhook/trigger
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Method</label>
                                                            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono">
                                                                POST
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                                                    <textarea
                                                        readOnly
                                                        value={node.def.subtitle}
                                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 resize-none h-20 focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-4 pt-8 border-t border-slate-900 flex flex-col gap-3">
                                                <button
                                                    onClick={() => deleteNode(node.id)}
                                                    className="w-full h-10 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-bold hover:bg-rose-500/20 transition-all border border-rose-500/20"
                                                >
                                                    Delete Node
                                                </button>
                                                <button className="w-full h-10 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all">
                                                    Duplicate
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </motion.aside>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// ─── Library Item ────────────────────────────────────────────────────────────
const LibraryItem = ({ node, onDragStart }: { node: NodeDef; onDragStart: (e: React.DragEvent) => void }) => {
    const c = COLOR[node.color];
    return (
        <div
            draggable
            onDragStart={onDragStart}
            className="flex items-center gap-2.5 px-2 py-2 mx-1 rounded-xl hover:bg-slate-900 transition-all group cursor-grab active:cursor-grabbing border border-transparent hover:border-slate-800/60"
        >
            <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', c.bg, c.text)}>
                {node.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-slate-300 group-hover:text-slate-100 transition-colors truncate">{node.title}</p>
                    {node.shape === 'diamond' && (
                        <span className="text-[8px] bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded px-1 font-bold uppercase tracking-wide shrink-0">branch</span>
                    )}
                    {node.shape === 'pill' && (
                        <span className="text-[8px] bg-sky-500/15 text-sky-400 border border-sky-500/20 rounded px-1 font-bold uppercase tracking-wide shrink-0">loop</span>
                    )}
                </div>
                <p className="text-[10px] text-slate-600 group-hover:text-slate-500 transition-colors truncate">{node.subtitle}</p>
            </div>
        </div>
    );
};

// ─── Canvas Node ─────────────────────────────────────────────────────────────
const CanvasNode = ({
    node, isSelected, onSelect, onDelete, onDragEnd, onPortClick, activePort, nodeWidth
}: {
    node: CanvasNodeData;
    isSelected: boolean;
    onSelect: (e: React.MouseEvent) => void;
    onDelete: () => void;
    onDragEnd: (newX: number, newY: number) => void;
    onPortClick: (nodeId: string, portIndex: number, type: 'in' | 'out') => void;
    activePort: { id: string; portIndex: number; type: 'in' | 'out' } | null;
    nodeWidth: number;
}) => {
    const c = COLOR[node.def.color];
    const inPorts = node.def.ports?.in ?? 1;
    const outPorts = node.def.ports?.out ?? 1;
    const isDiamond = node.def.shape === 'diamond';
    const isPill = node.def.shape === 'pill';

    const headerBg = isDiamond
        ? 'bg-amber-500/10 border-amber-500/40'
        : isPill
            ? 'bg-sky-500/10 border-sky-500/40'
            : isSelected
                ? `${c.bg} border-indigo-500/50`
                : 'bg-slate-900 border-slate-800';

    const portSpacing = 52;

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            onDragEnd={(_e, info) => onDragEnd(node.x + info.offset.x, node.y + info.offset.y)}
            className={clsx('absolute group touch-none', isSelected ? 'z-30' : 'z-20')}
            style={{ x: node.x, y: node.y, width: nodeWidth }}
            onClick={onSelect}
        >
            {/* Node card */}
            <div className={clsx(
                'border rounded-2xl shadow-2xl transition-all duration-150 cursor-grab active:cursor-grabbing overflow-hidden',
                headerBg,
                isSelected && 'ring-1 ring-indigo-500/40 shadow-indigo-500/10'
            )}>
                {/* Category stripe */}
                <div className={clsx('h-0.5 w-full', isDiamond ? 'bg-amber-500/50' : isPill ? 'bg-sky-500/50' : `${c.bg.replace('/10', '/50')}`)} />

                <div className="px-3.5 pt-3 pb-3.5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg border', c.bg, c.border, c.text)}>
                            {node.def.icon}
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={e => { e.stopPropagation(); onDelete(); }}
                                className="p-1.5 hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 rounded-lg transition-colors"
                            >
                                <Trash2 size={12} />
                            </button>
                            <button className="p-1.5 hover:bg-slate-800 text-slate-600 hover:text-slate-200 rounded-lg transition-colors">
                                <MoreVertical size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-100 leading-tight truncate mr-2">{node.def.title}</h4>
                        <span className="text-[9px] font-mono text-slate-500 opacity-80">{node.id}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{node.def.subtitle}</p>
                    {node.def.type === 'loop' && (
                        <div className="flex gap-1.5 mt-2.5">
                            <span className="text-[9px] bg-sky-500/15 text-sky-400 border border-sky-500/20 rounded px-1.5 py-0.5 font-bold">EACH ITEM →</span>
                            <span className="text-[9px] bg-slate-700/50 text-slate-400 border border-slate-600/30 rounded px-1.5 py-0.5 font-bold">DONE →</span>
                        </div>
                    )}
                    {node.def.type === 'error' && (
                        <div className="flex gap-1.5 mt-2.5">
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded px-1.5 py-0.5 font-bold">SUCCESS →</span>
                            <span className="text-[9px] bg-rose-500/15 text-rose-400 border border-rose-500/20 rounded px-1.5 py-0.5 font-bold">ERROR →</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Input ports */}
            {Array.from({ length: inPorts }).map((_, i) => {
                const isActive = activePort?.id === node.id && activePort.portIndex === i && activePort.type === 'in';
                const top = getPortTop(inPorts, i);
                return (
                    <div
                        key={`in-wrapper-${i}`}
                        className="absolute -left-5 h-8 flex items-center z-50 pointer-events-none"
                        style={{ top: top - 4 }} // Offset and hit area
                        title="Input Port"
                    >
                        <button
                            onClick={e => { e.stopPropagation(); onPortClick(node.id, i, 'in'); }}
                            className={clsx(
                                'w-8 h-8 rounded-full z-40 transition-all hover:scale-110 flex items-center justify-center pointer-events-auto group/port',
                                isActive ? 'scale-125' : ''
                            )}
                        >
                            <div className={clsx(
                                'w-3 h-3 rounded-full border-2 transition-all duration-200',
                                isActive
                                    ? 'border-indigo-400 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]'
                                    : 'border-slate-700 bg-slate-900 group-hover/port:border-indigo-400 group-hover/port:bg-slate-800'
                            )} />
                        </button>
                    </div>
                );
            })}

            {/* Output ports */}
            {Array.from({ length: outPorts }).map((_, i) => {
                const isActive = activePort?.id === node.id && activePort.portIndex === i && activePort.type === 'out';
                const top = getPortTop(outPorts, i);
                const portStroke = isDiamond
                    ? i === 0 ? 'group-hover/port:border-emerald-400 border-emerald-500/60' : 'group-hover/port:border-rose-400 border-rose-500/60'
                    : 'group-hover/port:border-indigo-400 border-slate-700';

                const portLabel = isDiamond
                    ? (i === 0 ? "TRUE" : "FALSE")
                    : node.def.type === 'loop'
                        ? (i === 0 ? "EACH ITEM" : "DONE")
                        : null;

                return (
                    <div
                        key={`out-wrapper-${i}`}
                        className="absolute -right-5 h-8 flex items-center z-50 pointer-events-none"
                        style={{ top: top - 4 }}
                        title={portLabel || "Output Port"}
                    >
                        {portLabel && (
                            <span className={clsx(
                                "absolute right-7 text-[7px] font-bold uppercase tracking-wider px-1 inline-block whitespace-nowrap",
                                isDiamond ? (i === 0 ? "text-emerald-500/80" : "text-rose-500/80") : "text-slate-600"
                            )}>
                                {portLabel}
                            </span>
                        )}
                        <button
                            onClick={e => { e.stopPropagation(); onPortClick(node.id, i, 'out'); }}
                            className={clsx(
                                'w-8 h-8 rounded-full z-40 transition-all hover:scale-110 flex items-center justify-center pointer-events-auto group/port',
                                isActive ? 'scale-125' : ''
                            )}
                        >
                            <div className={clsx(
                                'w-3 h-3 rounded-full border-2 transition-all duration-200',
                                isActive
                                    ? 'border-indigo-400 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]'
                                    : `${portStroke} bg-slate-900 group-hover/port:bg-slate-800`
                            )} />
                        </button>
                    </div>
                );
            })}
        </motion.div>
    );
};

export default WorkflowPage;
