import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ui/ThemeToggle';
import { Chrome, Loader2 } from 'lucide-react';

interface GoogleAuthViewProps {
    isDark: boolean;
    toggleDark: () => void;
    onSignIn: () => Promise<void>;
}

export const GoogleAuthView = ({ isDark, toggleDark, onSignIn }: GoogleAuthViewProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await onSignIn();
        } catch (err: any) {
            setError(err.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 transition-colors">
            <div className="absolute top-8 right-8 z-10">
                <ThemeToggle isDark={isDark} onToggle={toggleDark} />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors text-center">
                    {/* Logo */}
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                        <span className="text-4xl">💸</span>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic tracking-tight">Oseille.</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                        Gérez votre budget en toute simplicité
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl">
                            <p className="text-rose-600 dark:text-rose-400 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleSignIn}
                        disabled={loading}
                        className="w-full py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-lg shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <>
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continuer avec Google
                            </>
                        )}
                    </button>

                    <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
                        En continuant, vous acceptez nos conditions d'utilisation
                    </p>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <span className="text-lg">🔒</span>
                            <span className="text-sm font-medium">Données synchronisées et sécurisées</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
