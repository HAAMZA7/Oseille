import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Plus,
    Settings as SettingsIcon,
    LogOut,
    ChevronLeft,
    ChevronRight,
    PieChart as LucidePieChart,
    BarChart3,
    Lightbulb,
    Moon,
    Sun
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { UserProfile, CATEGORIES } from '@/types';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { useRecurringTransactions } from '@/hooks/useRecurringTransactions';
import { StatCard, BudgetProgress } from './DashboardComponents';
import { TransactionList } from './TransactionList';
import { TransactionModal } from './TransactionModal';
import { SettingsModal } from './SettingsModal';
import { SavingsGoals } from './SavingsGoals';
import { RecurringTransactions } from './RecurringTransactions';

interface DashboardProps {
    user: UserProfile;
    onLogout: () => void;
    onUpdateUser: (u: UserProfile) => void;
    onDeleteAccount: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const Dashboard = ({ user, onLogout, onUpdateUser, onDeleteAccount, theme, toggleTheme }: DashboardProps) => {
    const {
        transactions,
        monthTxs,
        stats,
        currentMonth,
        setCurrentMonth,
        addTransaction,
        deleteTransaction,
        exportData,
        exportToCSV,
        importData
    } = useFinanceData(user);

    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [search, setSearch] = useState("");

    // Savings Goals
    const { goals, addGoal, addToGoal, deleteGoal } = useSavingsGoals(user);

    // Recurring Transactions
    const { recurringTxs, addRecurring, deleteRecurring, toggleRecurring } = useRecurringTransactions(user, addTransaction);

    const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    const pieData = useMemo(() => {
        const expenses = monthTxs.filter(t => t.type === 'expense');
        const catTotals: Record<string, number> = {};
        expenses.forEach(t => {
            catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
        });
        return Object.entries(catTotals).map(([name, value]) => ({
            name,
            value,
            color: CATEGORIES.find(c => c.id === name)?.hex || '#cbd5e1'
        }));
    }, [monthTxs]);

    const barData = useMemo(() => {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const result = [];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthTxsForBar = transactions.filter(t => {
                const txDate = new Date(t.date);
                return txDate.getMonth() === d.getMonth() && txDate.getFullYear() === d.getFullYear();
            });
            const income = monthTxsForBar.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
            const expense = monthTxsForBar.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
            result.push({ name: months[d.getMonth()], income, expense });
        }
        return result;
    }, [transactions]);

