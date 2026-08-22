import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments, useGlobalSearchParams } from "expo-router";
import { Platform } from "react-native";

type UserRole = "owner" | "delivery_boy" | null;

interface AuthContextData {
  token: string | null;
  role: UserRole;
  distributorId: string | null;
  isLoading: boolean;
  login: (token: string, role: string, distributorId?: string | null, isNewUser?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({
  token: null,
  role: null,
  distributorId: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [distributorId, setDistributorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  const params = useGlobalSearchParams();

  useEffect(() => {
    async function loadToken() {
      try {
        if (params.logout === "true") {
          await AsyncStorage.removeItem("jwt_token");
          await AsyncStorage.removeItem("user_role");
          await AsyncStorage.removeItem("distributor_id");
          if (Platform.OS === "web") {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }

        const storedToken = await AsyncStorage.getItem("jwt_token");
        
        if (storedToken) {
          // Fetch authoritative role from backend
          const res = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data && data.data.user) {
              setToken(storedToken);
              setRole(data.data.user.role as UserRole);
              setDistributorId(data.data.user.distributorId ? data.data.user.distributorId.toString() : null);
              
              // Ensure AsyncStorage reflects authoritative state
              await AsyncStorage.setItem("user_role", data.data.user.role);
              if (data.data.user.distributorId) {
                await AsyncStorage.setItem("distributor_id", data.data.user.distributorId.toString());
              }
            } else {
              // Invalid token response
              await AsyncStorage.removeItem("jwt_token");
            }
          } else {
            // Unauthorized / failed
            await AsyncStorage.removeItem("jwt_token");
          }
        }
      } catch (error) {
        console.error("Failed to load auth state", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadToken();
  }, []);

  const [initialRedirectDone, setInitialRedirectDone] = useState(false);

  // 1. Initial startup redirect (runs exactly once after loading stored token)
  useEffect(() => {
    if (isLoading || initialRedirectDone) return;

    const inAuthGroup = segments[0] === "(auth)" || segments.length === 0 || segments[0] === "index";

    if (token && inAuthGroup) {
      setInitialRedirectDone(true);
      if (role === "owner" && Platform.OS === "web") {
        window.location.href = `http://localhost:5173/dashboard?token=${token}`;
      } else if (role === "delivery_boy") {
        router.replace("/(tabs)/home");
      }
    } else {
      setInitialRedirectDone(true);
    }
  }, [isLoading, token, role, segments, initialRedirectDone]);

  // 2. Runtime route protection
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)" || segments.length === 0 || segments[0] === "index";

    if (!token && !inAuthGroup) {
      // Not authenticated and trying to access protected screen → redirect to root selection
      router.replace("/");
    }
  }, [token, segments, isLoading]);

  const login = async (newToken: string, newRole: string, newDistributorId?: string | null, isNewUser?: boolean) => {
    await AsyncStorage.setItem("jwt_token", newToken);
    await AsyncStorage.setItem("user_role", newRole);
    if (newDistributorId) {
      await AsyncStorage.setItem("distributor_id", newDistributorId.toString());
    } else {
      await AsyncStorage.removeItem("distributor_id");
    }
    setToken(newToken);
    setRole(newRole as UserRole);
    setDistributorId(newDistributorId ? newDistributorId.toString() : null);

    if (newRole === "owner" && Platform.OS === "web") {
      // New signup → settings to configure business; existing login → dashboard
      const destination = isNewUser ? "settings" : "dashboard";
      window.location.href = `http://localhost:5173/${destination}?token=${newToken}`;
    } else if (newRole === "delivery_boy") {
      // New signup → join distributor settings; existing login → home tabs
      if (isNewUser) {
        router.replace("/settings/distributors" as any);
      } else {
        router.replace("/(tabs)/home");
      }
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("jwt_token");
    await AsyncStorage.removeItem("user_role");
    await AsyncStorage.removeItem("distributor_id");
    setToken(null);
    setRole(null);
    setDistributorId(null);
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ token, role, distributorId, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
