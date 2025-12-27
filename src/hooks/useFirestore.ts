import { useState, useEffect } from 'react';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    orderBy,
    setDoc,
    getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Transaction, UserProfile } from '@/types';

// User Profile Hook
export const useFirestoreUser = (userId: string | undefined) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setUserProfile(null);
            setLoading(false);
            return;
        }

        const userRef = doc(db, 'users', userId);

        const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                setUserProfile({ id: doc.id, ...doc.data() } as UserProfile);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const createUserProfile = async (userId: string, name: string, email: string) => {
        const userRef = doc(db, 'users', userId);
        const newUser: Omit<UserProfile, 'id'> = {
            name,
            email,
            pin: '', // Not used with Firebase Auth
            budget: 2000
        };
        await setDoc(userRef, newUser);
        return { id: userId, ...newUser };
    };

    const updateUserProfile = async (updates: Partial<UserProfile>) => {
        if (!userId) return;
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, updates);
    };

    return { userProfile, loading, createUserProfile, updateUserProfile };
};

// Transactions Hook
export const useFirestoreTransactions = (userId: string | undefined) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', userId),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const txs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Transaction[];
            setTransactions(txs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
        if (!userId) return;
        await addDoc(collection(db, 'transactions'), tx);
    };

    const deleteTransaction = async (txId: string) => {
        await deleteDoc(doc(db, 'transactions', txId));
    };

    return { transactions, loading, addTransaction, deleteTransaction };
};

// Savings Goals Hook
export const useFirestoreGoals = (userId: string | undefined) => {
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setGoals([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'goals'),
            where('userId', '==', userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setGoals(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const addGoal = async (goal: any) => {
        if (!userId) return;
        await addDoc(collection(db, 'goals'), { ...goal, userId });
    };

    const updateGoal = async (goalId: string, updates: any) => {
        await updateDoc(doc(db, 'goals', goalId), updates);
    };

    const deleteGoal = async (goalId: string) => {
        await deleteDoc(doc(db, 'goals', goalId));
    };

    return { goals, loading, addGoal, updateGoal, deleteGoal };
};

// Recurring Transactions Hook
export const useFirestoreRecurring = (userId: string | undefined) => {
    const [recurring, setRecurring] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setRecurring([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'recurring'),
            where('userId', '==', userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecurring(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const addRecurring = async (item: any) => {
        if (!userId) return;
        await addDoc(collection(db, 'recurring'), { ...item, userId });
    };

    const updateRecurring = async (id: string, updates: any) => {
        await updateDoc(doc(db, 'recurring', id), updates);
    };

    const deleteRecurring = async (id: string) => {
        await deleteDoc(doc(db, 'recurring', id));
    };

    return { recurring, loading, addRecurring, updateRecurring, deleteRecurring };
};
