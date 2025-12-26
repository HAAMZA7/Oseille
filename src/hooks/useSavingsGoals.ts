import { useState, useEffect } from 'react';
import { SavingsGoal, UserProfile } from '@/types';

export const useSavingsGoals = (currentUser: UserProfile | null) => {
    const [goals, setGoals] = useState<SavingsGoal[]>([]);

    useEffect(() => {
        if (currentUser) {
            const saved = localStorage.getItem(`goals_${currentUser.id}`);
            if (saved) {
                setGoals(JSON.parse(saved));
            } else {
                setGoals([]);
            }
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser && goals.length > 0) {
            localStorage.setItem(`goals_${currentUser.id}`, JSON.stringify(goals));
        }
    }, [goals, currentUser]);

    const addGoal = (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt' | 'currentAmount'>) => {
        const newGoal: SavingsGoal = {
            ...goal,
            id: Math.random().toString(36).substr(2, 9),
            userId: currentUser?.id || '',
            currentAmount: 0,
            createdAt: new Date().toISOString(),
        };
        setGoals(prev => [...prev, newGoal]);
    };

    const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    };

    const deleteGoal = (id: string) => {
        setGoals(prev => prev.filter(g => g.id !== id));
        if (currentUser) {
            const remaining = goals.filter(g => g.id !== id);
            if (remaining.length === 0) {
                localStorage.removeItem(`goals_${currentUser.id}`);
            }
        }
    };

    const addToGoal = (id: string, amount: number) => {
        setGoals(prev => prev.map(g =>
            g.id === id
                ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
                : g
        ));
    };

    const getProgress = (goal: SavingsGoal) => {
        return (goal.currentAmount / goal.targetAmount) * 100;
    };

    return {
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        addToGoal,
        getProgress
    };
};
