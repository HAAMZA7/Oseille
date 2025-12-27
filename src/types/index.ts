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
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Account {
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'cash' | 'investment';
    color: string;
    icon?: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    pin: string;
    isPro?: boolean;
    budget?: number;
    accounts?: Account[];
    accentColor?: string;
}

export interface Transaction {
    id: string;
    userId: string;
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    date: string;
    accountId?: string;
    isRecurring?: boolean;
    recurringId?: string;
}

export interface RecurringTransaction {
    id: string;
    userId: string;
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    frequency: RecurrenceFrequency;
    startDate: string;
    endDate?: string;
    lastGenerated?: string;
    accountId?: string;
    isActive: boolean;
}

export interface SavingsGoal {
    id: string;
    userId: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    color: string;
    icon?: string;
    createdAt: string;
}

export const EXPENSE_CATEGORIES = [
    { id: 'Courses', icon: ShoppingBag, color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10', hex: '#f97316' },
    { id: 'Logement', icon: Home, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10', hex: '#3b82f6' },
    { id: 'Transport', icon: Car, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10', hex: '#6366f1' },
    { id: 'Nourriture', icon: Coffee, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10', hex: '#ca8a04' },
    { id: 'Loisirs', icon: Zap, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10', hex: '#a855f7' },
    { id: 'Santé', icon: Activity, color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10', hex: '#f43f5e' },
    { id: 'Autre', icon: MoreHorizontal, color: 'text-slate-500 bg-slate-50 dark:bg-slate-500/10', hex: '#64748b' },
];

export const INCOME_CATEGORIES = [
    { id: 'Salaire', icon: DollarSign, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10', hex: '#10b981' },
    { id: 'Freelance', icon: Briefcase, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10', hex: '#06b6d4' },
    { id: 'Autre', icon: MoreHorizontal, color: 'text-slate-500 bg-slate-50 dark:bg-slate-500/10', hex: '#64748b' },
];

// Combined for backward compatibility
export const CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES.filter(c => c.id !== 'Autre')];

export const ACCOUNT_TYPES = [
    { id: 'checking', name: 'Compte Courant', color: '#3b82f6' },
    { id: 'savings', name: 'Épargne', color: '#10b981' },
    { id: 'cash', name: 'Espèces', color: '#f59e0b' },
    { id: 'investment', name: 'Investissement', color: '#8b5cf6' },
];

export const GOAL_COLORS = [
    '#f43f5e', '#f97316', '#eab308', '#22c55e', '#10b981',
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'
];

