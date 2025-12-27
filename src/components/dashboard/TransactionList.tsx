import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Search, MoreHorizontal, Filter, RefreshCw } from 'lucide-react';
import { Transaction, CATEGORIES } from '@/types';

interface TransactionListProps {
    transactions: Transaction[];
    search: string;
    onSearchChange: (val: string) => void;
    onDelete: (id: string) => void;
    monthName: string;
}

export const TransactionList = ({ transactions, search, onSearchChange, onDelete, monthName }: TransactionListProps) => {
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const formatDate = (ds: string) => {
        const d = new Date(ds);
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const groupedTxs = React.useMemo(() => {
        let filtered = transactions.filter(t =>
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.category.toLowerCase().includes(search.toLowerCase())
        );

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }

        const sorted = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const groups: Record<string, Transaction[]> = {};
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        sorted.forEach(t => {
            let key = t.date;
            if (t.date === today) key = "Aujourd'hui";
            else if (t.date === yesterday) key = "Hier";
            else key = formatDate(t.date);

            if (!groups[key]) groups[key] = [];
            groups[key].push(t);
        });
        return groups;
    }, [transactions, search, categoryFilter]);

    const resetFilters = () => {
        onSearchChange('');
        setCategoryFilter('all');
    };

    return (
        <section className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm transition-colors">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white transition-colors">Opérations de {monthName}</h3>
                    <div className="relative w-full sm:w-64 group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Chercher..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 ring-indigo-500/20 dark:text-white text-sm font-medium transition-all border border-transparent dark:border-slate-700 focus:border-indigo-500"
                            value={search}
                            onChange={e => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Filter size={14} />
                        <span className="text-xs font-bold uppercase">Filtres:</span>
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium border border-slate-100 dark:border-slate-700"
                    >
                        <option value="all">Toutes catégories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.id}</option>
                        ))}
                    </select>
                    {(search || categoryFilter !== 'all') && (
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors"
                        >
                            <RefreshCw size={12} />
                            Réinitialiser
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {Object.keys(groupedTxs).length === 0 ? (
                    <div className="py-16 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-800/20">
                        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 text-indigo-400">
                            <span className="text-4xl">💸</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Aucune opération</h4>
                        <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs mb-4">
                            {search || categoryFilter !== 'all'
                                ? "Aucun résultat pour ces filtres."
                                : "Commencez à suivre vos finances en ajoutant votre première transaction !"}
                        </p>
                        {!search && categoryFilter === 'all' && (
                            <p className="text-indigo-500 dark:text-indigo-400 text-sm font-medium animate-bounce">
                                👇 Cliquez sur le + en bas à droite
                            </p>
                        )}
                    </div>
                ) : (
                    Object.keys(groupedTxs).map(dateKey => (
                        <div key={dateKey}>
                            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-2 sticky top-0 bg-white dark:bg-slate-900 py-2 z-10">{dateKey}</h4>
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {groupedTxs[dateKey].map(t => (
                                        <motion.div
                                            layout
                                            key={t.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${CATEGORIES.find(c => c.id === t.category)?.color || 'bg-slate-100 text-slate-500'}`}>
                                                    {CATEGORIES.find(c => c.id === t.category)?.icon ? React.createElement(CATEGORIES.find(c => c.id === t.category)!.icon, { size: 20 }) : <MoreHorizontal size={20} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{t.title}</h4>
                                                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">{t.category}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 sm:gap-6">
                                                <span className={`font-black tracking-tight text-sm sm:text-base ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        if (confirm("Supprimer cette opération ?")) {
                                                            onDelete(t.id);
                                                        }
                                                    }}
                                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};
