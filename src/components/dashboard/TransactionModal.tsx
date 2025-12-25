import React from 'react';
import { X, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction, TransactionType, CATEGORIES, UserProfile } from '@/types';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: UserProfile;
    currentMonth: Date;
    onSave: (tx: Transaction) => void;
}

export const TransactionModal = ({ isOpen, onClose, currentUser, currentMonth, onSave }: TransactionModalProps) => {
    const [type, setType] = React.useState<TransactionType>('expense');

    const defaultDateValue = React.useMemo(() => {
        const now = new Date();
        if (currentMonth.getMonth() === now.getMonth() && currentMonth.getFullYear() === now.getFullYear()) {
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        }
        return `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-01`;
    }, [currentMonth]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <motion.form
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);

                    const newT: Transaction = {
                        id: Math.random().toString(36).substr(2, 9),
                        userId: currentUser.id,
                        title: (fd.get('title') as string) || (fd.get('category') as string),
                        amount: parseFloat(fd.get('amount') as string),
                        type: type,
                        category: (fd.get('category') as string) || 'Autre',
                        date: fd.get('date') as string
                    };
                    onSave(newT);
                }}
                className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] p-8 sm:p-10 relative z-10 shadow-2xl space-y-8 border border-slate-100 dark:border-slate-800"
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black italic text-slate-900 dark:text-white">Nouveau mouvement.</h3>
                    <button type="button" onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={`p-4 rounded-2xl font-bold transition-all ${type === 'expense' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                        >
                            Dépense
                        </button>

                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`p-4 rounded-2xl font-bold transition-all ${type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                        >
                            Revenu
                        </button>
                    </div>

                    <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-light text-slate-300 dark:text-slate-600">€</span>
                        <input required autoFocus name="amount" type="number" step="0.01" placeholder="0.00" className="w-full pl-8 text-5xl font-black bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800 py-4 transition-colors" />
                    </div>

                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <Calendar size={18} />
                        </div>
                        <input
                            required
                            name="date"
                            type="date"
                            defaultValue={defaultDateValue}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-slate-900 dark:text-white font-bold transition-colors focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                        />
                    </div>

                    <input name="title" type="text" placeholder="Titre (Optionnel)" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-slate-900 dark:text-white font-bold placeholder:text-slate-400 transition-colors focus:ring-2 focus:ring-indigo-500/20" />

                    <div className="grid grid-cols-4 gap-2">
                        {CATEGORIES.map(c => (
                            <label key={c.id} className="cursor-pointer">
                                <input type="radio" name="category" value={c.id} defaultChecked={c.id === 'Courses'} className="peer sr-only" />
                                <div className="flex flex-col items-center justify-center p-2 rounded-xl border-2 border-transparent bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 peer-checked:bg-indigo-50 peer-checked:border-indigo-500 peer-checked:text-indigo-600 dark:peer-checked:bg-indigo-500/10 dark:peer-checked:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                                    <c.icon size={20} className="mb-1" />
                                    <span className="text-[9px] font-bold uppercase truncate w-full text-center">{c.id}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
                <button type="submit" className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-slate-800 dark:hover:bg-indigo-700 active:scale-95 transition-all">Enregistrer</button>
            </motion.form>
        </div>
    );
};
