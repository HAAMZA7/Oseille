import React, { useRef } from 'react';
import { X, Heart, FileSpreadsheet, Download, Upload, ArrowRight, AlertTriangle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserProfile } from '@/types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: UserProfile;
    onUpdateUser: (updated: UserProfile) => void;
    onExportCSV: () => void;
    onExportJSON: () => void;
    onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteAccount: () => void;
}

export const SettingsModal = ({
    isOpen,
    onClose,
    currentUser,
    onUpdateUser,
    onExportCSV,
    onExportJSON,
    onImportJSON,
    onDeleteAccount
}: SettingsModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-8 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black italic text-slate-900 dark:text-white">Paramètres</h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold text-slate-600 dark:text-slate-300">
                            {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{currentUser.name}</h4>
                            <p className="text-xs text-slate-500">{currentUser.email}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Objectif Budget Mensuel (€)</label>
                        <input
                            type="number"
                            defaultValue={currentUser.budget || 2000}
                            onBlur={(e) => {
                                const newBudget = parseFloat(e.target.value);
                                if (!isNaN(newBudget)) {
                                    onUpdateUser({ ...currentUser, budget: newBudget });
                                }
                            }}
                            className="w-full bg-transparent font-black text-2xl text-slate-900 dark:text-white outline-none border-b border-slate-200 dark:border-slate-700 focus:border-indigo-500 transition-colors py-2"
                        />
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 rounded-lg">
                                <Heart size={18} className="fill-current" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Soutenir le développeur</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 text-balance">L'app est gratuite, payez-moi un café ! ☕️</p>
                            </div>
                        </div>
                        <a href="https://ko-fi.com" target="_blank" rel="noreferrer" className="block w-full py-3 bg-indigo-600 text-white text-center rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-transform">
                            Faire un don sur Ko-fi
                        </a>
                    </div>

                    <div className="grid gap-2">
                        <button onClick={onExportCSV} className="w-full p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all border border-emerald-100 dark:border-emerald-500/20">
                            <span className="flex items-center gap-3"><FileSpreadsheet size={18} /> Exporter en CSV</span>
                            <Download size={16} className="opacity-50" />
                        </button>

                        <button onClick={onExportJSON} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                            <span className="flex items-center gap-3"><Download size={18} /> Sauvegarde JSON</span>
                            <ArrowRight size={16} className="opacity-50" />
                        </button>

                        <div className="relative">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/json"
                                className="hidden"
                                onChange={onImportJSON}
                            />
                            <button onClick={() => fileInputRef.current?.click()} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                                <span className="flex items-center gap-3"><Upload size={18} /> Importer JSON</span>
                                <ArrowRight size={16} className="opacity-50" />
                            </button>
                        </div>

                        <button onClick={onDeleteAccount} className="w-full p-4 bg-rose-50 dark:bg-rose-500/10 rounded-2xl font-bold text-rose-600 dark:text-rose-400 flex items-center justify-between hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all border border-rose-100 dark:border-rose-500/20 mt-4">
                            <span className="flex items-center gap-3"><AlertTriangle size={18} /> Supprimer compte</span>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs font-medium text-slate-400 mb-1">Oseille v2.1.0 • Stockage Local</p>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Hamza DJOUDI</p>
                </div>
            </motion.div>
        </div>
    );
};
