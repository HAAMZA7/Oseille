import { useState, useEffect, useMemo } from 'react';
import { UserProfile, Transaction } from '@/types';

export const useFinanceData = (currentUser: UserProfile | null) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        if (currentUser) {
            const saved = localStorage.getItem(`txs_${currentUser.id}`);
            if (saved) {
                setTransactions(JSON.parse(saved));
            } else {
                setTransactions([]);
            }
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser && transactions.length > 0) {
            localStorage.setItem(`txs_${currentUser.id}`, JSON.stringify(transactions));
        }
    }, [transactions, currentUser]);

    const monthTxs = useMemo(() => {
        return transactions.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
        });
    }, [transactions, currentMonth]);

    const stats = useMemo(() => {
        const income = monthTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expense = monthTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const balance = income - expense;
        return { income, expense, balance };
    }, [monthTxs]);

    const addTransaction = (tx: Transaction) => {
        setTransactions(prev => [...prev, tx]);
    };

    const deleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const importData = (data: Transaction[]) => {
        setTransactions(data);
    };

    const exportData = () => {
        const dataStr = JSON.stringify(transactions);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'oseille_backup.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const exportToCSV = () => {
        const headers = ['Date', 'Titre', 'Catégorie', 'Montant', 'Type'];
        const rows = transactions.map(t => [t.date, t.title, t.category, t.amount, t.type]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "oseille_export.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return {
        transactions,
        monthTxs,
        stats,
        currentMonth,
        setCurrentMonth,
        addTransaction,
        deleteTransaction,
        importData,
        exportData,
        exportToCSV
    };
};
