import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ui/ThemeToggle';
import { UserProfile } from '@/types';

interface AuthViewProps {
    isDark: boolean;
    toggleDark: () => void;
    users: UserProfile[];
    onRegister: (name: string, email: string, pin: string) => void;
    onLogin: (user: UserProfile) => void;
}

export const AuthView = ({ isDark, toggleDark, users, onRegister, onLogin }: AuthViewProps) => {
    const [mode, setMode] = useState<'login' | 'register'>('register');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pin, setPin] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'register') {
            onRegister(name, email, pin);
        } else {
            const found = users.find(u => u.email === email && u.pin === pin);
            if (found) {
                onLogin(found);
            } else {
                alert("Identifiants incorrects");
            }
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
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic tracking-tight">Oseille.</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                        {mode === 'register' ? "Créez votre coffre-fort sécurisé." : "Heureux de vous revoir."}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Prénom</label>
                                <input required type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 ring-indigo-500/20 dark:text-white font-bold transition-colors" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Email</label>
                            <input required type="email" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 ring-indigo-500/20 dark:text-white font-bold transition-colors" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Code PIN (4 chiffres)</label>
                            <input required type="password" maxLength={4} inputMode="numeric" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 ring-indigo-500/20 dark:text-white font-bold text-center tracking-widest transition-colors" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} />
                        </div>

                        <button type="submit" className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 dark:hover:bg-indigo-700 active:scale-95 transition-all">
                            {mode === 'register' ? "Créer mon compte" : "Se connecter"}
                        </button>
                    </form>

                    <button
                        onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                        className="w-full text-center mt-6 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                        {mode === 'register' ? "Déjà un compte ? Connectez-vous" : "Pas encore de compte ? S'inscrire"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
