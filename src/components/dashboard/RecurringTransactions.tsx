import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Plus, Trash2, Pause, Play, X } from 'lucide-react';
import { RecurringTransaction, CATEGORIES, RecurrenceFrequency } from '@/types';

interface RecurringTransactionsProps {
    recurringTxs: RecurringTransaction[];
    onAdd: (tx: Omit<RecurringTransaction, 'id' | 'userId' | 'isActive' | 'lastGenerated'>) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
}

const FREQUENCY_LABELS: Record<RecurrenceFrequency, string> = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    yearly: 'Annuel',
};

export const RecurringTransactions = ({ recurringTxs, onAdd, onDelete, onToggle }: RecurringTransactionsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTx, setNewTx] = useState({
        title: '',
        amount: 0,
        type: 'expense' as 'income' | 'expense',
        category: 'Autre',
        frequency: 'monthly' as RecurrenceFrequency,
        startDate: new Date().toISOString().split('T')[0],
    });

    const handleAdd = () => {
        if (newTx.title && newTx.amount > 0) {
            onAdd(newTx);
            setNewTx({
                title: '',
                amount: 0,
                type: 'expense',
                category: 'Autre',
                frequency: 'monthly',
                startDate: new Date().toISOString().split('T')[0],
            });
            setIsModalOpen(false);
        }
    };

    return (
        <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 rounded-xl">
                        <RefreshCw size={20} />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white transition-colors">Récurrents</h3>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors"
                >
                    <Plus size={18} />
                </button>
            </div>

            {recurringTxs.length === 0 ? (
                <div className="text-center py-6 text-slate-400 italic text-sm">
                    <RefreshCw size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Aucune transaction récurrente</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {recurringTxs.map((tx) => {
                        const cat = CATEGORIES.find(c => c.id === tx.category);
                        return (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: tx.isActive ? 1 : 0.5, x: 0 }}
                                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${cat?.color || 'bg-slate-100 text-slate-500'}`}>
                                        {cat && <cat.icon size={14} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{tx.title}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">
                                            {FREQUENCY_LABELS[tx.frequency]}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`font-black text-sm ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {tx.type === 'income' ? '+' : '-'}{tx.amount}€
                                    </span>
                                    <button
                                        onClick={() => onToggle(tx.id)}
                                        className={`p-1.5 rounded-lg transition-colors ${tx.isActive ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}
                                    >
                                        {tx.isActive ? <Pause size={12} /> : <Play size={12} />}
                                    </button>
                                    <button
                                        onClick={() => onDelete(tx.id)}
                                        className="p-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Nouvelle Récurrence</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Type Toggle */}
                                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                                    <button
                                        onClick={() => setNewTx({ ...newTx, type: 'expense' })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${newTx.type === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-500'}`}
                                    >
                                        Dépense
                                    </button>
                                    <button
                                        onClick={() => setNewTx({ ...newTx, type: 'income' })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${newTx.type === 'income' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}
                                    >
                                        Revenu
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    value={newTx.title}
                                    onChange={(e) => setNewTx({ ...newTx, title: e.target.value })}
                                    placeholder="Titre (ex: Loyer, Salaire...)"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium"
                                />

                                <input
                                    type="number"
                                    value={newTx.amount || ''}
                                    onChange={(e) => setNewTx({ ...newTx, amount: Number(e.target.value) })}
                                    placeholder="Montant (€)"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium"
                                />

                                <select
                                    value={newTx.category}
                                    onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.id}</option>
                                    ))}
                                </select>

                                <select
                                    value={newTx.frequency}
                                    onChange={(e) => setNewTx({ ...newTx, frequency: e.target.value as RecurrenceFrequency })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium"
                                >
                                    {Object.entries(FREQUENCY_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>

                                <div>
                                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Date de début</label>
                                    <input
                                        type="date"
                                        value={newTx.startDate}
                                        onChange={(e) => setNewTx({ ...newTx, startDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleAdd}
                                    className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-colors"
                                >
                                    Créer
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
