import { useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { AuthContext, type AuthContextValue } from "@/features/auth/auth-context";
import { getFirebaseAuth, googleAuthProvider, isFirebaseConfigured } from "@/services/firebase";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
      signInWithGoogle: async () => {
        const auth = getFirebaseAuth();
        if (!auth) throw new Error("Firebase is not configured.");
        await signInWithPopup(auth, googleAuthProvider);
      },
      signInWithEmail: async (email, password) => {
        const auth = getFirebaseAuth();
        if (!auth) throw new Error("Firebase is not configured.");
        await signInWithEmailAndPassword(auth, email, password);
      },
      createAccount: async (name, email, password) => {
        const auth = getFirebaseAuth();
        if (!auth) throw new Error("Firebase is not configured.");
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(credential.user, { displayName: name.trim() });
        }
      },
      logout: async () => {
        const auth = getFirebaseAuth();
        if (!auth) return;
        await signOut(auth);
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
