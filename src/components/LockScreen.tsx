import React, { useState, useEffect } from 'react';
import { Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ui/ThemeToggle';

interface LockScreenProps {
    userName: string;
    correctPin: string;
    onUnlock: () => void;
    isDark: boolean;
    toggleDark: () => void;
}

export const LockScreen = ({ userName, correctPin, onUnlock, isDark, toggleDark }: LockScreenProps) => {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    // Listen for keyboard input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key >= '0' && e.key <= '9') {
                handleKeyPress(e.key);
            } else if (e.key === 'Backspace') {
                setPin(prev => prev.slice(0, -1));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pin, correctPin]);

    const handleKeyPress = (num: string) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 4) {
                if (newPin === correctPin) {
                    onUnlock();
                } else {
                    setError(true);
                    setTimeout(() => {
                        setPin("");
                        setError(false);
                    }, 600);
                }
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-3xl transition-colors">
            <div className="absolute top-8 right-8">
                <ThemeToggle isDark={isDark} onToggle={toggleDark} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <motion.div
                    animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                    className={`mx-auto w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-300 ${error ? 'bg-rose-500 text-white' : 'bg-slate-900 dark:bg-indigo-600 text-white shadow-2xl'}`}
                >
                    <Lock size={32} />
                </motion.div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter mb-2">Bienvenue, {userName}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Entrez votre code confidentiel</p>
            </motion.div>

            <div className="flex gap-4 mb-12 h-6">
                {[0, 1, 2, 3].map(i => (
                    <motion.div
                        key={i}
                        animate={pin.length > i ? { scale: 1.2, backgroundColor: '#4f46e5' } : { scale: 1 }}
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'border-indigo-600' : 'border-slate-300 dark:border-slate-700'} ${error ? 'border-rose-500 bg-rose-500' : ''}`}
                    />
                ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
                    <button
                        key={val}
                        onClick={() => handleKeyPress(val.toString())}
                        className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-900 text-2xl font-bold text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-90"
                    >
                        {val}
                    </button>
                ))}
                <div />
                <button
                    onClick={() => handleKeyPress("0")}
                    className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-900 text-2xl font-bold text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-90"
                >
                    0
                </button>
                <button
                    onClick={() => setPin("")}
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors active:scale-90"
                >
                    <X size={28} />
                </button>
            </div>
        </div>
    );
};
