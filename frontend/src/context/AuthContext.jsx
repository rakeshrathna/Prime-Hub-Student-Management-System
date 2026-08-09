import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import * as authApi from "../api/auth";
import { readSession, writeSession, registerUnauthorizedHandler, API_BASE_URL } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession());

  const logout = useCallback(() => {
    setSession(null);
    writeSession(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      writeSession(null);
      setSession(null);
    });
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login(email, password);
    const nextSession = {
      token: res.token,
      user: {
        id: res.id,
        name: res.name,
        email: res.email,
        role: res.role,
        profileImageUrl: res.profileImageUrl,
        phoneNumber: res.phoneNumber,
      },
    };
    writeSession(nextSession);
    setSession(nextSession);
    return nextSession.user;
  }, []);

  // Allows a page (e.g. profile update) to patch the cached user object
  // without forcing a re-login.
  const updateCachedUser = useCallback((patch) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, user: { ...prev.user, ...patch } };
      writeSession(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      login,
      logout,
      updateCachedUser,
      apiBaseUrl: API_BASE_URL,
    }),
    [session, login, logout, updateCachedUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
