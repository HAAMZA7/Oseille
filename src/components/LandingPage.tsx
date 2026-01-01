import React from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Sparkles,
    ArrowRight,
    ShieldCheck,
    LayoutDashboard,
    ShoppingBag,
    DollarSign,
    Coffee,
    Car,
    PieChart as LucidePieChart
} from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';

interface LandingPageProps {
    onStart: () => void;
    isDark: boolean;
    toggleDark: () => void;
}

export const LandingPage = ({ onStart, isDark, toggleDark }: LandingPageProps) => {
    const previewTransactions = [
        { id: 1, title: 'Apple Store', category: 'Loisirs', amount: -1099, type: 'expense', icon: ShoppingBag, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300' },
        { id: 2, title: 'Salaire', category: 'Revenu', amount: 4500, type: 'income', icon: DollarSign, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
        { id: 3, title: 'Uber Eats', category: 'Nourriture', amount: -32.50, type: 'expense', icon: Coffee, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10' },
        { id: 4, title: 'Station Essence', category: 'Transport', amount: -85.00, type: 'expense', icon: Car, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative selection:bg-indigo-500/30 flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative z-10 w-full">
                <div className="flex items-center gap-2">
                    <div className="bg-slate-900 dark:bg-indigo-600 p-2 rounded-xl text-white shadow-lg transition-colors">
                        <Wallet size={24} />
                    </div>
                    <span className="text-2xl font-black italic tracking-tighter text-slate-900 dark:text-white transition-colors">Oseille</span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle isDark={isDark} onToggle={toggleDark} />
                    <button
                        onClick={onStart}
                        className="px-6 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full font-bold text-sm hover:scale-105 transition-all active:scale-95 shadow-lg"
                    >
                        Se connecter
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center relative z-10 w-full flex-grow">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-100 dark:border-indigo-500/20"
                >
                    <Sparkles size={14} className="animate-pulse" /> SaaS - Version 2.0
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1] transition-colors"
                >
                    Gérez votre argent <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">sans effort.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed transition-colors"
                >
                    Oseille est conçu pour la simplicité, la sécurité locale et la clarté financière. Vos données restent sur votre appareil, sous votre contrôle.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <button
                        onClick={onStart}
                        className="w-full sm:w-auto px-10 py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-all flex items-center justify-center gap-3 group active:scale-95"
                    >
                        Commencer gratuitement
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold text-sm transition-colors">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center transition-colors">
                            <ShieldCheck size={20} />
                        </div>
                        Privacy-First Security
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-28 relative max-w-5xl mx-auto px-4 sm:px-0 mb-20"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-4 transition-all duration-700 ease-out hover:scale-[1.02] perspective-1000 group glassmorphism">
                        <div className="h-12 flex items-center gap-2 px-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 bg-slate-50/50 dark:bg-slate-950/50 rounded-b-[2.5rem] overflow-hidden relative text-left">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <div className="h-8 w-48 bg-slate-900 dark:bg-white rounded-lg mb-2 opacity-10" />
                                    <div className="h-4 w-32 bg-slate-500 dark:bg-slate-400 rounded-lg opacity-20" />
                                </div>
                                <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                    <LayoutDashboard size={20} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                {[
                                    { label: 'Solde', val: '€ 12,450.00', icon: Wallet, color: 'bg-indigo-500 text-white' },
                                    { label: 'Revenus', val: '€ 4,200.00', icon: TrendingUp, color: 'bg-emerald-500 text-white' },
                                    { label: 'Dépenses', val: '€ 1,850.00', icon: TrendingDown, color: 'bg-rose-500 text-white' }
                                ].map((s, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color} shadow-md`}>
                                            <s.icon size={18} />
                                        </div>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter opacity-90">{s.val}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="sm:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <div className="space-y-4">
                                        {previewTransactions.map((t) => (
                                            <div key={t.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.color}`}>
                                                        <t.icon size={20} />
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</div>
                                                </div>
                                                <div className={`font-black text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                                                    {t.amount > 0 ? '+' : ''}{t.amount}€
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900 dark:bg-indigo-600 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                    <div className="flex items-center gap-2 mb-8 font-bold">
                                        <LucidePieChart size={18} /> Analyse
                                    </div>
                                    <div className="relative h-32 flex items-center justify-center">
                                        <div className="w-24 h-24 rounded-full border-[12px] border-indigo-400 border-t-emerald-400 border-r-rose-400 rotate-45" />
                                        <div className="absolute inset-0 flex items-center justify-center font-black text-xl">75%</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer Signature */}
            <footer className="py-6 text-center border-t border-slate-100 dark:border-slate-800 transition-colors">
                <div className="signature-container">
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                        Made with <span className="heart-emoji">❤️</span> by{' '}
                        <strong className="text-slate-600 dark:text-slate-300">Hamza DJOUDI</strong>
                    </p>
                    <a
                        href="https://djoudi.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="signature-link text-sm font-bold"
                    >
                        djoudi.dev
                    </a>
                </div>
            </footer>
        </div>
    );
};
