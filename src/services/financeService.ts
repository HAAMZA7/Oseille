import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Transaction } from '@/types';

/**
 * Service to handle all financial data operations with Firestore.
 * Abstraction layer to keep UI hooks clean and decoupled from Firebase SDK.
 */
export const financeService = {
    /**
     * Subscribe to real-time transaction updates for a specific user
     */
    subscribeToTransactions: (userId: string, callback: (txs: Transaction[]) => void) => {
        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', userId)
        );

        return onSnapshot(q, (snapshot) => {
            const txs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Transaction, 'id'>)
            })) as Transaction[];

            // Sort by date descending
            txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            callback(txs);
        }, (error) => {
            console.error('FinanceService: Subscribe error:', error);
        });
    },

    /**
     * Add a single transaction
     */
    addTransaction: async (userId: string, tx: Omit<Transaction, 'id'>) => {
        try {
            return await addDoc(collection(db, 'transactions'), {
                ...tx,
                userId
            });
        } catch (error) {
            console.error('FinanceService: Add error:', error);
            throw error;
        }
    },

    /**
     * Delete a single transaction
     */
    deleteTransaction: async (txId: string) => {
        try {
            await deleteDoc(doc(db, 'transactions', txId));
        } catch (error) {
            console.error('FinanceService: Delete error:', error);
            throw error;
        }
    },

    /**
     * Bulk import transactions
     */
    importTransactions: async (userId: string, transactions: Omit<Transaction, 'id'>[]) => {
        // Optimization: In a real world-class app, we would use a writeBatch here.
        // For now, we keep it simple but abstracted.
        const promises = transactions.map(tx =>
            addDoc(collection(db, 'transactions'), { ...tx, userId })
        );
        return Promise.all(promises);
    }
};
