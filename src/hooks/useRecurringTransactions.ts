import { useState, useEffect, useCallback } from 'react';
import { RecurringTransaction, Transaction, UserProfile } from '@/types';

export const useRecurringTransactions = (
    currentUser: UserProfile | null,
    addTransaction: (tx: Transaction) => void
) => {
    const [recurringTxs, setRecurringTxs] = useState<RecurringTransaction[]>([]);

    // Load recurring transactions
    useEffect(() => {
        if (currentUser) {
            const saved = localStorage.getItem(`recurring_${currentUser.id}`);
            if (saved) {
                setRecurringTxs(JSON.parse(saved));
            } else {
                setRecurringTxs([]);
            }
        }
    }, [currentUser]);

    // Save recurring transactions
    useEffect(() => {
        if (currentUser && recurringTxs.length > 0) {
            localStorage.setItem(`recurring_${currentUser.id}`, JSON.stringify(recurringTxs));
        }
    }, [recurringTxs, currentUser]);

    // Generate pending transactions on load
    const generatePendingTransactions = useCallback(() => {
        if (!currentUser) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        recurringTxs.forEach(rt => {
            if (!rt.isActive) return;

            const lastGen = rt.lastGenerated ? new Date(rt.lastGenerated) : new Date(rt.startDate);
            lastGen.setHours(0, 0, 0, 0);

            let nextDate = new Date(lastGen);

            // Calculate next occurrence based on frequency
            const incrementDate = () => {
                switch (rt.frequency) {
                    case 'daily':
                        nextDate.setDate(nextDate.getDate() + 1);
                        break;
                    case 'weekly':
                        nextDate.setDate(nextDate.getDate() + 7);
                        break;
                    case 'monthly':
                        nextDate.setMonth(nextDate.getMonth() + 1);
                        break;
                    case 'yearly':
                        nextDate.setFullYear(nextDate.getFullYear() + 1);
                        break;
                }
            };

            // Generate all missed transactions
            incrementDate();
            while (nextDate <= today) {
                if (rt.endDate && nextDate > new Date(rt.endDate)) break;

                const newTx: Transaction = {
                    id: Math.random().toString(36).substr(2, 9),
                    userId: currentUser.id,
                    title: rt.title,
                    amount: rt.amount,
                    type: rt.type,
                    category: rt.category,
                    date: nextDate.toISOString().split('T')[0],
                    isRecurring: true,
                    recurringId: rt.id,
                    accountId: rt.accountId,
                };

                addTransaction(newTx);

                // Update lastGenerated
                setRecurringTxs(prev => prev.map(r =>
                    r.id === rt.id
                        ? { ...r, lastGenerated: nextDate.toISOString().split('T')[0] }
                        : r
                ));

                incrementDate();
            }
        });
    }, [recurringTxs, currentUser, addTransaction]);

    // Run generation on mount
    useEffect(() => {
        if (currentUser && recurringTxs.length > 0) {
            generatePendingTransactions();
        }
    }, [currentUser]); // Only on user change, not on recurringTxs change to avoid loops

    const addRecurring = (tx: Omit<RecurringTransaction, 'id' | 'userId' | 'isActive' | 'lastGenerated'>) => {
        const newRecurring: RecurringTransaction = {
            ...tx,
            id: Math.random().toString(36).substr(2, 9),
            userId: currentUser?.id || '',
            isActive: true,
            lastGenerated: tx.startDate,
        };
        setRecurringTxs(prev => [...prev, newRecurring]);
    };

    const updateRecurring = (id: string, updates: Partial<RecurringTransaction>) => {
        setRecurringTxs(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const deleteRecurring = (id: string) => {
        setRecurringTxs(prev => prev.filter(r => r.id !== id));
        if (currentUser) {
            const remaining = recurringTxs.filter(r => r.id !== id);
            if (remaining.length === 0) {
                localStorage.removeItem(`recurring_${currentUser.id}`);
            }
        }
    };

    const toggleRecurring = (id: string) => {
        setRecurringTxs(prev => prev.map(r =>
            r.id === id ? { ...r, isActive: !r.isActive } : r
        ));
    };

    return {
        recurringTxs,
        addRecurring,
        updateRecurring,
        deleteRecurring,
        toggleRecurring,
    };
};
