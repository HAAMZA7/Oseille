import {
    ShoppingBag,
    Home,
    Car,
    Coffee,
    Zap,
    Activity,
    DollarSign,
    Briefcase,
    MoreHorizontal
} from "lucide-react";

export type TransactionType = 'income' | 'expense';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    pin: string;
    isPro?: boolean;
    budget?: number;
}

export interface Transaction {
    id: string;
    userId: string;
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    date: string;
}

export const CATEGORIES = [
    { id: 'Courses', icon: ShoppingBag, color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10', hex: '#f97316' },
    { id: 'Logement', icon: Home, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10', hex: '#3b82f6' },
    { id: 'Transport', icon: Car, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10', hex: '#6366f1' },
    { id: 'Nourriture', icon: Coffee, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10', hex: '#ca8a04' },
    { id: 'Loisirs', icon: Zap, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10', hex: '#a855f7' },
    { id: 'Santé', icon: Activity, color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10', hex: '#f43f5e' },
    { id: 'Salaire', icon: DollarSign, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10', hex: '#10b981' },
    { id: 'Freelance', icon: Briefcase, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10', hex: '#06b6d4' },
    { id: 'Autre', icon: MoreHorizontal, color: 'text-slate-500 bg-slate-50 dark:bg-slate-500/10', hex: '#64748b' },
];
