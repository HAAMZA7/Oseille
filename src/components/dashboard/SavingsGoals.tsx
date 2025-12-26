import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, TrendingUp, Calendar, X } from 'lucide-react';
import { SavingsGoal, GOAL_COLORS } from '@/types';

interface SavingsGoalsProps {
    goals: SavingsGoal[];
    onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt' | 'currentAmount'>) => void;
    onAddToGoal: (id: string, amount: number) => void;
    onDeleteGoal: (id: string) => void;
}

export const SavingsGoals = ({ goals, onAddGoal, onAddToGoal, onDeleteGoal }: SavingsGoalsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddMoneyOpen, setIsAddMoneyOpen] = useState<string | null>(null);
    const [newGoal, setNewGoal] = useState({ name: '', targetAmount: 0, color: GOAL_COLORS[0], deadline: '' });
    const [addAmount, setAddAmount] = useState(0);

    const handleAddGoal = () => {
        if (newGoal.name && newGoal.targetAmount > 0) {
            onAddGoal(newGoal);
            setNewGoal({ name: '', targetAmount: 0, color: GOAL_COLORS[0], deadline: '' });
            setIsModalOpen(false);
        }
    };

    const handleAddMoney = (goalId: string) => {
        if (addAmount > 0) {
            onAddToGoal(goalId, addAmount);
            setAddAmount(0);
            setIsAddMoneyOpen(null);
        }
    };

    return (
        <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-xl">
                        <Target size={20} />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white transition-colors">Objectifs d'Épargne</h3>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors"
                >
                    <Plus size={18} />
                </button>
            </div>

            {goals.length === 0 ? (
                <div className="text-center py-8 text-slate-400 italic">
                    <Target size={40} className="mx-auto mb-3 opacity-50" />
                    <p>Aucun objectif d'épargne</p>
                    <p className="text-sm">Créez-en un pour commencer !</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {goals.map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        return (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: goal.color }}
                                        />
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">{goal.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-500">
                                            {goal.currentAmount.toFixed(0)}€ / {goal.targetAmount}€
                                        </span>
                                        <button
                                            onClick={() => setIsAddMoneyOpen(goal.id)}
                                            className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-xs"
                                        >
                                            <TrendingUp size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteGoal(goal.id)}
                                            className="p-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(progress, 100)}%` }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: goal.color }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-[10px] text-slate-400 font-bold">{progress.toFixed(0)}%</span>
                                    {goal.deadline && (
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                            <Calendar size={10} />
                                            {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                                        </span>
                                    )}
                                </div>

                                {/* Add Money Popup */}
                                <AnimatePresence>
                                    {isAddMoneyOpen === goal.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="absolute right-0 top-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl z-10"
                                        >
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={addAmount || ''}
                                                    onChange={(e) => setAddAmount(Number(e.target.value))}
                                                    placeholder="€"
                                                    className="w-20 px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm font-bold"
                                                />
                                                <button
                                                    onClick={() => handleAddMoney(goal.id)}
                                                    className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => setIsAddMoneyOpen(null)}
                                                    className="p-2 text-slate-400 hover:text-slate-600"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Add Goal Modal */}
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
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Nouvel Objectif</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Nom</label>
                                    <input
                                        type="text"
                                        value={newGoal.name}
                                        onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                                        placeholder="ex: Vacances, Voiture..."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Montant cible (€)</label>
                                    <input
                                        type="number"
                                        value={newGoal.targetAmount || ''}
                                        onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                                        placeholder="1000"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Date limite (optionnel)</label>
                                    <input
                                        type="date"
                                        value={newGoal.deadline}
                                        onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Couleur</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {GOAL_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setNewGoal({ ...newGoal, color })}
                                                className={`w-8 h-8 rounded-full transition-transform ${newGoal.color === color ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : ''}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
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
                                    onClick={handleAddGoal}
                                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors"
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
