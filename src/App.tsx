import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useFirestoreUser } from './hooks/useFirestore';
import { LandingPage } from './components/LandingPage';
import { GoogleAuthView } from './components/GoogleAuthView';
import { Dashboard } from './components/dashboard/Dashboard';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { UserProfile } from './types';

// Loading spinner component
const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] mx-auto mb-6 flex items-center justify-center animate-pulse">
                <span className="text-3xl">💸</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Chargement...</p>
        </div>
    </div>
);

// Main app content (wrapped by AuthProvider)
function AppContent() {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    const [showLanding, setShowLanding] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const { user, loading: authLoading, signInWithGoogle, logout } = useAuth();

    // Apply theme
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    // Fetch or create user profile when Firebase user changes
    useEffect(() => {
        const setupUserProfile = async () => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setUserProfile({ id: user.uid, ...userDoc.data() } as UserProfile);
                } else {
                    // Create new profile for first-time users
                    const newProfile: Omit<UserProfile, 'id'> = {
                        name: user.displayName || 'Utilisateur',
                        email: user.email || '',
                        pin: '',
                        budget: 2000
                    };
                    await setDoc(userRef, newProfile);
                    setUserProfile({ id: user.uid, ...newProfile });
                }
                setShowLanding(false);
            } else {
                setUserProfile(null);
            }
        };

        if (!authLoading) {
            setupUserProfile();
        }
    }, [user, authLoading]);

    const toggleDark = () => setIsDark(!isDark);

    const handleLogout = async () => {
        await logout();
        setUserProfile(null);
        setShowLanding(true);
    };

    const handleUpdateUser = async (updated: UserProfile) => {
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            const { id, ...data } = updated;
            await setDoc(userRef, data, { merge: true });
            setUserProfile(updated);
        }
    };

    const handleDeleteAccount = async () => {
        if (user && confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Toutes vos données seront perdues.")) {
            // Note: Full account deletion would require Firebase Admin SDK
            // For now, just log out
            await handleLogout();
        }
    };

    // Loading state
    if (authLoading) {
        return <LoadingScreen />;
    }

    // Landing page for new visitors
    if (showLanding && !user) {
        return (
            <LandingPage
                isDark={isDark}
                toggleDark={toggleDark}
                onStart={() => setShowLanding(false)}
            />
        );
    }

    // Google Sign In page
    if (!user) {
        return (
            <GoogleAuthView
                isDark={isDark}
                toggleDark={toggleDark}
                onSignIn={signInWithGoogle}
            />
        );
    }

    // Dashboard for authenticated users
    if (userProfile) {
        return (
            <Dashboard
                user={userProfile}
                onLogout={handleLogout}
                onUpdateUser={handleUpdateUser}
                onDeleteAccount={handleDeleteAccount}
                theme={isDark ? 'dark' : 'light'}
                toggleTheme={toggleDark}
            />
        );
    }

    return <LoadingScreen />;
}

// Root component with AuthProvider wrapper
export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
