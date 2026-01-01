import { useState, useEffect, useMemo } from 'react';
import { UserProfile, Transaction } from '@/types';
import { financeService } from '@/services/financeService';

export const useFinanceData = (currentUser: UserProfile | null) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);

    // Real-time sync via Service Layer
    useEffect(() => {
        if (!currentUser?.id) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        const unsubscribe = financeService.subscribeToTransactions(
            currentUser.id,
            (txs) => {
                setTransactions(txs);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser?.id]);

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

    const addTransaction = async (tx: Transaction) => {
        if (!currentUser?.id) return;
        const { id, ...txData } = tx;
        await financeService.addTransaction(currentUser.id, txData);
    };

    const deleteTransaction = async (txId: string) => {
        await financeService.deleteTransaction(txId);
    };

    const importData = async (data: Transaction[]) => {
        if (!currentUser?.id) return;
        const cleanData = data.map(({ id, ...rest }) => rest);
        await financeService.importTransactions(currentUser.id, cleanData);
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
        exportToCSV,
        loading
    };
};