    const tip = useMemo(() => {
        // Intelligent tips based on actual spending
        const tips: string[] = [];

        // Check savings rate
        if (stats.income > 0) {
            const savingsRate = ((stats.income - stats.expense) / stats.income) * 100;
            if (savingsRate < 10) {
                tips.push(`⚠️ Attention : vous n'épargnez que ${savingsRate.toFixed(0)}% de vos revenus ce mois-ci. Visez au moins 20% !`);
            } else if (savingsRate >= 20) {
                tips.push(`🎉 Bravo ! Vous épargnez ${savingsRate.toFixed(0)}% de vos revenus ce mois-ci, c'est excellent !`);
            }
        }

        // Check top expense category
        const expensesByCategory: Record<string, number> = {};
        monthTxs.filter(t => t.type === 'expense').forEach(t => {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
        });
        const topCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];
        if (topCategory && topCategory[1] > stats.expense * 0.4) {
            tips.push(`📊 Vos dépenses en "${topCategory[0]}" représentent ${((topCategory[1] / stats.expense) * 100).toFixed(0)}% de vos dépenses totales.`);
        }

        // Budget alert
        if (user.budget && stats.expense > user.budget * 0.8) {
            const pct = ((stats.expense / user.budget) * 100).toFixed(0);
            tips.push(`🔔 Vous avez utilisé ${pct}% de votre budget mensuel (${user.budget}€).`);
        }

        // Default tips
        if (tips.length === 0) {
            tips.push(
                "💡 Le saviez-vous ? Oseille stocke vos données uniquement sur votre navigateur.",
                "☕ Un petit café en moins par jour ? C'est 90€ d'économie par mois !",
                "📈 Ajoutez vos transactions régulièrement pour un suivi précis."
            );
        }

        return tips[Math.floor(Math.random() * tips.length)];
    }, [monthTxs, stats, user.budget]);

    const changeMonth = (offset: number) => {
        const d = new Date(currentMonth);
        d.setMonth(d.getMonth() + offset);
        setCurrentMonth(d);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase transition-colors">Oseille.</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center bg-slate-50 dark:bg-slate-900 rounded-2xl p-1 border border-slate-100 dark:border-slate-800 transition-colors">
                            <button onClick={() => changeMonth(-1)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><ChevronLeft size={20} /></button>
                            <span className="px-4 font-bold text-slate-900 dark:text-white text-sm min-w-[120px] text-center capitalize">{monthName}</span>
                            <button onClick={() => changeMonth(1)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><ChevronRight size={20} /></button>
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
                            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button onClick={() => setIsSettingsOpen(true)} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
                            <SettingsIcon size={20} />
                        </button>
                        <button onClick={onLogout} className="p-2.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl text-rose-500 hover:bg-rose-100 transition-all">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <StatCard label="Solde Total" value={stats.balance} icon={Wallet} type="neutral" />
                    </div>
                    <StatCard label="Revenus" value={stats.income} icon={TrendingUp} type="positive" />
                    <StatCard label="Dépenses" value={stats.expense} icon={TrendingDown} type="negative" />
                    <div className="lg:col-span-1">
                        <BudgetProgress current={stats.expense} total={user.budget || 2000} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <TransactionList
                            transactions={monthTxs}
                            search={search}
                            onSearchChange={setSearch}
                            onDelete={deleteTransaction}
                            monthName={monthName}
                        />
                    </div>

                    <div className="space-y-8">
                        <section className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm transition-colors">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl"><LucidePieChart size={20} /></div>
                                <h3 className="font-black text-slate-900 dark:text-white transition-colors">Répartition</h3>
                            </div>
                            <div className="w-full">
                                {pieData.length > 0 ? (() => {
                                    const total = pieData.reduce((acc, d) => acc + d.value, 0);
                                    let cumulative = 0;
                                    const gradientParts = pieData.map(d => {
                                        const start = (cumulative / total) * 360;
                                        cumulative += d.value;
                                        const end = (cumulative / total) * 360;
                                        return `${d.color} ${start}deg ${end}deg`;
                                    }).join(', ');

                                    return (
                                        <div className="flex flex-col items-center">
                                            {/* CSS Donut Chart */}
                                            <div
                                                className="w-36 h-36 rounded-full relative"
                                                style={{
                                                    background: `conic-gradient(${gradientParts})`,
                                                }}
                                            >
                                                <div className="absolute inset-4 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center transition-colors">
                                                    <div className="text-center">
                                                        <p className="text-2xl font-black text-slate-900 dark:text-white">{total.toFixed(0)}€</p>
                                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Legend */}
                                            <div className="flex flex-wrap justify-center gap-3 mt-6">
                                                {pieData.map((entry, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">{entry.name}</span>
                                                        <span className="text-slate-900 dark:text-white font-bold">{entry.value.toFixed(0)}€</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })() : (
                                    <div className="h-[200px] flex flex-col items-center justify-center text-slate-400 font-medium italic text-sm">
                                        Pas de dépenses ce mois-ci.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm transition-colors">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl"><BarChart3 size={20} /></div>
                                <h3 className="font-black text-slate-900 dark:text-white transition-colors">Tendances</h3>
                            </div>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                        <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        <section className="bg-slate-900 dark:bg-indigo-600 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-xl"><Lightbulb size={20} /></div>
                                <h3 className="font-black italic">Conseil du Moment</h3>
                            </div>
                            <p className="text-sm font-medium leading-relaxed opacity-90">{tip}</p>
                        </section>

                        {/* Savings Goals */}
                        <SavingsGoals
                            goals={goals}
                            onAddGoal={addGoal}
                            onAddToGoal={addToGoal}
                            onDeleteGoal={deleteGoal}
                        />

                        {/* Recurring Transactions */}
                        <RecurringTransactions
                            recurringTxs={recurringTxs}
                            onAdd={addRecurring}
                            onDelete={deleteRecurring}
                            onToggle={toggleRecurring}
                        />
                    </div>
                </div>
            </main>

            <button
                onClick={() => setIsTxModalOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 dark:bg-indigo-600 text-white rounded-[2rem] shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
            >
                <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <AnimatePresence>
                {isTxModalOpen && (
                    <TransactionModal
                        isOpen={isTxModalOpen}
                        onClose={() => setIsTxModalOpen(false)}
                        currentUser={user}
                        currentMonth={currentMonth}
                        onSave={(t) => {
                            addTransaction(t);
                            setIsTxModalOpen(false);
                        }}
                    />
                )}
                {isSettingsOpen && (
                    <SettingsModal
                        isOpen={isSettingsOpen}
                        onClose={() => setIsSettingsOpen(false)}
                        currentUser={user}
                        onUpdateUser={onUpdateUser}
                        onExportCSV={exportToCSV}
                        onExportJSON={exportData}
                        onImportJSON={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    try {
                                        const data = JSON.parse(event.target?.result as string);
                                        importData(data);
                                        alert("Données importées avec succès !");
                                    } catch (err) { alert("Erreur lors de l'import"); }
                                };
                                reader.readAsText(file);
                            }
                        }}
                        onDeleteAccount={onDeleteAccount}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
