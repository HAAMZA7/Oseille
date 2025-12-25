import { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { LandingPage } from './components/LandingPage';
import { LockScreen } from './components/LockScreen';
import { AuthView } from './components/AuthView';
import { Dashboard } from './components/dashboard/Dashboard';

export default function App() {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    const [view, setView] = useState<'landing' | 'auth' | 'app'>('landing');
    const [users, setUsers] = useState<UserProfile[]>(() => {
        const saved = localStorage.getItem('oseille_users');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
        const saved = localStorage.getItem('oseille_current_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    useEffect(() => {
        localStorage.setItem('oseille_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('oseille_current_user', JSON.stringify(currentUser));
            setView('app');
        } else {
            localStorage.removeItem('oseille_current_user');
            if (view === 'app') setView('landing');
        }
    }, [currentUser]);

    const handleRegister = (name: string, email: string, pin: string) => {
        const newUser: UserProfile = { id: Math.random().toString(36).substr(2, 9), name, email, pin, budget: 2000 };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        setIsLocked(false);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsLocked(true);
        setView('landing');
    };

    const deleteAccount = () => {
        if (currentUser && confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Toutes vos données seront perdues.")) {
            localStorage.removeItem(`txs_${currentUser.id}`);
            setUsers(prev => prev.filter(u => u.id !== currentUser.id));
            handleLogout();
        }
    };

    const toggleDark = () => setIsDark(!isDark);

    if (view === 'landing') {
        return <LandingPage isDark={isDark} toggleDark={toggleDark} onStart={() => setView('auth')} />;
    }

    if (view === 'auth') {
        return (
            <AuthView
                isDark={isDark}
                toggleDark={toggleDark}
                users={users}
                onRegister={handleRegister}
                onLogin={(user) => {
                    setCurrentUser(user);
                    setIsLocked(true);
                }}
            />
        );
    }

    if (currentUser && isLocked) {
        return (
            <LockScreen
                userName={currentUser.name}
                correctPin={currentUser.pin}
                isDark={isDark}
                toggleDark={toggleDark}
                onUnlock={() => setIsLocked(false)}
            />
        );
    }

    if (currentUser) {
        return (
            <Dashboard
                user={currentUser}
                onLogout={handleLogout}
                onUpdateUser={(updated) => {
                    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
                    setCurrentUser(updated);
                }}
                onDeleteAccount={deleteAccount}
            />
        );
    }

    return null;
}
