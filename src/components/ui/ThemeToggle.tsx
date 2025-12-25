import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
    isDark: boolean;
    onToggle: () => void;
}

export const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => (
    <button
        onClick={onToggle}
        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
        title={isDark ? "Passer au mode clair" : "Passer au mode sombre"}
    >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
);
