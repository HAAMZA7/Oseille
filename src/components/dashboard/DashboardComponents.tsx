import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
    type?: 'positive' | 'negative' | 'neutral';
}

export const StatCard = ({ label, value, icon: Icon, type = 'neutral' }: StatCardProps) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors hover:shadow-lg dark:hover:shadow-indigo-500/5 duration-300"
    >
        <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors",
            type === 'positive' && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            type === 'negative' && "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
            type === 'neutral' && "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        )}>
            <Icon size={24} />
        </div>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter transition-colors">
            {value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </h3>
    </motion.div>
);

interface BudgetProgressProps {
    current: number;
    total: number;
}

export const BudgetProgress = ({ current, total }: BudgetProgressProps) => {
    const percentage = Math.min((current / total) * 100, 100);
    const color = percentage < 50 ? 'bg-emerald-500' : percentage < 80 ? 'bg-yellow-500' : 'bg-rose-500';

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-900 dark:text-white text-sm">Objectif Mensuel</span>
                <div className="text-xs font-bold text-slate-500">
                    {current.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} / {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                </div>
            </div>
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn("h-full transition-all duration-1000", color)}
                />
            </div>
            <p className="mt-2 text-xs text-slate-400 font-medium text-right">
                {percentage >= 100 ? "Budget dépassé !" : `${(100 - percentage).toFixed(0)}% restant`}
            </p>
        </div>
    );
};
